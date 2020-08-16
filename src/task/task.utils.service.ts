import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDoc, TaskType } from './interfaces/task.interface';
import randomString from './utils/random-string';
import moment = require('moment');

enum VIdType {
  A = TaskType.sport,
  B = TaskType.common,
  C = TaskType.commonSport,
  D = TaskType.meetingClub,
  E = TaskType.meetingRoom,
}
const STRING_NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
@Injectable()
export class TaskUtilsService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
  ) {}

  private getPrefixVid(type: TaskType): string {
    return VIdType[type];
  }

  public async generateVirtualId(type: TaskType): Promise<string> {
    const MAX_LOOP = 50;
    let count = 0;
    do {
      const prefix = this.getPrefixVid(type);
      const date = moment().format('DD');
      const months = moment().format('M');
      const random = randomString(3, STRING_NUMBERS);
      const vid = prefix + date + months + random;
      const duplicated = await this.taskModel.findOne({ vid });
      if (!duplicated) return vid;
      count++;
    } while (count < MAX_LOOP);
    throw new Error(`Retry generate vid ${count} count is max retry`);
  }
}
