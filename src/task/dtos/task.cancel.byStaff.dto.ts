import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TaskCancelByStaff {
  @ApiProperty({ required: true })
  @IsString()
  // tslint:disable-next-line: variable-name
  _id: string;

  @ApiProperty()
  desc: string;
}
