import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { CookieExtracter } from './helpers/cookie.extractor';
import { STAFF_PERMISSION } from 'src/users/schemas/staffs.schema';
const STAFFS = STAFF_PERMISSION;

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
    if (!STAFFS.includes(payload.group)) throw new UnauthorizedException();
    return {
      _id: payload._id,
      group: payload.group,
      email: payload.email,
    };
  }
}
