import { ValidateNested, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
export class CreateTaskMeetingDto {
  @ApiProperty({ type: [TimeSlot] })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  time: TimeSlot[];

  @ApiProperty()
  @IsString()
  area: string;

  @ApiProperty()
  forms?: any;
}
