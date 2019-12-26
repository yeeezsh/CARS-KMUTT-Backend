import { Module } from '@nestjs/common';
import { FormResolver } from './form.resolver';
import { FormService } from './form.service';
import { DateScalar } from 'src/common/date.scalar';
import { JSONScalar } from 'src/common/json.scalar';
import { DatabaseModule } from 'src/database/database.module';
import { formProviders } from './form.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    DateScalar,
    JSONScalar,
    FormResolver,
    FormService,
    ...formProviders,
  ],
  exports: [FormService],
})
export class FormModule { }
