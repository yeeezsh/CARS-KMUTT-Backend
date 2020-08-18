import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
}
