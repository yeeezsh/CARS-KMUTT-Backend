import { IsNotEmpty, IsString, IsDate, IsNumber } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class AreaCreateDto {

  @Field()
  @IsNotEmpty()
  @IsString()
  label: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field()
  readonly form: string; // required form module

  @Field(() => Int)
  @IsNumber()
  readonly maxTask: number;

  @Field(() => Date, { nullable: true })
  @IsDate()
  readonly updateAt: Date;
}
