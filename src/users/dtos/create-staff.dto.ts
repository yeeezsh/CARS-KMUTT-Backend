
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

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
    readonly permission: string;
}
