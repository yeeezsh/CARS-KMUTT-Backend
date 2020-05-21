import {
  Controller,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TaskstaffService } from './task.staff.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskManagerQuery } from './dtos/task.manage.query.dto';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { TaskCancelByStaff } from './dtos/task.cancel.byStaff.dto';
import { TaskService } from './task.service';

@Controller('task/staff')
export class TaskStaffController {
  constructor(
    private readonly taskStaffService: TaskstaffService,
    private readonly taskService: TaskService,
  ) {}

  @Get('/all')
  @UseGuards(AuthGuard('staff'))
  async getAllTask(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskStaffService.getAllTask(offset, limit);
  }

  @Get('/wait')
  @UseGuards(AuthGuard('staff'))
  async getRejectTask(@Query() query: TaskManagerQuery, @UserInfo() info) {
    const { offset, limit } = query;
    return await this.taskStaffService.getWaitTask(offset, limit);
  }

  @Get('/reject')
  @UseGuards(AuthGuard('staff'))
  async getReject(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskStaffService.getRejectTask(offset, limit);
  }

  @Get('/accept')
  // @UseGuards(AuthGuard('staff'))
  async getAccept(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskStaffService.getAcceptTask(offset, limit);
  }

  @Get('/drop')
  // @UseGuards(AuthGuard('staff'))
  async getDrop(@Query() query: TaskManagerQuery) {
    const { offset, limit } = query;
    return await this.taskStaffService.getDropTask(offset, limit);
  }

  @Post('/cancle')
  @UseGuards(AuthGuard('staff'))
  async cancleTaskByStaff(
    @UserInfo() user: UserSession,
    @Body() data: TaskCancelByStaff,
    @Res() res: Response,
  ) {
    try {
      const { username } = user;
      const { _id: taskId, desc } = data;
      await this.taskService.cancleTaskById(taskId, username, true, desc);
      return res.sendStatus(200);
    } catch (err) {
      return err;
    }
  }
}
