import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import {
  StaffPermissionType,
  STAFF_PERMISSION,
} from 'src/users/schemas/staffs.schema';
import { TaskCancelByStaff } from './dtos/task.cancel.byStaff.dto';
import { TaskStaffQuery } from './dtos/task.staff.query.dto';
import { TaskService } from './task.service';
import { TaskstaffService } from './task.staff.service';

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

  @Get('/forward')
  @UseGuards(AuthGuard('staff'))
  async getForward(
    @UserInfo() user: UserSession,
    @Query() query: TaskStaffQuery,
    @Res() res: Response,
  ) {
    const { current, size, orderCol, order } = query;
    const offset = (current - 1) * Number(size);
    const userGroup = user.group as StaffPermissionType;
    if (!STAFF_PERMISSION.includes(userGroup))
      throw new BadRequestException('invalid user group');
    const doc = await this.taskStaffService.getForwardTask({
      offset,
      limit: Number(size),
      orderCol,
      order: Number(order),
      staffLevel: userGroup,
    });
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

  @Post('/forward')
  @UseGuards(AuthGuard('staff'))
  async forwardTaskByStaff(
    @UserInfo() user: UserSession,
    @Body() data: TaskCancelByStaff,
    @Res() res: Response,
  ) {
    try {
      const { _id: taskId, desc } = data;
      await this.taskStaffService.forwardTask(taskId, desc);
      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).send(String(err));
    }
  }
}
