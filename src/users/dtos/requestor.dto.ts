import { IsNotEmpty, IsEmail, IsString, IsIn, IsDate } from 'class-validator';

class FullName {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;
}

// tslint:disable-next-line: max-classes-per-file
export class RequestorDto {
  @IsNotEmpty()
  // tslint:disable-next-line: variable-name
  readonly _id: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsString()
  readonly studentId: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  readonly name: FullName;

  @IsNotEmpty()
  @IsDate()
  readonly createAt: Date;
}
