import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.loginStaff({ username, password });
        if (user) { return user; }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
