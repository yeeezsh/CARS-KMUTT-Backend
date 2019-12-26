import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class AreaCreateDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  building: string;

  @Field({ nullable: true })
  form: string; // required form module

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  maxTask: number;
}
