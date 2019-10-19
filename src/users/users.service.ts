import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

// interfaces
import { Staff } from './interfaces/staff.interface';

// dtos
import { CreateStaffInput } from './dtos/staff.input';

// helpers
import { Hash } from './helpers/hash';

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

        const parse: CreateStaffInput = {
            ...create,
            password: await Hash.encrypt(create.password),
        };
        const doc = new this.staffModel(parse);
        const saved = await doc.save();
        return saved;
    }

    async listStaff(): Promise<Staff[]> {
        const doc = await this.staffModel.find({});
        return doc;
    }

}
