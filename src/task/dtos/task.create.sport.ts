import { ObjectType, Field } from 'type-graphql';
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class TimeSlot {
  @ApiProperty({ type: Date })
  @Field(() => String)
  @IsNotEmpty()
  start: Date;

  @ApiProperty({ type: Date })
  @Field(() => String)
  @IsNotEmpty()
  stop: Date;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class CreateTaskSportDto {
  @ApiProperty({ type: [TimeSlot] })
  @Field(() => TimeSlot)
  @Type(() => TimeSlot)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  time: TimeSlot[];

  @ApiProperty()
  @Field(() => String)
  @Type(() => String)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  requestor: string[];

  @ApiProperty()
  @Field()
  @IsNotEmpty()
  area: string;
}
