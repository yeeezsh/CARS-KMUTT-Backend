import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TaskCreateSportDto } from './dtos/task.create.sport';
import { TaskService } from './task.service';
import { TaskSchedule } from './interfaces/task.schedule.interface';
import { Types } from 'mongoose';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation('createTaskSport')
  async createTaskSport(@Args('createTaskSport') args: TaskCreateSportDto) {
    await this.taskService.createTaskSport(args);
    return {};
  }

  @Query('taskSportSchedule')
  async getTaskSportSchedule(
    @Args('id') id: Types.ObjectId,
  ): Promise<TaskSchedule> {
    const schedule = await this.taskService.getSportSchedule(id);
    return schedule;
  }
}
