import { IsString } from 'class-validator';

export class CreateMessageHistoryDto {
  @IsString()
  userId: string;

  @IsString()
  message: string;

  @IsString()
  response: string;
}
