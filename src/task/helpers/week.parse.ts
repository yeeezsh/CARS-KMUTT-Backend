export default (str: string): number[] => {
  let type = 'delim';
  if (str.includes('-')) type = 'range';
  const arr: number[] = [];
  let strSplit: any[];
  switch (type) {
    case 'range':
      strSplit = str.split('-');
      const start = Number(strSplit[0]);
      const end = Number(strSplit[1]);
      let cur: number = start;
      while (cur < end) {
        arr.push(cur);
        cur++;
      }
      return arr;
    case 'delim':
      strSplit = str.split(',');
      const filtered = strSplit.filter(e => e !== ',').map(e => Number(e));
      return filtered;
  }
  return [];
};
