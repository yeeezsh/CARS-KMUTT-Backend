import { IsDate, IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { STAFF_PERMISSION } from '../schemas/staffs.schema';

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
  @IsIn(STAFF_PERMISSION)
  readonly group: string;

  @IsNotEmpty()
  @IsDate()
  readonly createAt: Date;
}
