import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';
import { Type } from 'class-transformer';

@ObjectType()
class TimeSlot {
  @Field(() => String, { nullable: true })
  start: Date;

  @Field(() => String, { nullable: true })
  stop: Date;

  @Field(() => Boolean)
  allDay: boolean;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class TaskCreateDto {
  @Field(() => TimeSlot)
  @Type(() => TimeSlot)
  @ValidateNested({ each: true })
  time: TimeSlot[];

  @Field(() => String)
  requestor: string;

  @Field(() => [String])
  state: [string];

  @Field(() => String)
  area: string; // required area module

  @Field()
  @IsString()
  form: string; // required form module
}
