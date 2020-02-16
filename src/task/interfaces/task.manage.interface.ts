import { Requestor } from './task.interface';

export interface TaskManage {
  _id: string;
  requestor: Requestor[];
  area: {
    name: string;
    label: string;
  };
  createAt: Date;
  type: string;
}
