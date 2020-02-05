import { Schema, Document } from 'mongoose';
import { Staff } from '../../users/interfaces/staff.interface';
import { Area } from '../../area/interfaces/area.interface';
import { Form } from '../../form/interfaces/form.interface';

interface TimeSlot {
  start?: Date;
  stop?: Date;
  allDay?: boolean;
}

export interface Requestor {
  username: string;
  confirm: boolean;
}

export interface Task extends Document {
  reserve: TimeSlot[];
  requestor: Requestor[];
  state: Array<'wait' | 'approve' | 'reject' | 'accept' | 'drop'>;
  staff?: Staff[];
  area: Area; // required area module
  form?: Form; // required form module

  cancle: boolean;
  createAt: Date;
  updateAt: Date;
}
