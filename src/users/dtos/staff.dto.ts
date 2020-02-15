import { IsNotEmpty, IsEmail, IsString, IsIn, IsDate } from 'class-validator';

export class StaffDto {
  @IsNotEmpty()
  // tslint:disable-next-line: variable-name
  readonly _id: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsIn(['staff', 'approver', 'admin'])
  readonly permission: string;

  @IsNotEmpty()
  @IsDate()
  readonly createAt: Date;
}
