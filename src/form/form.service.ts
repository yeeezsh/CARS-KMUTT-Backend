import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FormCreateDto } from './dtos/form.create.dto';
import { Form } from './interfaces/form.interface';

@Injectable()
export class FormService {
  constructor(@Inject('FORM_MODEL') private readonly formModel: Model<Form>) {}

  async createForm(data: FormCreateDto): Promise<Form> {
    try {
      const duplicated = await this.formModel.findOne({
        name: data.name,
      });
      if (duplicated) {
        throw new HttpException(
          'form name is duplicated',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const doc = new this.formModel(data);
      const saved = await doc.save();
      return saved;
    } catch (err) {
      throw err;
    }
  }

  async listForm(): Promise<Form[]> {
    try {
      return await this.formModel.find({}).lean();
    } catch (err) {
      throw err;
    }
  }

  async linkForm(id: string): Promise<Form> {
    try {
      const doc = await this.formModel.findById(id);
      if (!doc) {
        throw Error('form by _id is not existing');
      }
      return doc;
    } catch (err) {
      throw err;
    }
  }
}
