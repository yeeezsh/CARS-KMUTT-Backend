import { Schema } from 'mongoose';

interface TimeSlot {
    start: Date;
    stop: Date;
}

interface TaskState {
    [index: number]: 'wait' | 'approve' | 'reject' | 'accept';
}

export interface Task {
    _id: Schema.Types.ObjectId;
    time: TimeSlot;
    requestor: [Schema.Types.ObjectId];
    state: TaskState;
    staff: Schema.Types.ObjectId;
    area: null; // required area module
    form?: null; // required form module
    createAt: Date;
    updateAt: Date;
}
