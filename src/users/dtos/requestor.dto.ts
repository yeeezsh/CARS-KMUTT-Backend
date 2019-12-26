import { IsNotEmpty, IsEmail, IsString, IsIn, IsDate } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

class FullName {
  @Field(() => String)
  @IsString()
  readonly firstName: string;

  @Field(() => String)
  @IsString()
  readonly lastName: string;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class RequestorDto {
  @Field(type => String)
  @IsNotEmpty()
  // tslint:disable-next-line: variable-name
  readonly _id: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @Field(() => String)
  @IsString()
  readonly studentId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Field(() => JSON)
  readonly name: FullName;

  @Field(() => String)
  @IsNotEmpty()
  @IsDate()
  readonly createAt: Date;
}
