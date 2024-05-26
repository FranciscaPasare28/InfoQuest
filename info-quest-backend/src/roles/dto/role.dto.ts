import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Permission } from '../entities/permission.entity';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  permissions?: Permission[];
}
