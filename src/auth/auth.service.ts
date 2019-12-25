import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Staff } from '../users/interfaces/staff.interface';
import { Requestor } from '../users/interfaces/requestor.interface';

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
            throw err;
        }
    }

    async loginJWTStaff(user: Staff) {
        const payload = { _id: user._id, permission: user.permission, email: user.email };
        const sign = await this.jwtService.signAsync(payload);
        return {
            access_token: sign,
            Authorization: 'Bearer' + ' ' + sign,
        };
    }

    async validateRequestor(username: string, inputPassword: string): Promise<any> {
        try {
            const user = await this.usersService.loginRequestor({ username, password: inputPassword });
            return user;
        } catch (err) {
            throw err;
        }
    }

    async loginJWTRequestor(user: Requestor) {
        const payload = { _id: user._id, username: user.username, studentId: user.studentId || null, email: user.email, permission: 'requestor' };
        const sign = await this.jwtService.signAsync(payload);
        return {
            access_token: sign,
            Authorization: 'Bearer' + ' ' + sign,
        };
    }

}
