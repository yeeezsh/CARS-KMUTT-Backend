import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Option {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsString()
  label: string;

  value: string[];
}

// tslint:disable-next-line: max-classes-per-file
class FormField {
  @IsNotEmpty()
  @IsString()
  key: string;

  label?: string;

  value: string[];

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsBoolean()
  required: boolean;

  @ValidateNested({ each: true })
  @Type(() => Option)
  options: Option[];
}

// tslint:disable-next-line: max-classes-per-file
export class FormCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => FormField)
  @IsNotEmpty()
  fields: FormField[];
}
