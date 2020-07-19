import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { formProviders } from './form.providers';
import { FormService } from './form.service';

@Module({
  imports: [DatabaseModule],
  providers: [FormService, ...formProviders],
  exports: [FormService],
})
export class FormModule {}
