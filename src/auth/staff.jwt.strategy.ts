import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { CookieExtracter } from './helpers/cookie.extractor';

@Injectable()
export class StaffJWTStrategy extends PassportStrategy(Strategy, 'staff') {
  constructor() {
    super({
      jwtFromRequest: CookieExtracter,
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return {
      _id: payload._id,
      permission: payload.permission,
      email: payload.email,
    };
  }
}
