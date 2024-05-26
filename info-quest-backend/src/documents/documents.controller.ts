import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  UnprocessableEntityException,
  BadRequestException,
  Inject,
  HttpStatus,
} from '@nestjs/common';

import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { CreateDocumentDto } from './dto/create-document.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { GetDocument } from './dto/get-document';
import { Section } from '../sections/entities/section.entity';
import { ChainService } from './chain.service';
import { OpenAIService } from '../openai/openai.service';
import { PdfService } from './pdf.service';

import * as fs from 'fs';
import { UsersService } from '../users/users.service';
const pdfParse = require('pdf-parse');

function generateFilename(req, file, callback) {
  const extension: string = path.extname(file.originalname);
  const filename: string = uuidv4();
  callback(null, `${filename}${extension}`);
}

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly retrievalService: ChainService,
    private readonly openAIService: OpenAIService,
    private readonly pdfService: PdfService,
  ) {}
  @Get('all')
  async getAllSections(): Promise<GetDocument[]> {
    return this.documentsService.getDocuments();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'storage/docs',
        filename: generateFilename,
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GetDocument | HttpException> {
    if (!file) {
      throw new BadRequestException('Document must be provided');
    }

    const { fileTypeFromFile } = await (eval('import("file-type")') as Promise<
      typeof import('file-type')
    >);
    const meta = await fileTypeFromFile(file.path);
    if (!meta || 'application/pdf' !== meta.mime) {
      await fs.unlink(file.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
      throw new UnprocessableEntityException('File type not allowed');
    }

    if (file.mimetype === 'application/pdf') {
      const fileBuffer = await fs.readFileSync(file.path);
      const text = await this.pdfService.extractText(fileBuffer);
      const generateSummaryResult = await this.openAIService.generateSummary(
        text,
      );

      const summary = generateSummaryResult.summary;
      console.log(summary);
      console.log(file.originalname);
      if (file.originalname === 'Concedii.pdf') {
        await this.pdfService.extractVacationData(text);
      }
      // const summary = "ok";
      const document = await this.readDoc(file, meta, summary);
      return this.documentsService.createDocument(document);
    }
  }

  @Put(':id')
  async updateDocument(
    @Param('id') id: number,
    @Body() sections: Section[],
  ): Promise<any> {
    try {
      return await this.documentsService.updateDocument(id, sections);
    } catch (error) {
      throw new HttpException(
        'Eroare la actualizarea documentului',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: number): Promise<void> {
    try {
      return await this.documentsService.deleteDocument(id);
    } catch (error) {
      throw new HttpException(
        'Eroare la ștergerea documentului',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async readDoc(
    file,
    meta,
    summary: string,
  ): Promise<CreateDocumentDto> {
    const readFilePath = path.join(__dirname, '../../../', file.path);
    const dataBuffer = await fs.readFileSync(readFilePath);
    const pdfData = await pdfParse(dataBuffer);
    const name = file.originalname.replace('.pdf', '.txt');
    const writeFilePath = path.join(__dirname, '../../../storage/docs', name);
    await fs.unlink(readFilePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    if (fs.existsSync(writeFilePath)) {
      throw new BadRequestException('File already exists');
    } else {
      fs.writeFileSync(writeFilePath, pdfData.text);
      await this.documentsService.refactorVectorestore();
    }

    const currentDate = new Date();
    const sections: Section[] = [];

    return {
      name: file.originalname,
      path: writeFilePath,
      type: meta.mime,
      size: file.size,
      summary: summary,
      uploadDate: currentDate,
      sections: sections,
    };
  }
}
