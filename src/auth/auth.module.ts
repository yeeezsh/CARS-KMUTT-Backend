import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_CONFIG } from 'src/config/config.constant';
import { ConfigModule } from 'src/config/config.module';
import { ConfigProvider } from 'src/config/configuration.provider.interface';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { RequestorJWTStrategy } from './requestor.jwt.strategy';
import { StaffJWTStrategy } from './staff.jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [APP_CONFIG],
      useFactory: (appConfig: ConfigProvider) => ({
        secret: appConfig.jwt.secretKey,
        signOptions: { expiresIn: appConfig.jwt.expires },
      }),
    }),
  ],
  providers: [AuthService, StaffJWTStrategy, RequestorJWTStrategy],
  exports: [AuthService],
})
export class AuthModule {}
