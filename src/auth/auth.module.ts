import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { StaffJWTStrategy } from './staff.jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RequestorJWTStrategy } from './requestor.jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  providers: [AuthService, StaffJWTStrategy, RequestorJWTStrategy],
  exports: [AuthService],
})
export class AuthModule {}
