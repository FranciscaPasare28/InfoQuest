import { IsNotEmpty, IsString } from 'class-validator';

export class SectionDto {
  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  permissionSubject: string;
}
