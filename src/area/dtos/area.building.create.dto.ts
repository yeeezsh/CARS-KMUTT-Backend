import { IsString, IsIn } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class CreateAreaBuildingDto {
  @ApiProperty({ type: 'string' })
  @Field()
  @IsString()
  name: string;

  @ApiProperty({ type: 'string' })
  @Field()
  @IsString()
  label: string;

  @ApiProperty({ enum: ['sport', 'area'] })
  @Field()
  @IsString()
  @IsIn(['sport', 'area'])
  type: string;
}
