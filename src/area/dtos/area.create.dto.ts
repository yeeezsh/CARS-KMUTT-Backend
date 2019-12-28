import { IsString, IsNumber, IsNotEmpty, ValidateNested } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';
import { Type } from 'class-transformer';

@ObjectType()
class Required {
  @Field(type => String, { nullable: true })
  form: string;

  @Field(type => String, { nullable: true })
  staff: string[];

  @Field(type => Int)
  requestor: number;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class AreaCreateDto {
  @Field(type => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(type => String, { nullable: true })
  building: string;

  @Field(type => Int)
  @IsNumber()
  maxReserve: number;

  @Field(type => Required)
  @Type(type => Required)
  @ValidateNested({ each: true })
  required: Required;
}
