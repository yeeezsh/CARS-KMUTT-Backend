
import { IsNotEmpty, IsEmail, IsString, IsIn } from 'class-validator';

export class CreateStaffDto {
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsIn(['staff', 'approver', 'admin'])
    readonly permission: string;
}
