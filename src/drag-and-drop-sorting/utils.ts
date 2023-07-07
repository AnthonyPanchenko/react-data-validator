export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);

  return newArray;
}

export default function getClosestElement(arr: Array<{ y: number; height: number }>, y: number) {
  let curr = arr[0];
  let diff = Math.abs(y - curr.y);

  for (let i = 0; i < arr.length; i++) {
    const nextDiff = Math.abs(y - arr[i].y);

    if (nextDiff < diff) {
      diff = nextDiff;
      curr = arr[i];
    }
  }

  return curr;
}

// const closest = [].reduce((prev, curr) =>
//   Math.abs(curr.y - y) < Math.abs(prev.y - y) ? curr : prev
// );
