interface TimeSlot {
    start: Date;
    stop: Date;
}
interface TimeSlotAvailable {
    start: Date;
    stop: Date;
    n: number;
}

export interface TaskSchedule {
    _id: string;
    schedule: TimeSlot[];
    available: TimeSlotAvailable[];
}
