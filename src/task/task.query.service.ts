import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { AreaService } from 'src/area/area.service';
import * as moment from 'moment';

interface TimeSchema {
    start: Date;
    stop: Date;
}

@Injectable()
export class TaskQueryService {
    constructor(
        @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
        private readonly areaService: AreaService,
    ) { }

    // async valid(areaID: string, time: TimeSchema[]) {
    async valid(areaID: string, time: TimeSchema[]) {
        try {
            const area = await this.areaService.getArea(areaID);
            //   validation area condition
            const areaTimes: Date[] = area.reserve.flatMap(e => {
                const start = moment(e.start);
                const stop = moment(e.stop);
                let partition = start;
                const arr = [];
                while (partition <= stop) {
                    arr.push(partition);
                    partition = partition.add(e.interval, 'minutes');
                }
                return arr;
            });

            const valid = areaTimes.map((e, ind, arr) => {
                if (ind === 0) { return null; }
                return [arr[ind - 1], e];
            }).filter(e => e)
            const foundRange = valid.map(e => {
                
            })

            // time.forEach(({ start: taskStart, stop: taskStop }) => {
            //     area.reserve.forEach(
            //         ({ start, stop, interval, max }) => {

            //         },
            //     );
            // })
            //   const reservedTask = await this.taskModel.find({

            //   })

        } catch (err) {
            throw err;
        }
    }
}
