import { Module } from '@nestjs/common';
import { FormResolver } from './form.resolver';
import { FormService } from './form.service';
import { DateScalar } from 'src/common/date.scalar';
import { JSONScalar } from 'src/common/json.scalar';

@Module({
  providers: [DateScalar, JSONScalar, FormResolver, FormService],
})
export class FormModule {}
