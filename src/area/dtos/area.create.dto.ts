import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class AreaCreateDto {

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  building: string;

  @Field()
  form: string; // required form module

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  maxTask: number;
}
