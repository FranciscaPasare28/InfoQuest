import { IsNotEmpty, IsString } from 'class-validator';
import { Section } from '../../sections/entities/section.entity';

export class GetDocument {
  @IsNotEmpty()
  @IsString()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  summary?: string;

  @IsNotEmpty()
  @IsString()
  uploadDate: string;

  sections: Section[];
}
