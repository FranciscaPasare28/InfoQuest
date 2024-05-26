// // src/notes/notes.service.ts
// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Note } from './entities/note.entities';
// import { CreateNoteDto } from "./dto/create-note.dto";
// import { UpdateNoteDto } from "./dto/update-note.sto";
//
// @Injectable()
// export class NotesService {
//   constructor(
//     @InjectRepository(Note)
//     private notesRepository: Repository<Note>,
//   ) {}
//
//   async create(createNoteDto: CreateNoteDto): Promise<Note> {
//     // Additional validation can be added here
//     try {
//       const note = this.notesRepository.create(createNoteDto);
//       return await this.notesRepository.save(note);
//     } catch (error) {
//       throw new Error(`Failed to save note: ${error.message}`);
//     }
//   }
//
//   findAll() {
//     return this.notesRepository.find();
//   }
//
//   findOne(id: number) {
//     return this.notesRepository.findOne({ where: { id } });
//   }
//
//
//   async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
//     // Retrieve the existing note
//     const note = await this.notesRepository.findOne({ where: { id } });
//     if (!note) {
//       throw new NotFoundException(`Note with ID "${id}" not found`);
//     }
//
//     // Update the note
//     const updated = this.notesRepository.merge(note, updateNoteDto);
//     return this.notesRepository.save(updated);
//   }
//
//   remove(id: number) {
//     return this.notesRepository.delete(id);
//   }
// }
// src/notes/notes.service.ts
// src/notes/notes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.sto';
import { User } from "../users/entities/user.entity";

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      userId: user.id,
    });
    return await this.notesRepository.save(note);
  }

  findAll(user: User) {
    return this.notesRepository.find({ where: { userId: user.id } });
  }

  async findOne(id: number, user: User) {
    const note = await this.notesRepository.findOne({ where: { id, userId: user.id } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, user: User): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id, userId: user.id } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    const updated = this.notesRepository.merge(note, updateNoteDto);
    return this.notesRepository.save(updated);
  }

  async remove(id: number, user: User) {
    const result = await this.notesRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return result;
  }
}
