import { Schema } from 'mongoose';

export interface Staff {
    _id: string;
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
