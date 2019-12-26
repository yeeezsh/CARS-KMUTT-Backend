import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class StaffLoginDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
