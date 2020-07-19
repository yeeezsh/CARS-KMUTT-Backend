import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import moment = require('moment');

class Reserve {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  interval: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  max: number;

  @ApiProperty({
    type: Date,
    example: moment()
      .startOf('day')
      .add(8, 'hour'),
  })
  @IsNotEmpty()
  start: Date;

  @ApiProperty({
    type: Date,
    example: moment()
      .startOf('day')
      .add(16, 'hour'),
  })
  @IsNotEmpty()
  stop: Date;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  allDay: boolean;
}

// tslint:disable-next-line: max-classes-per-file
class Required {
  @ApiProperty({ required: false, example: null })
  form?: string;

  @ApiProperty({ type: [String], example: [] })
  staff: string[];

  @ApiProperty({ type: Number, example: 1 })
  requestor: number;

  @ApiProperty({ type: String, example: '1-7' })
  week: string;
}

// tslint:disable-next-line: max-classes-per-file
export class CreateAreaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label?: string;

  @ApiProperty()
  building: string;

  @ApiProperty({ type: Required })
  @ValidateNested({ each: true })
  required: Required;

  @ApiProperty({ type: Number, example: 2 })
  foward: number;

  @ApiProperty({ type: [Reserve] })
  @ValidateNested({ each: true })
  reserve: Reserve[];
}
