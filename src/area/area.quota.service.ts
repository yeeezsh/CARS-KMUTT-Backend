import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDoc } from 'src/task/interfaces/task.interface';
import { AreaDoc } from './interfaces/area.interface';

@Injectable()
export class AreaQuotaService {
  constructor(
    private readonly areaModel: Model<AreaDoc>,
    private readonly taskModel: Model<TaskDoc>,
  ) {}

  async validateAreaQuotaByUser(
    areaId: string,
    userId: string,
  ): Promise<boolean> {
    try {
    } catch (err) {
      throw err;
    }
    return false;
  }
}
