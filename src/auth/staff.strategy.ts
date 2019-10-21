import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class StaffStrategey extends PassportStrategy(Strategy, 'staff') {
    constructor(
        private readonly authService: AuthService,
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateStaff(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        const payload = this.authService.loginJWT(user);
        return payload;
    }
}
