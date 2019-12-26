import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { Form } from './interfaces/form.interface';
import { FormCreateDto } from './dtos/form.create.dto';

@Injectable()
export class FormService {
    constructor(
        @Inject('FORM_MODEL') private readonly formModel: Model<Form>,
    ) { }

    async createForm(data: FormCreateDto): Promise<Form> {
        try {
            const duplicated = await this.formModel.findOne({
                name: data.name,
            });
            if (duplicated) {
                throw new HttpException('label duplicated', HttpStatus.NOT_ACCEPTABLE);
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

}
