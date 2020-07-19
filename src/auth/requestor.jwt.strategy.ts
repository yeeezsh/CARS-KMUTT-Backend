import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { CookieExtracter } from './helpers/cookie.extractor';

@Injectable()
export class RequestorJWTStrategy extends PassportStrategy(
  Strategy,
  'requestor',
) {
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
      username: payload.username,
      studentId: payload.studentId || null,
      email: payload.email,
      group: 'requestor',
    };
  }
}
