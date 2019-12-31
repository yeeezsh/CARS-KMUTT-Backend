import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { TaskCreateSportDto } from './dtos/task.create.sport';
import { TaskService } from './task.service';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation('createSportTask')
  async createSportTask(@Args('createSportTask') args: TaskCreateSportDto) {
    await this.taskService.createSportTask(args);
    return {};
  }
}
