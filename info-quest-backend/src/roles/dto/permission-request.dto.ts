import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { StringOrArray } from '../validator/array_or_string.validator';
import { Action } from '../type';
import { SubjectType } from '@casl/ability';

export class CreatePermissionRequestDto {
  @Validate(StringOrArray)
  @IsNotEmpty()
  action: Action | Action[];

  @Validate(StringOrArray)
  subject: SubjectType | SubjectType[];
}
