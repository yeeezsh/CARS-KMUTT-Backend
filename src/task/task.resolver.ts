import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { TaskCreateSportDto } from './dtos/task.create.sport';
import { TaskService } from './task.service';

@Resolver('Task')
export class TaskResolver {
    constructor(private readonly taskService: TaskService) { }

    @Mutation('createTaskSport')
    async createTaskSport(@Args('createTaskSport') args: TaskCreateSportDto) {
        await this.taskService.createTaskSport(args);
        return {};
    }
}
