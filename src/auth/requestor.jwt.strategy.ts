import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class RequestorJWTStrategy extends PassportStrategy(
  Strategy,
  'requestor',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      permission: 'requestor',
    };
  }
}
