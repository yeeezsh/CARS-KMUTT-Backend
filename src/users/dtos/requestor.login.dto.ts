
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class RequestorLoginDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    @MaxLength(11)
    readonly username: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
