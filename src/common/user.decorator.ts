import { createParamDecorator } from '@nestjs/common';
import { UserSession } from 'src/users/interfaces/user.session.interface';

export const UserInfo = createParamDecorator(
  (data, req): UserSession => {
    return req.cookies.user;
  },
);
