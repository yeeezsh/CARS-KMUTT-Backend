import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

const REQUESTOR_DEFAULT = 'requestor';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginStaff(
    username: string,
    inputPassword: string,
  ): Promise<{
    username: string;
    email: string | undefined;
    group: string;
    Authorization: string;
  }> {
    try {
      const user = await this.usersService.loginStaff({
        username,
        password: inputPassword,
      });

      const payload = {
        _id: user._id,
        group: user.group,
        email: user.email,
        username: user.username,
      };
      const sign = await this.jwtService.signAsync(payload);
      return {
        ...payload,
        Authorization: sign,
      };
    } catch (err) {
      throw err;
    }
  }

  async loginRequestor(
    username: string,
    inputPassword: string,
  ): Promise<{
    _id: any;
    username: string;
    studentId: string | undefined;
    email: string | undefined;
    group: string;
    Authorization: string;
  }> {
    try {
      const user = await this.usersService.loginRequestor({
        username,
        password: inputPassword,
      });

      const payload = {
        _id: user._id,
        username: user.username,
        studentId: user.studentId || undefined,
        email: user.email || undefined,
        group: REQUESTOR_DEFAULT,
      };
      const sign = await this.jwtService.signAsync(payload);
      return {
        ...payload,
        Authorization: sign,
      };
    } catch (err) {
      throw err;
    }
  }
}
