import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get('/')
    root(): string {
        return 'user controller';
    }
}
