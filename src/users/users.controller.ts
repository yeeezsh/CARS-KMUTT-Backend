import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from './interfaces/user.session.interface';
import { QuotaType } from './interfaces/quota.interface';
import { Model } from 'mongoose';
import { Task } from 'src/task/interfaces/task.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
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

  @Get('/auth/logout')
  async userLogout(@Res() res: Response) {
    res.clearCookie('user');
    return res.clearCookie('Authorization');
  }

  @UseGuards(AuthGuard('requestor'))
  @Get('/quota')
  async quotaRequestor(@UserInfo() user: UserSession): Promise<QuotaType> {
    return {
      area: 0,
      sport: 0,
    };
  }
}
