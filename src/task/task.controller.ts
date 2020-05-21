import {
  Controller,
  Get,
  UseGuards,
  Param,
  Res,
  BadRequestException,
  // Body,
  // Post,
  Query,
} from '@nestjs/common';
// import { AreaService } from 'src/area/area.service';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { TaskQueryService } from './task.query.service';
import { Response } from 'express';
import { TaskCancelByStaff } from './dtos/task.cancel.byStaff.dto';
import * as moment from 'moment';

@Controller('task')
export class TaskController {
  constructor(
    // private readonly areaService: AreaService,
    private readonly taskService: TaskService,
    private readonly historyService: TaskQueryService,
  ) {}

  @Get('/quickTask')
  @UseGuards(AuthGuard('staff'))
  async getQuickTask(
    @Query('id') areaId: string,
    @Query('start') start: string,
    @Query('stop') stop: string,
  ) {
    return this.taskService.getQuickTask(areaId, moment(start), moment(stop));
  }

  @Get('/last')
  @UseGuards(AuthGuard('requestor'))
  async getLastestTask(@UserInfo() user: UserSession) {
    const username = user.username;
    const data = await this.taskService.getLastestTask(username);
    return data;
  }

  @Get('/history')
  @UseGuards(AuthGuard('requestor'))
  async getHistory(@UserInfo() user: UserSession) {
    const { username } = user;
    return this.historyService.getAllHistory(username);
  }

  @Get('/requested')
  @UseGuards(AuthGuard('requestor'))
  async getRequested(@UserInfo() user: UserSession) {
    const { username } = user;
    return this.historyService.getAllRequested(username);
  }

  @Get('/wait')
  @UseGuards(AuthGuard('requestor'))
  async getWait(@UserInfo() user: UserSession) {
    const { username } = user;
    return this.historyService.getAllWait(username);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('requestor'))
  async getTask(@UserInfo() user: UserSession, @Param('id') taskId: string) {
    // for checking authorized nxt patch
    // const { username } = user;
    return this.taskService.getTaskById(taskId);
  }

  @Get('/:id/cancle')
  @UseGuards(AuthGuard('requestor'))
  async cancleTask(
    @UserInfo() user: UserSession,
    @Param('id') taskId: string,
    @Res() res: Response,
  ) {
    try {
      console.log('cancle task', taskId);
      const { username } = user;
      await this.taskService.cancleTaskById(taskId, username);
      return res.sendStatus(200);
    } catch (err) {
      return err;
    }
  }

  @Get('/:id/confirm')
  @UseGuards(AuthGuard('requestor'))
  async confirmTask(
    @UserInfo() user: UserSession,
    @Param('id') taskId: string,
    @Res() res: Response,
  ) {
    try {
      console.log('confirm task', taskId);
      const { username } = user;
      await this.taskService.confirmTaskById(taskId, username);
      return res.sendStatus(200);
    } catch (err) {
      return new BadRequestException(err);
    }
  }
}
