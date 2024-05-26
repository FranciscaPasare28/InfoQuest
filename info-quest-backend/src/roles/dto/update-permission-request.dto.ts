import { ApiProperty } from '@nestjs/swagger';
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

export class UpdatePermissionRequestDto {
  @Validate(StringOrArray)
  @IsNotEmpty()
  action?: Action | Action[];

  @Validate(StringOrArray)
  subject: SubjectType | SubjectType[];
}
