import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { APP_CONFIG } from 'src/config/config.constant';
import { ConfigurationInterface } from 'src/config/configuration.interface';
import { CookieExtracter } from './helpers/cookie.extractor';

@Injectable()
export class RequestorJWTStrategy extends PassportStrategy(
  Strategy,
  'requestor',
) {
  constructor(@Inject(APP_CONFIG) appConfig: ConfigurationInterface) {
    super({
      jwtFromRequest: CookieExtracter,
      ignoreExpiration: true,
      secretOrKey: appConfig.jwt.secretKey,
    });
  }

  async validate(payload: any) {
    return {
      _id: payload._id,
      username: payload.username,
      studentId: payload.studentId || null,
      email: payload.email,
      group: 'requestor',
    };
  }
}
