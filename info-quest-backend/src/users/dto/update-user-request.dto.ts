import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateIf((object, value) => value)
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  vacationDays?: string[];

  @IsNumber()
  roleId?: number;
}
