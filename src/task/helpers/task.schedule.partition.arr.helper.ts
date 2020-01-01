import * as moment from 'moment';
export default function partionTimeArr(arrFn = [], nowDay, format = {
    FORMAT: 'DD-MM-YYYY-HH:mm:ss',
    TIME_FORMAT: 'HH:mm:ss',
    DAY_FORMAT: 'DD-MM-YYYY',
}): Array<{
    start: string;
    stop: string;
}> {
    const { FORMAT, TIME_FORMAT, DAY_FORMAT } = format;
    return arrFn.flatMap(e => {
        const allDay = e.allDay;
        const start = !allDay
            ? moment(e.start, 'HH:mm:ss')
            : moment().startOf('day');
        const stop = !allDay
            ? moment(e.stop, 'HH:mm:ss')
            : moment()
                .startOf('day')
                .add('1', 'day');
        let partition = start;
        const arr = [];
        arr.push(partition.format(FORMAT));
        while (partition < stop) {
            partition = partition.add(e.interval, 'minutes');
            arr.push(
                `${nowDay.format(DAY_FORMAT)}-${partition.format(TIME_FORMAT)}`,
            );
        }
        return arr;
    });
}
