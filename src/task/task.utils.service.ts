import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDoc, TaskType } from './interfaces/task.interface';
import randomString from './utils/random-string';
import moment = require('moment');

export interface Vid {
  type: TaskType;
  key: 'A' | 'B' | 'C' | 'D' | 'E';
}

const VId: Vid[] = [
  { type: TaskType.sport, key: 'A' },
  { type: TaskType.common, key: 'B' },
  { type: TaskType.commonSport, key: 'C' },
  { type: TaskType.meetingClub, key: 'D' },
  { type: TaskType.meetingRoom, key: 'E' },
];
const STRING_NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const NUMBER_TO_ALPHABETS: Array<{ key: number; value: string }> = [
  { key: 0, value: 'Z' },
  { key: 1, value: 'Y' },
  { key: 2, value: 'X' },
  { key: 3, value: 'W' },
  { key: 4, value: 'V' },
  { key: 5, value: 'U' },
  { key: 6, value: 'T' },
  { key: 7, value: 'S' },
  { key: 8, value: 'R' },
  { key: 9, value: 'Q' },
];
@Injectable()
export class TaskUtilsService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
  ) {}

  private getPrefixVid(type: TaskType): string {
    return VId.find(key => key.type === type).key;
  }

  public async generateVirtualId(type: TaskType): Promise<string> {
    const MAX_LOOP = 50;
    const MAX_SECOND_LOOP = 75;
    let count = 0;
    let randomLength = 3;
    do {
      const now = moment();
      const prefix = this.getPrefixVid(type);
      const date = now.format('DD');
      const months = now.format('MMM').toUpperCase();
      const offsetYear = Number(now.format('YY').toString()[0]);
      const yearAlphabet = NUMBER_TO_ALPHABETS.find(
        key => key.key === Number(now.format('YY').toString()[1]),
      ).value;
      const random = randomString(randomLength, STRING_NUMBERS);
      const vid = prefix + date + months + offsetYear + random + yearAlphabet;
      const duplicated = await this.taskModel.findOne({ vid });
      if (!duplicated) return vid;
      count++;
      if (count >= MAX_LOOP) randomLength = 4;
    } while (count < MAX_SECOND_LOOP);
    throw new Error(`Retry generate vid ${count} count is max retry`);
  }
}
