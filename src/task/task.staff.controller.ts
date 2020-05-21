import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { TaskstaffService } from './task.staff.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskManagerQuery } from './dtos/task.manage.query.dto';
import { UserInfo } from 'src/common/user.decorator';

@Controller('task/staff')
export class TaskStaffController {
  constructor(private readonly taskManageService: TaskstaffService) {}

  @Get('/all')
  @UseGuards(AuthGuard('staff'))
  async getAllTask(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getAllTask(offset, limit);
  }

  @Get('/wait')
  @UseGuards(AuthGuard('staff'))
  async getRejectTask(@Query() query: TaskManagerQuery, @UserInfo() info) {
    const { offset, limit } = query;
    return await this.taskManageService.getWaitTask(offset, limit);
  }

  @Get('/reject')
  @UseGuards(AuthGuard('staff'))
  async getReject(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getRejectTask(offset, limit);
  }

  @Get('/accept')
  // @UseGuards(AuthGuard('staff'))
  async getAccept(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getAcceptTask(offset, limit);
  }

  @Get('/drop')
  // @UseGuards(AuthGuard('staff'))
  async getDrop(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskManageService.getDropTask(offset, limit);
  }
}
