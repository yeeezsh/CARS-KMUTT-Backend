import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ObjectType, Field } from 'type-graphql';
import { Type } from 'class-transformer';

@ObjectType()
class TimeSlot {
  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  start: Date;

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  stop: Date;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class TaskCreateDto {
  @Field(type => [TimeSlot])
  @ValidateNested({ each: true })
  @Type(() => TimeSlot)
  time: TimeSlot[];

  @Field()
  @IsNotEmpty()
  @IsString()
  requestor: string;

  @Field()
  @IsNotEmpty()
  @IsArray()
  state: [string];

  @Field()
  @IsString()
  area: string; // required area module

  @Field()
  @IsString()
  form: string; // required form module
}
