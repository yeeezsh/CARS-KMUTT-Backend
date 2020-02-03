import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginStaff(
    username: string,
    inputPassword: string,
  ): Promise<{ Authorization: string }> {
    try {
      const user = await this.usersService.loginStaff({
        username,
        password: inputPassword,
      });

      const payload = {
        _id: user._id,
        permission: user.permission,
        email: user.email,
      };
      const sign = await this.jwtService.signAsync(payload);
      return {
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
    permission: string;
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
        permission: 'requestor',
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
