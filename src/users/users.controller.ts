import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {

    @UseGuards(AuthGuard('staff'))
    @Post('/auth/staff')
    async loginStaff(@Request() req) {
        return req.user;
    }

}
