import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigurationInterface } from 'src/config/configuration.interface';
import { STAFF_PERMISSION } from 'src/users/schemas/staffs.schema';
import { CookieExtracter } from './helpers/cookie.extractor';
const STAFFS = STAFF_PERMISSION;

@Injectable()
export class StaffJWTStrategy extends PassportStrategy(Strategy, 'staff') {
  constructor(@Inject('APP_CONFIG') appConfig: ConfigurationInterface) {
    super({
      jwtFromRequest: CookieExtracter,
      ignoreExpiration: true,
      secretOrKey: appConfig.jwt.secretKey,
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
