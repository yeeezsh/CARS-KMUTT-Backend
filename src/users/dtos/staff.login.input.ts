
import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginStaffInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
