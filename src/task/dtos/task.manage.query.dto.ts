import { ApiProperty } from '@nestjs/swagger';

export class TaskManagerQuery {
  @ApiProperty({ type: Date, required: false })
  offset?: Date;

  @ApiProperty({ type: Date, required: false })
  limit?: Date;
}
