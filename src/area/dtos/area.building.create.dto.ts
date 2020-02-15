import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
