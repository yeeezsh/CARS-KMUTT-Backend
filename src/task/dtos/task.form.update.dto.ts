import { IsString } from 'class-validator';

// tslint:disable-next-line: max-classes-per-file
export class TaskFormUpdateDto {
  @IsString()
  id: string;

  forms: any[];
}
