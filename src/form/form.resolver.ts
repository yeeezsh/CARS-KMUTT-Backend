import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FormCreateDto } from './dtos/form.create.dto';
import { Form } from './interfaces/form.interface';
import { FormService } from './form.service';

@Resolver('Form')
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Mutation('createForm')
  async createForm(@Args('createForm') args: FormCreateDto): Promise<Form> {
    return await this.formService.createForm(args);
  }
}
