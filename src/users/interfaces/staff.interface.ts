import { Schema} from 'mongoose';
// import { Schema } from 'inspector';

export interface Staff {
    _id: string;
    username: string;
    password: string;
    email: string;
    permission: StaffPermission;
    createAt: Date;
}

interface StaffPermission {
    position: 'staff' | 'approver' | 'admin';
    approve: boolean;
    // permitArea: [Area['_id']];
    // permitArea: string[];
    permitArea: Schema.Types.ObjectId[];
}
