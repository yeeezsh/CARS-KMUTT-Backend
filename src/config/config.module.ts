import { Module } from '@nestjs/common';
import { AppConfigService } from './app.config.service';

@Module({
  imports: [],
  providers: [AppConfigService],
  exports: [],
})
export class ConfigModule {}
