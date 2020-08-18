import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { TaskStateType } from '../interfaces/task.interface';

export class TaskSearch {
  @ApiProperty()
  @IsString()
  s: string;

  @ApiProperty()
  @IsOptional()
  vid: string;

  @ApiProperty()
  @IsOptional()
  areaName: string;

  @ApiProperty()
  @IsOptional()
  requestorName: string;

  @ApiProperty()
  @IsOptional()
  date: string;

  @ApiProperty({
    enum: [
      TaskStateType.ACCEPT,
      TaskStateType.REJECT,
      TaskStateType.WAIT,
      TaskStateType.DROP,
      TaskStateType.REQUESTED,
      TaskStateType.FORWARD,
    ],
    required: false,
    type: () => [TaskStateType],
  })
  @IsOptional()
  @IsArray()
  type?: TaskStateType[];
}
