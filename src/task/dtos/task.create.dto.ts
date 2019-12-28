import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';
import { Type } from 'class-transformer';

@ObjectType()
class TimeSlot {
  @Field(() => String)
  @IsNotEmpty()
  start: Date;

  @Field(() => String)
  @IsNotEmpty()
  stop: Date;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class TaskCreateDto {
  @Field(() => TimeSlot)
  @Type(() => TimeSlot)
  @ValidateNested({ each: true })
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
