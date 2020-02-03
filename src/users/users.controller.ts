import { Controller, Post, Body, Res } from '@nestjs/common';
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
    return res.send(user);
  }

  @Post('/auth/requestor')
  async loginRequestor(@Body() body, @Res() res: Response) {
    const { username, password } = body;
    const user = await this.authService.loginRequestor(username, password);
    res.cookie('Authorization', user.Authorization);
    return res.send(user);
  }
}
