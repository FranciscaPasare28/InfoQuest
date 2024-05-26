import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Section } from '../../sections/entities/section.entity';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  summary?: string;

  @IsNotEmpty()
  @IsDate()
  uploadDate: Date;

  sections: Section[];
}
