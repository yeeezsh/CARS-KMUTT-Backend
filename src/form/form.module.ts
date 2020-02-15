import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { DatabaseModule } from '../database/database.module';
import { formProviders } from './form.providers';

@Module({
  imports: [DatabaseModule],
  providers: [FormService, ...formProviders],
  exports: [FormService],
})
export class FormModule {}
