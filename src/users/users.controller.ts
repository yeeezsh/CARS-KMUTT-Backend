import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard('staff'))
  @Post('/auth/staff')
  async loginStaff(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('requestor'))
  @Post('/auth/requestor')
  async loginRequestor(@Request() req) {
    return req.user;
  }
}
