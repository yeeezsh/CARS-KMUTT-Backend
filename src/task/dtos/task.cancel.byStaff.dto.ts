import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskCancelByStaff {
  @ApiProperty({ required: true })
  @IsString()
  // tslint:disable-next-line: variable-name
  _id: string;

  @ApiProperty()
  desc: string;
}
