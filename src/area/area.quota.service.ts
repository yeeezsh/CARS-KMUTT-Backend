import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDoc } from 'src/task/interfaces/task.interface';
import { AreaDoc } from './interfaces/area.interface';

@Injectable()
export class AreaQuotaService {
  constructor(
    @Inject('AREA_MODEL') private readonly areaModel: Model<AreaDoc>,
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
  ) {}

  async validateAreaQuotaByUser(
    areaId: string,
    userId: string,
  ): Promise<boolean> {
    return false;
  }
}
