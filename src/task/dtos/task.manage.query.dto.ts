import { ApiProperty } from '@nestjs/swagger';

export class TaskManagerQuery {
  @ApiProperty({ type: Date })
  offset?: Date;

  @ApiProperty({ type: Date })
  limit?: Date;
}
