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
import QuotaResponseApiDTO from './@dtos/response/quota.api.response.dto';
// import { StaffDto } from './dtos/staff.dto';
import { CreateStaffDto } from './@dtos/staff.create.dto';
import { UserSession } from './interfaces/user.session.interface';
import { UserQuotaService } from './user.quota.service';
// import { TaskService } from 'src/task/task.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
    private readonly usersService: UsersService,
    private readonly userQuotaService: UserQuotaService,
  ) {}

  @Post('/auth/staff')
  async loginStaff(@Body() body, @Res() res: Response) {
    const { username, password } = body;
    const user = await this.authService.loginStaff(username, password);
    res.cookie('Authorization', user.Authorization);
    res.cookie('user', user);
    return res.send({ ...user });
  }

  @Post('/auth/requestor')
  async loginRequestor(@Body() body, @Res() res: Response) {
    const { username, password } = body;
    const user = await this.authService.loginRequestor(username, password);
    res.cookie('Authorization', user.Authorization);
    res.cookie('user', user);
    return res.send({ ...user });
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
  async quotaRequestor(
    @UserInfo() user: UserSession,
  ): Promise<QuotaResponseApiDTO> {
    return this.userQuotaService.getSportQuota(user);
  }

  @Post('/staff')
  async createStaff(@Body() body: CreateStaffDto) {
    return this.usersService.createStaff(body);
  }
}
