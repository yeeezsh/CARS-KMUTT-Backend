import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { TaskManageService } from './task.manage.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskManagerQuery } from './dtos/task.manage.query.dto';
import { UserInfo } from 'src/common/user.decorator';

@Controller('task/manage')
export class TaskManageController {
  constructor(private readonly taskManageService: TaskManageService) {}

  @UseGuards(AuthGuard('staff'))
  @Get('/all')
  async getAllTask(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getAllTask(offset, limit);
  }

  @UseGuards(AuthGuard('staff'))
  @Get('/wait')
  async getRejectTask(@Query() query: TaskManagerQuery, @UserInfo() info) {
    const { offset, limit } = query;
    return await this.taskManageService.getWaitTask(offset, limit);
  }

  @UseGuards(AuthGuard('staff'))
  @Get('/reject')
  async getReject(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getRejectTask(offset, limit);
  }

  @UseGuards(AuthGuard('staff'))
  @Get('/accept')
  async getAccept(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getAcceptTask(offset, limit);
  }
}
