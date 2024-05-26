// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateDocumentDto } from './dto/create-document.dto';
// import { GetDocument } from './dto/get-document';
// import { Document } from './entities/document.entities';
// import * as path from 'path';
// import { readdir, unlink } from 'node:fs/promises';
//
// const vectorestore_path = path.join(__dirname, '../../../storage/vectorestore');
//
// @Injectable()
// export class DocumentsService {
//   constructor(
//     @InjectRepository(Document)
//     private documentRepository: Repository<Document>,
//   ) {}
//
//   getAllDocuments(): Promise<Document[]> {
//     return this.documentRepository.find();
//   }
//
//   async createDocument(data: CreateDocumentDto): Promise<GetDocument> {
//     try {
//       const doc = await this.documentRepository.save(
//         this.documentRepository.create(data),
//       );
//       return this.docToGetDocumentDto(doc);
//     } catch (e) {
//       throw new BadRequestException();
//     }
//   }
//
//   async updateDocument(id: number): Promise<any> {
//     return this.documentRepository.findOneBy({ id: id }).then((document) => {
//       //document.chapters = chapters;
//       return this.documentRepository.save(document);
//     });
//   }
//
//   async deleteDocument(id: number): Promise<void> {
//     const doc = await this.documentRepository.findOneBy({ id: id });
//     try {
//       await unlink(doc.path)
//         .then(() => this.documentRepository.delete(id))
//         .then(async () => {
//           const files = await readdir(vectorestore_path);
//           await Promise.all(
//             files.map((file) => unlink(path.join(vectorestore_path, file))),
//           );
//
//           //await this.refactorVectorestore();
//         });
//     } catch (e) {
//       console.error(e);
//     }
//   }
//
//   private formatSize(size: number) {
//     let sizeCopy = size;
//     const units = ['B', 'KB', 'MB', 'GB'];
//     let unitIndex = 0;
//     while (sizeCopy >= 1024 && unitIndex < units.length - 1) {
//       sizeCopy /= 1024;
//       unitIndex += 1;
//     }
//     return `${sizeCopy.toFixed(2)} ${units[unitIndex]}`;
//   }
//
//   private docToGetDocumentDto(doc) {
//     return {
//       id: doc.id,
//       name: doc.name,
//       type: doc.type,
//       size: this.formatSize(doc.size),
//       uploadDate: doc.uploadDate.toLocaleDateString(),
//       //chapters: doc.chapters,
//     };
//   }
// }
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';
import * as path from 'path';
import { readdir, unlink } from 'node:fs/promises';
import { GetDocument } from './dto/get-document';
import { Section } from '../sections/entities/section.entity';
import { SectionsService } from '../sections/sections.service';

import { ChainService } from './chain.service';
import { TextLoader } from 'langchain/document_loaders';
import { FaissStore } from 'langchain/vectorstores/faiss';
//import pdfParse from 'pdf-parse';
import { Document as DocumentLangchain } from 'langchain/document';
import * as fs from 'fs'; // Importă modulul fs întreg, care include readdirSync

const vectorestore_path = path.join(__dirname, '../../../storage/vectorestore');

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    private sectionService: SectionsService,
    private readonly chainService: ChainService,
  ) {}

  async getDocuments(): Promise<GetDocument[]> {
    const doc = await this.documentRepository.find({
      relations: {
        sections: true,
      },
    });

    return doc.map((d) => this.docToGetDocumentDto(d));
  }

  async findDocumentByPath(path: string) {
    return this.documentRepository.findOne({
      where: {
        path: path,
      },
      relations: ['sections'],
    });
  }

  async createDocument(data: CreateDocumentDto): Promise<GetDocument> {
    try {
      const newDocument = await this.documentRepository.save(
        this.documentRepository.create(data),
      );
      return this.docToGetDocumentDto(newDocument);
    } catch (error) {
      console.error('Error creating document:', error);
      throw new BadRequestException('Error occurred during document creation');
    }
  }

  async updateDocument(id: number, sections: Array<Section>): Promise<any> {
    try {
      const document = await this.documentRepository.findOneBy({ id });

      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }

      document.sections = sections;

      return await this.documentRepository.save(document);
    } catch (error) {
      console.error('Error updating document:', error);
      throw new InternalServerErrorException('Failed to update document');
    }
  }
  //
  // async deleteDocument(id: number): Promise<void> {
  //   let doc;
  //
  //   try {
  //     doc = await this.documentRepository.findOneBy({ id });
  //     if (!doc) {
  //       throw new NotFoundException(`Document with ID ${id} not found`);
  //     }
  //   } catch (error) {
  //     console.error('Error finding document:', error);
  //     throw new BadRequestException(
  //       'Error occurred while finding the document',
  //     );
  //   }
  //
  //   try {
  //     await unlink(doc.path);
  //   } catch (error) {
  //     console.error('Error deleting the file:', error);
  //     throw new BadRequestException(
  //       'Failed to delete the file associated with the document',
  //     );
  //   }
  //
  //   try {
  //     await this.documentRepository.delete(id);
  //   } catch (error) {
  //     console.error('Error deleting document from the database:', error);
  //     throw new BadRequestException(
  //       'Failed to delete the document from the database',
  //     );
  //   }
  //
  //   try {
  //     await this.clearVectorestoreDirectory();
  //   } catch (error) {
  //     console.error('Error clearing vector store directory:', error);
  //     throw new BadRequestException(
  //       'Failed to clear the vector store directory',
  //     );
  //   }
  // }

  async deleteDocument(id: number): Promise<void> {
    let doc;
    try {
      doc = await this.documentRepository.findOneBy({ id });
      if (!doc) {
        throw new Error(`Document with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Error finding document with ID ${id}:`, error);
      throw new Error(`Failed to find document with ID ${id}`);
    }

    try {
      await unlink(doc.path);
    } catch (error) {
      console.error(`Error deleting the file for document ID ${id}:`, error);
      throw new Error(`Failed to delete file for document ID ${id}`);
    }

    try {
      await this.documentRepository.delete(id);
    } catch (error) {
      console.error(
        `Error deleting the document from the database for ID ${id}:`,
        error,
      );
      throw new Error(
        `Failed to delete document from the database for ID ${id}`,
      );
    }

    try {
      const files = await readdir(vectorestore_path);
      await Promise.all(
        files.map((file) => unlink(path.join(vectorestore_path, file))),
      );
      await this.refactorVectorestore();
    } catch (error) {
      console.error(
        `Error cleaning vectorestore directory after deleting document ID ${id}:`,
        error,
      );
      throw new Error(
        `Failed to clean vectorestore directory for document ID ${id}`,
      );
    }
  }

  async clearVectorestoreDirectory() {
    try {
      const files = await readdir(vectorestore_path);
      await Promise.all(
        files.map((file) => unlink(path.join(vectorestore_path, file))),
      );
    } catch (error) {
      console.error('Error clearing Vectorestore directory:', error);
    }
  }

  private formatSize(size: number) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let sizeCopy = size;

    for (let unitIndex = 0; unitIndex < units.length - 1; unitIndex++) {
      if (sizeCopy < 1024) {
        return `${sizeCopy.toFixed(2)} ${units[unitIndex]}`;
      }
      sizeCopy /= 1024;
    }

    return `${sizeCopy.toFixed(2)} ${units[units.length - 1]}`;
  }

  async refactorVectorestore(): Promise<void> {
    const newDocuments: DocumentLangchain[] = [];
    const pathToDocs = path.join(__dirname, '../../../storage/docs');
    const allDocs = fs.readdirSync(pathToDocs);
    if (allDocs.length !== 0) {
      for (const documentName of allDocs) {
        const pathToDoc = path.join(pathToDocs, documentName);
        const loader = new TextLoader(pathToDoc);
        const doc = await loader.load();
        const docs = await this.chainService.getSplitter().splitDocuments(doc);
        newDocuments.push(...docs);
      }
    } else {
      await this.chainService.initializeChain();
    }
    const vectorestores = await FaissStore.fromDocuments(
      newDocuments,
      this.chainService.getEmbeddings(),
    );
    await vectorestores.save(vectorestore_path);
    await this.chainService.initializeChain();
  }

  private docToGetDocumentDto(doc) {
    return {
      id: doc.id,
      name: doc.name,
      type: doc.type,
      size: this.formatSize(doc.size),
      summary: doc.summary,
      uploadDate: doc.uploadDate.toLocaleDateString(),
      sections: doc.sections,
    };
  }
}

