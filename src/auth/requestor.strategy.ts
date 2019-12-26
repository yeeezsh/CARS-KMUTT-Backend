import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class RequestorStrategy extends PassportStrategy(Strategy, 'requestor') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateRequestor(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = this.authService.loginJWTRequestor(user);
    return payload;
  }
}
