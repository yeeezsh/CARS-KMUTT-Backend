import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RequestorLoginDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
