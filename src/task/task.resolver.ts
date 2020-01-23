import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateTaskSportDto } from './dtos/task.create.sport';
import { TaskService } from './task.service';
import { TaskSchedule } from './interfaces/task.schedule.interface';
import { Types } from 'mongoose';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation('createTaskSport')
  async createTaskSport(@Args('createTaskSport') args: CreateTaskSportDto) {
    await this.taskService.createSportTask(args);
    return {};
  }

  @Query('taskSportSchedule')
  async getTaskSportSchedule(@Args('id') id: string): Promise<TaskSchedule> {
    const schedule = await this.taskService.getSportSchedule(id);
    return schedule;
  }
}
