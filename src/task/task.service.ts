import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import * as moment from 'moment';

@Injectable()
export class TaskService {

    constructor(
        @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    ) { }

    async createSportTask() {

    }

}
