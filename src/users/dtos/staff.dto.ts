
import { IsNotEmpty, IsEmail, IsString, IsIn, IsDate } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class StaffDto {
    @Field()
    // @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    readonly _id: string;

    @Field()
    // @IsNotEmpty()
    // @IsString()
    readonly username: string;

    @Field()
    // @IsNotEmpty()
    // @IsString()
    readonly password: string;

    @Field()
    // @IsNotEmpty()
    // @IsEmail()
    readonly email: string;

    @Field()
    // @IsNotEmpty()
    // @IsIn(['staff', 'approver', 'admin'])
    readonly permission: string;

    @Field()
    // @IsNotEmpty()
    // @IsDate()
    readonly createAt: Date;
}
