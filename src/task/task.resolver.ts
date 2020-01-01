import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TaskCreateSportDto } from './dtos/task.create.sport';
import { TaskService } from './task.service';
import { TaskScheduleDto } from './dtos/task.schedule.dto';

@Resolver('Task')
export class TaskResolver {
    constructor(private readonly taskService: TaskService) { }

    @Mutation('createTaskSport')
    async createTaskSport(@Args('createTaskSport') args: TaskCreateSportDto) {
        await this.taskService.createTaskSport(args);
        return {};
    }

    @Query('taskSportSchedule')
    async getTaskSportSchedule(@Args('id') args: TaskScheduleDto) {
        const { id } = args;
        return {};
    }
}
