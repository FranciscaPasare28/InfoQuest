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
import { Role } from '../../roles/entities/role.entity';

export class CreateUserDto {
  @IsString()
  @ValidateIf((object, value) => value)
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  vacationDays?: string[];

  @IsString()
  @ValidateIf((object, value) => value)
  refreshToken?: string;

  @IsString()
  @ValidateIf((object, value) => value)
  opsToken?: string;

  @IsNumber()
  roleId?: number;

  role?: Role;
}
