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
import { TaskStaffQuery } from './dtos/task.staff.query.dto';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { TaskCancelByStaff } from './dtos/task.cancel.byStaff.dto';
import { TaskService } from './task.service';
import { TaskManage } from './interfaces/task.manage.interface';

@Controller('task/staff')
export class TaskStaffController {
  constructor(
    private readonly taskStaffService: TaskstaffService,
    private readonly taskService: TaskService,
  ) {}

  @Get('/all')
  @UseGuards(AuthGuard('staff'))
  async getAllTask(@Query() query: TaskStaffQuery, @Res() res: Response) {
    try {
      const { current, size, orderCol, order } = query;
      const offset = (current - 1) * Number(size);
      const doc = await this.taskStaffService.getAllTask(
        offset,
        Number(size),
        orderCol,
        Number(order),
      );
      return res.send(doc);
    } catch (err) {
      return res.status(500).send(String(err));
    }
  }

  @Get('/wait')
  @UseGuards(AuthGuard('staff'))
  async getRejectTask(
    @Query() query: TaskStaffQuery,
    @UserInfo() info,
    @Res() res: Response,
  ) {
    try {
      const { current, size, orderCol, order } = query;
      const offset = (current - 1) * Number(size);
      const doc = await this.taskStaffService.getWaitTask(
        offset,
        Number(size),
        orderCol,
        Number(order),
      );
      return res.send(doc);
    } catch (err) {
      return res.status(500).send(String(err));
    }
  }

  @Get('/reject')
  @UseGuards(AuthGuard('staff'))
  async getReject(@Query() query: TaskStaffQuery, @Res() res: Response) {
    try {
      const { current, size, orderCol, order } = query;
      const offset = (current - 1) * Number(size);
      const doc = await this.taskStaffService.getRejectTask(
        offset,
        Number(size),
        orderCol,
        Number(order),
      );
      return res.send(doc);
    } catch (err) {
      return res.status(500).send(String(err));
    }
  }

  @Get('/accept')
  @UseGuards(AuthGuard('staff'))
  async getAccept(@Query() query: TaskStaffQuery, @Res() res: Response) {
    try {
      const { current, size, orderCol, order } = query;
      const offset = (current - 1) * Number(size);
      const doc = await this.taskStaffService.getAcceptTask(
        offset,
        Number(size),
        orderCol,
        Number(order),
      );
      return res.send(doc);
    } catch (err) {
      return res.status(500).send(String(err));
    }
  }

  @Get('/drop')
  @UseGuards(AuthGuard('staff'))
  async getDrop(@Query() query: TaskStaffQuery, @Res() res: Response) {
    const { current, size, orderCol, order } = query;
    const offset = (current - 1) * Number(size);
    const doc = await this.taskStaffService.getDropTask(
      offset,
      Number(size),
      orderCol,
      Number(order),
    );
    return res.send(doc);
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
      return res.status(500).send(String(err));
    }
  }

  @Post('/accept')
  @UseGuards(AuthGuard('staff'))
  async approveTaskByStaff(
    @UserInfo() user: UserSession,
    @Body() data: TaskCancelByStaff,
    @Res() res: Response,
  ) {
    try {
      const { _id: taskId, desc } = data;
      await this.taskService.acceptTaskById(taskId, desc);
      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).send(String(err));
    }
  }
}
