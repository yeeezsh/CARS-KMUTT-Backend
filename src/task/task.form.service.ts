import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { TaskFormCreateDto } from './dtos/task.form.create.dto';
import moment = require('moment');
import { TimeSlot } from './dtos/task.create.sport';

const INDEX_RESERVE_FORM = 1;

@Injectable()
export class TaskFormService {
  constructor(@Inject('TASK_MODEL') private readonly taskModel: Model<Task>) {}

  async createTask(requestorUsername: string, data: TaskFormCreateDto) {
    try {
      console.log(data);
      const projectForm = data.forms[INDEX_RESERVE_FORM];
      const {
        projectStartTime,
        projectStopTime,
        projectStartDate,
      } = projectForm;
      let { projectStopDate } = projectForm;
      const reserveMapped: TimeSlot[] = [];
      //   single day
      if (!projectStopDate) {
        projectStopDate = projectStartDate;
        reserveMapped.push({
          start: moment(
            `${moment(projectStartDate).format('DD-MM-YYYY')} ${moment(
              projectStartTime,
            ).format('HH:mm')}`,
            'DD-MM-YYYY HH:mm',
          ).toDate(),
          stop: moment(
            `${moment(projectStartDate).format('DD-MM-YYYY')} ${moment(
              projectStopTime,
            ).format('HH:mm')}`,
            'DD-MM-YYYY HH:mm',
          ).toDate(),
        });
      } else {
        //   range day
        const startDay = moment(projectStartDate).startOf('day');
        const stopDay = moment(projectStopDate).startOf('day');
        let curDay = moment(startDay);
        while (curDay.valueOf() < stopDay.valueOf()) {
          reserveMapped.push({
            start: moment(
              `${curDay.format('DD-MM-YYYY')} ${moment(projectStartTime).format(
                'HH:mm',
              )}`,
              'DD-MM-YYYY HH:mm',
            ).toDate(),
            stop: moment(
              `${curDay.format('DD-MM-YYYY')} ${moment(projectStartTime).format(
                'HH:mm',
              )}`,
              'DD-MM-YYYY HH:mm',
            ).toDate(),
          });
          curDay = moment(curDay.add(1, 'day'));
        }
      }

      const doc = new this.taskModel({
        state: ['wait'],
        reserve: reserveMapped,
        requestor: [{ username: requestorUsername, confirm: true }],
        building: data.area._id,
      });

      await doc.save();
      return doc;
    } catch (err) {
      throw err;
    }
  }
}
