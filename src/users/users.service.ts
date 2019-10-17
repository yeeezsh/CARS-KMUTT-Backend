import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

// interfaces
import { Staff } from './interfaces/staff.interface';

// dtos
import { CreateStaffInput } from './dtos/create-staff.input';

@Injectable()
export class UsersService {
    constructor(
        @Inject('STAFF_MODEL') private readonly staffModel: Model<Staff>,
    ) { }

    async createStaff(create: CreateStaffInput): Promise<Staff> {
        const doc = new this.staffModel(create);
        const saved = await doc.save();
        return saved;
    }

    async listStaff(): Promise<Staff[]> {
        const doc = await this.staffModel.find({});
        return doc;
    }

}
