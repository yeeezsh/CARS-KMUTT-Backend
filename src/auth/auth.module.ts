import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { RequestorJWTStrategy } from './requestor.jwt.strategy';
import { StaffJWTStrategy } from './staff.jwt.strategy';

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
