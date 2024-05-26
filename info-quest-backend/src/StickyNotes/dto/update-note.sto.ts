// // src/notes/dto/update-note.dto.ts
// import { IsOptional, IsString, IsNumber } from 'class-validator';
//
// export class UpdateNoteDto {
//
//   @IsOptional()
//   @IsString()
//   content?: string;
//
//   @IsOptional()
//   @IsString()
//   color?: string;
//
//   @IsOptional()
//   @IsNumber()
//   x?: number;
//
//   @IsOptional()
//   @IsNumber()
//   y?: number;
// }

// import { CreateNoteDto } from "./create-note.dto";
//
// export class UpdateNoteDto extends CreateNoteDto {}
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  x?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  y?: number;
}
