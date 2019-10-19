import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

// interfaces
import { Staff } from './interfaces/staff.interface';

import { CreateStaffInput } from './dtos/staff.input';

@Injectable()
export class UsersService {
    constructor(
        @Inject('STAFF_MODEL') private readonly staffModel: Model<Staff>,
    ) { }

    async createStaff(create: CreateStaffInput): Promise<Staff> {
        const duplicated = await Promise.all([
            this.staffModel.findOne({ username: create.username }),
            this.staffModel.findOne({ email: create.email }),
        ]);
        const valid = duplicated.filter(e => e);
        if (valid.length !== 0) {
            throw new Error('username or email is duplicated');
        }

        const doc = new this.staffModel(create);
        const saved = await doc.save();
        return saved;
    }

    async listStaff(): Promise<Staff[]> {
        const doc = await this.staffModel.find({});
        return doc;
    }

}
