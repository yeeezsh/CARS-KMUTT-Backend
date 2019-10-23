import { Schema } from 'mongoose';

export interface Staff {
    _id: Schema.Types.ObjectId;
    username: string;
    password?: string;
    email: string;
    permission: StaffPermission;
    createAt: Date;
}

interface StaffPermission {
    position: 'staff' | 'approver' | 'admin';
    approve: boolean;
    permitArea: Schema.Types.ObjectId[];
}
