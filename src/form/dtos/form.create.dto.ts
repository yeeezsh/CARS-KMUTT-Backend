import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
class Option {
  @Field()
  @IsNotEmpty()
  @IsString()
  key: string;

  @Field({ nullable: true })
  @IsString()
  label: string;

  @Field(() => String, { nullable: true })
  value: string[];
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
class FormField {
  @Field()
  @IsNotEmpty()
  @IsString()
  key: string;

  @Field({ nullable: true })
  label?: string;

  @Field(() => String, { nullable: true })
  value: string[];

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  required: boolean;

  @Field(() => Option, { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => Option)
  options: Option[];
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class FormCreateDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => FormField)
  @ValidateNested({ each: true })
  @Type(() => FormField)
  @IsNotEmpty()
  fields: FormField[];
}
