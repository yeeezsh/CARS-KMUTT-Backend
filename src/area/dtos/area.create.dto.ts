import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment = require('moment');

@ObjectType()
class Reserve {
  @ApiProperty({ type: Number })
  @Field(() => Int)
  @IsNotEmpty()
  interval: number;

  @ApiProperty({ type: Number })
  @Field(() => Int)
  @IsNotEmpty()
  max: number;

  @ApiProperty({
    type: Date,
    example: moment()
      .startOf('day')
      .add(8, 'hour'),
  })
  @Field(() => String)
  @IsNotEmpty()
  start: Date;

  @ApiProperty({
    type: Date,
    example: moment()
      .startOf('day')
      .add(16, 'hour'),
  })
  @Field(() => String)
  @IsNotEmpty()
  stop: Date;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
class Required {
  @ApiProperty({ required: false, example: undefined })
  @Field(() => String, { nullable: true })
  form: string;

  @ApiProperty({ type: [String], example: [] })
  @Field(() => String, { nullable: true })
  staff: string[];

  @ApiProperty({ type: Number, example: 0 })
  @Field(() => Int)
  requestor: number;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class CreateAreaDto {
  @ApiProperty()
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  label?: string;

  @ApiProperty()
  @Field(() => String, { nullable: true })
  building: string;

  @ApiProperty({ type: Required })
  @Field(() => Required)
  @Type(() => Required)
  @ValidateNested({ each: true })
  required: Required;

  @ApiProperty({ type: [Reserve] })
  @Field(() => Reserve)
  @Type(() => Reserve)
  @ValidateNested({ each: true })
  reserve: Reserve[];
}
