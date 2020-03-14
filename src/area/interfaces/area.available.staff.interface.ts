import { TimeNode } from './timenode.interface';

export interface AreaAvailableStaff {
  _id: string;
  name: string;
  label: string;
  building: {
    _id: string;
    name: string;
    label: string;
  };
  disabled: TimeNode[];
  date: Date;
}
