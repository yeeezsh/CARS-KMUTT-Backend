import { ApiProperty } from '@nestjs/swagger';

export class TaskStaffQuery {
  @ApiProperty({ type: String, required: false })
  current?: number;

  @ApiProperty({ type: String, required: false })
  size?: number;

  @ApiProperty({ type: String, required: false })
  orderCol: string;

  @ApiProperty({ type: String, required: false })
  order?: '1' | '-1';
}
