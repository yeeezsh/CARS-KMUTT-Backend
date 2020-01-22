import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}
  @Post('/auth/staff')
  async loginStaff(@Body() body) {
    const { username, password } = body;
    return await this.authService.loginStaff(username, password);
  }

  @Post('/auth/requestor')
  async loginRequestor(@Body() body) {
    const { username, password } = body;
    return await this.authService.loginRequestor(username, password);
  }
}
