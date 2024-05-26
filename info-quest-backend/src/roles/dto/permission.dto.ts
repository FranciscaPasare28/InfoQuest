import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';

import { Action } from '../type';
import { SubjectType } from '@casl/ability';
import { StringOrArray } from '../validator/array_or_string.validator';
import { Role } from '../entities/role.entity';

export class CreatePermissionDto {
  @Validate(StringOrArray)
  @IsNotEmpty()
  action: Action | Action[];

  @Validate(StringOrArray)
  subject: SubjectType | SubjectType[];

  @IsArray()
  roles: Role[];
}
