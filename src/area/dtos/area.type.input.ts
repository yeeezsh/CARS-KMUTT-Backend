import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateAreaTypeInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  readonly label: string;

  @Field(() => Date)
  @IsDate()
  readonly updateAt: Date;
}
