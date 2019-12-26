import { IsNotEmpty, IsString, IsDate, IsNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateAreaInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  readonly label: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  readonly form: string;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly maxTask: number;

  @Field(() => Date)
  @IsDate()
  readonly updateAt: Date;
}
