import { IsNotEmpty, IsString } from 'class-validator';

export class StaffLoginDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
