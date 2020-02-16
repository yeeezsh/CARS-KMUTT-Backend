import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { TaskManageService } from './task.manage.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskManagerQuery } from './dtos/task.manage.query.dto';

@Controller('task/manage')
export class TaskManageController {
  constructor(private readonly taskManageService: TaskManageService) {}

  //   @UseGuards(AuthGuard('requestor'))

  @Get('/all')
  async getAllTask(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getAllTask(offset, limit);
  }

  @Get('/wait')
  async getRejectTask(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getWaitTask(offset, limit);
  }

  @Get('/reject')
  async getReject(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getRejectTask(offset, limit);
  }
  @Get('/accept')
  async getAccept(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getAcceptTask(offset, limit);
  }
}
