import { Schema, Document } from 'mongoose';
import { Staff } from '../../users/interfaces/staff.interface';
import { Area } from '../../area/interfaces/area.interface';
import { Form } from '../../form/interfaces/form.interface';

interface TimeSlot {
  start?: Date;
  stop?: Date;
  allDay: boolean;
}

interface TaskState {
  [index: number]: 'wait' | 'approve' | 'reject' | 'accept' | 'drop';
}

export interface Task extends Document {
  _id: Schema.Types.ObjectId;

  reserve: TimeSlot[];
  requestor: Schema.Types.ObjectId[];
  state: TaskState[];
  staff?: Staff[];
  approve: string[];
  area: Area; // required area module
  form?: Form; // required form module

  cancle: boolean;
  createAt: Date;
  updateAt: Date;
}
