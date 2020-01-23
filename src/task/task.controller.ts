import { Controller, Get, Post, Body } from '@nestjs/common';
import { AreaService } from 'src/area/area.service';
import { CreateTaskSportDto } from './dtos/task.create.sport';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly areaService: AreaService,
    private readonly taskService: TaskService,
  ) {}

  @Post('/sport')
  async createSportTask(@Body() body: CreateTaskSportDto) {
    await this.taskService.createSportTask(body);
    return;
  }
}
