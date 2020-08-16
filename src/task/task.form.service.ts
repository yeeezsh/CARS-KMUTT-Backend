import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TimeSlot } from './dtos/task.create.sport';
import { TaskFormCreateDto } from './dtos/task.form.create.dto';
import { TaskFormUpdateDto } from './dtos/task.form.update.dto';
import { TaskDoc, TaskStateType, TaskType } from './interfaces/task.interface';
import moment = require('moment');

const INDEX_RESERVE_FORM = 1;
const DAY_FORMAT = 'DD-MM-YYYY';
const TIME_FORMAT = 'HH:mm';

@Injectable()
export class TaskFormService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
  ) {}

  private reserveTimeSlotMapping(projectForm): TimeSlot[] {
    const { projectStartTime, projectStopTime, projectStartDate } = projectForm;
    let { projectStopDate } = projectForm;

    const reserveMapped: TimeSlot[] = [];
    //   single day
    if (!projectStopDate) {
      projectStopDate = projectStartDate;
      reserveMapped.push({
        start: moment(
          `${moment(projectStartDate).format(DAY_FORMAT)} ${moment(
            projectStartTime,
          ).format(TIME_FORMAT)}`,
          `${DAY_FORMAT} ${TIME_FORMAT}`,
        ).toDate(),
        stop: moment(
          `${moment(projectStartDate).format(DAY_FORMAT)} ${moment(
            projectStopTime,
          ).format('HH:mm')}`,
          `${DAY_FORMAT} ${TIME_FORMAT}`,
        ).toDate(),
      });
    } else {
      //   range day
      const startDay = moment(projectStartDate).startOf('day');
      const stopDay = moment(projectStopDate).startOf('day');
      let curDay = moment(startDay);
      while (curDay.valueOf() <= stopDay.valueOf()) {
        reserveMapped.push({
          start: moment(
            `${curDay.format(DAY_FORMAT)} ${moment(projectStartTime).format(
              TIME_FORMAT,
            )}`,
            `${DAY_FORMAT} ${TIME_FORMAT}`,
          ).toDate(),
          stop: moment(
            `${curDay.format(DAY_FORMAT)} ${moment(projectStopTime).format(
              TIME_FORMAT,
            )}`,
            `${DAY_FORMAT} ${TIME_FORMAT}`,
          ).toDate(),
        });
        curDay = moment(curDay.add(1, 'day'));
      }
    }
    return reserveMapped;
  }

  async createTask(
    requestorUsername: string,
    data: TaskFormCreateDto,
    type: TaskType,
  ) {
    try {
      const projectForm = data.forms[INDEX_RESERVE_FORM];
      const doc = new this.taskModel({
        forms: data.forms,
        state: ['wait'],
        reserve: this.reserveTimeSlotMapping(projectForm),
        requestor: [{ username: requestorUsername, confirm: true }],
        area: data.area._id,
        type,
      });

      await doc.save();
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async updateTask(
    owner: string,
    taskId: string,
    data: TaskFormUpdateDto,
  ): Promise<void> {
    try {
      const task = await this.taskModel.findById(taskId);
      if (!task) {
        throw new BadRequestException('Task id is not exists');
      }

      const validOwner = task.requestor[0].username === owner;
      if (!validOwner)
        throw new BadRequestException(
          `You don't not have a permission for this task`,
        );

      const projectForm = data.forms[INDEX_RESERVE_FORM];
      task.forms = data.forms;
      task.reserve = this.reserveTimeSlotMapping(projectForm);
      task.state = [...task.state, TaskStateType.RESEND];
      await task.save();
      return;
    } catch (err) {
      throw err;
    }
  }
}
