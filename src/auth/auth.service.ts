import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Staff } from '../users/interfaces/staff.interface';

@Injectable()

export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateStaff(username: string, inputPassword: string): Promise<any> {
        try {
            const user = await this.usersService.loginStaff({ username, password: inputPassword });
            const { password, ...result } = user;
            return result;
        } catch (err) {
            return null;
        }
    }

    async loginJWT(user: Staff) {
        const payload = { _id: user._id, permission: user.permission, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
