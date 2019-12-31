import { Resolver, Mutation } from '@nestjs/graphql';
import { TaskCreateSportDto } from './dtos/task.create.sport';

@Resolver('Task')
export class TaskResolver {
    @Mutation('createSportTask')
    async createSportTask(data: TaskCreateSportDto) {
        return {};
    }
}
