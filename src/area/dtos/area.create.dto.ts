import { IsString, IsNumber, IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';
import { Type } from 'class-transformer';

@ObjectType()
class Reserve {
  @Field(() => Int)
  interval: number;

  @Field(() => Int)
  max: number;

  @Field(() => Date)
  @IsDate()
  start: number;

  @Field(() => Date)
  @IsDate()
  stop: number;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
class Required {
  @Field(() => String, { nullable: true })
  form: string;

  @Field(() => String, { nullable: true })
  staff: string[];

  @Field(() => Int)
  requestor: number;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class AreaCreateDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
  building: string;

  @Field(() => Required)
  @Type(() => Required)
  @ValidateNested({ each: true })
  required: Required;

  @Field(() => [Reserve])
  @Type(() => Reserve)
  @ValidateNested({ each: true })
  reserve: [Reserve];
}
