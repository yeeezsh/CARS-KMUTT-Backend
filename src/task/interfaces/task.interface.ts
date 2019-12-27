import { Schema } from 'mongoose';
import { Form } from 'src/form/interfaces/form.interface';
import { Area } from 'src/area/interfaces/area.interface';
import { Staff } from 'src/users/interfaces/staff.interface';

interface TimeSlot {
  date: Date;
  start: Date;
  stop: Date;
}

interface TaskState {
  [index: number]: 'wait' | 'approve' | 'reject' | 'accept' | 'drop';
}

export interface Task {
  _id: Schema.Types.ObjectId;
  time: TimeSlot[];
  requestor: [Schema.Types.ObjectId];
  state: TaskState;
  staff: Staff[];
  approve: boolean[];
  area: Area; // required area module
  form?: Form; // required form module
  createAt: Date;
  updateAt: Date;
}
