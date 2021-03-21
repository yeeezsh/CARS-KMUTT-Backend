import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserInfo } from 'src/common/user.decorator';
import { TaskDoc } from 'src/task/interfaces/task.interface';
import { CreateStaffDto } from './dtos/staff.create.dto';
import { QuotaType } from './interfaces/quota.interface';
import { UserSession } from './interfaces/user.session.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
    private readonly usersService: UsersService,
  ) {}

  @Post('/auth/staff')
  async loginStaff(@Body() body, @Res() res: Response) {
    const { username, password } = body;
    const user = await this.authService.loginStaff(username, password);
    res.cookie('Authorization', user.Authorization);
    res.cookie('user', user);
    return res.send({ ...user, Authorization: undefined });
  }

  @Post('/auth/requestor')
  async loginRequestor(@Body() body, @Res() res: Response) {
    const { username, password } = body;
    const user = await this.authService.loginRequestor(username, password);
    res.cookie('Authorization', user.Authorization);
    res.cookie('user', user);
    return res.send({ ...user, Authorization: undefined });
  }

  @UseGuards(AuthGuard('requestor'))
  @Get('/auth/requestor')
  async validRequestorToken(@Res() res: Response) {
    return res.sendStatus(200);
  }

  @Get('/auth/logout')
  async userLogout(@Res() res: Response) {
    res.clearCookie('user');
    res.clearCookie('Authorization');
    return res.sendStatus(200);
  }

  @UseGuards(AuthGuard('requestor'))
  @Get('/quota')
  async quotaRequestor(@UserInfo() user: UserSession): Promise<QuotaType> {
    const MAX_QUOTAS = 1;
    const username = user.username;
    const reserve = await this.taskModel
      .find({
        state: {
          $nin: ['drop', 'reject'],
        },
        type: 'sport',
        requestor: {
          $elemMatch: {
            username,
          },
        },
        reserve: {
          $elemMatch: {
            start: {
              $gte: new Date(),
            },
          },
        },
      })
      .countDocuments();

    return {
      n: MAX_QUOTAS - reserve,
    };
  }

  @Post('/staff')
  async createStaff(@Body() body: CreateStaffDto) {
    return this.usersService.createStaff(body);
  }
}
