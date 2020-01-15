import { Schema } from 'mongoose';

interface TimeSlot {
  start: string;
  stop: string;
}
interface TimeSlotAvailable {
  start: string;
  stop: string;
  n: number;
}

export interface TaskSchedule {
  _id: Schema.Types.ObjectId;
  schedule: TimeSlot[];
  available: TimeSlotAvailable[];
}
