import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
class Option {
  @Field()
  @IsNotEmpty()
  @IsString()
  key: string;

  // @IsString()
  @Field({ nullable: true })
  label: string;

  @Field({ nullable: true })
  // @IsString()
  value: string;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
class FormField {
  @Field()
  @IsNotEmpty()
  @IsString()
  key: string;

  // @IsString()
  @Field({ nullable: true })
  label: string;

  @Field({ nullable: true })
  value: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  required: boolean;

  @Field(type => [Option], { nullable: true })
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

  @Field(type => [FormField])
  @ValidateNested({ each: true })
  @Type(() => FormField)
  @IsNotEmpty()
  fields: FormField[];
}
