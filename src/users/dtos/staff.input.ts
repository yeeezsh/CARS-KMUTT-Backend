
import { IsNotEmpty, IsEmail, IsString, IsIn } from 'class-validator';
import { Field, InputType, ArgsType } from 'type-graphql';

@InputType()
export class CreateStaffInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @Field()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @Field()
    @IsNotEmpty()
    @IsIn(['staff', 'approver', 'admin'])
    readonly permission: string;
}
