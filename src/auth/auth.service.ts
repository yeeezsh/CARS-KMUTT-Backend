import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Staff } from '../users/interfaces/staff.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async validateStaff(username: string, inputPassword: string): Promise<any> {
        const user = await this.usersService.loginStaff({ username, password: inputPassword });
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // async login(user: any) {
    //     const payload = { username: user.username, sub: user.userId };
    //     return {
    //         access_token: this.jwtService.sign(payload),
    //     };
    // }

    public async login(username: string, inputPassword: string): Promise<any | { status: number }> {
        return this.validateStaff(username, inputPassword).then((user) => {
            if (!user) {
                return { status: 404 };
            }
            const payload = { username: user.username, sub: user.userId };
            return {
                access_token: this.jwtService.sign(payload),
            };

        });
    }
}
