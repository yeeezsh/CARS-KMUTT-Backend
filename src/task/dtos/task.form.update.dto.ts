import { IsArray, IsString } from 'class-validator';

// tslint:disable-next-line: max-classes-per-file
export class TaskFormUpdateDto {
  @IsString()
  id: string;

  @IsArray()
  forms: any[];
}
