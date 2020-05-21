import { ApiProperty } from '@nestjs/swagger';

export class TaskStaffQuery {
  @ApiProperty({ type: Date, required: false })
  current?: number;

  @ApiProperty({ type: Date, required: false })
  size?: number;

  @ApiProperty({ type: Date, required: false })
  orderCol: string;

  @ApiProperty({ type: Date, required: false })
  order: number;
}
