import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class CreateAreaBuildingDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  label: string;

  @ApiProperty({ enum: ['sport', 'area'] })
  @IsString()
  @IsIn(['sport', 'area'])
  type: string;
}
