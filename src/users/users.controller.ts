import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}
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
}
