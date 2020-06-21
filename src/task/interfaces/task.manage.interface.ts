import { TaskRequestor } from './task.requestor.interface';

export interface TaskManage {
  _id: string;
  requestor: TaskRequestor[];
  area: {
    name: string;
    label: string;
  };
  createAt: Date;
  type: string;
  state: string[];
}
