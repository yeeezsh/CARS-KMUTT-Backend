import { IsString, ValidateNested } from 'class-validator';

class TimeSlot {
  start: Date;

  stop: Date;

  allDay: boolean;
}

// tslint:disable-next-line: max-classes-per-file
export class TaskCreateDto {
  @ValidateNested({ each: true })
  time: TimeSlot[];

  requestor: string;

  state: [string];

  area: string; // required area module

  @IsString()
  form: string; // required form module
}
