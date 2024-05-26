import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class StringOrArray implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    return typeof value === 'string' || Array.isArray(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const value = validationArguments?.value;
    return `${value} is invalid. Please provide a string or array of strings.`;
  }
}
