import { IsNotEmpty, IsString, IsIn, IsDate, IsNumber } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AreaBuildingCreateDto {

  @Field()
  @IsNotEmpty()
  @IsString()
  label: string;
}
