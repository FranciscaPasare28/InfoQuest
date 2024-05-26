// src/notes/dto/create-note.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  x: number;

  @IsNotEmpty()
  @IsNumber()
  y: number;
}
