export function arrayMove<T>(arr: ReadonlyArray<T>, from: number, to: number): ReadonlyArray<T> {
  const newArray = [...arr];
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);

  return newArray;
}

export default function getClosestIndex(arr: Array<number>, y: number) {
  let index = 0;
  let diff = Math.abs(y - arr[0]);

  for (let i = 0; i < arr.length; i++) {
    const nextDiff = Math.abs(y - arr[i]);

    if (nextDiff < diff) {
      diff = nextDiff;
      index = i;
    }
  }

  return index;
}

// .reduce((prev, curr, currentIndex) =>
// Math.abs(curr.offsetTop - currentElementY) < Math.abs(prev.offsetTop - currentElementY)
//   ? curr
//   : prev
// );

// export function recursivelyGetOffset(node: HTMLElement | null) {
//   let currOffset = 0;
//   let newOffset = 0;

//   if (node !== null) {
//     if ((node as HTMLElement).scrollTop) {
//       currOffset = node.scrollTop;
//     }

//     if ((node as HTMLElement).offsetTop) {
//       currOffset -= node.offsetTop;
//     }

//     if (node && node.parentElement) {
//       newOffset = recursivelyGetOffset(node.parentElement);
//     }

//     currOffset = currOffset + newOffset;
//   }

//   return currOffset;
// }
