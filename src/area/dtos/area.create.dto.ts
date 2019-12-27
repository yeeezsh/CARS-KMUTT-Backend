import { IsString, IsNumber, ValidateNested } from 'class-validator';
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
  @Field()
  @IsString()
  name: string;

  @Field(type => String, { nullable: true })
  building: string;

  @Field(type => String, { nullable: true })
  form: string; // required form module

  @Field(() => Int)
  @IsNumber()
  maxReserve: number;

  @Field(type => Required)
  @Type(type => Required)
  @ValidateNested({ each: true })
  required: Required;
}
