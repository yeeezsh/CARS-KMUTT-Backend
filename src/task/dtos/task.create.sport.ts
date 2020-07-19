import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class TimeSlot {
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  start: Date;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  stop: Date;

  @ApiProperty({ type: Boolean })
  allDay?: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export class CreateTaskSportDto {
  @ApiProperty({ type: [TimeSlot] })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  time: TimeSlot[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  requestor: string[];

  @ApiProperty()
  @IsString()
  area: string;

  @ApiProperty()
  @IsString()
  owner: string;
}
