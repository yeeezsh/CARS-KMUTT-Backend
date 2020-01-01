export default function(arrFn = []): Array<{ start: string; stop: string }> {
  return arrFn
    .map((e, i, arr) => {
      if (i === arr.length - 1) {
        return null;
      }
      return {
        start: String(e),
        stop: String(arr[i + 1]),
      };
    })
    .filter(e => Boolean(e));
}
