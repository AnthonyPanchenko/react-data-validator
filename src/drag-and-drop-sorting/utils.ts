export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);

  return newArray;
}

// export default function getClosestElement<T>(arr: Array<T>, y: number) {
//   let curr = arr[0];
//   let diff = Math.abs(y - curr.y);

//   for (let i = 0; i < arr.length; i++) {
//     const nextDiff = Math.abs(y - arr[i].y);

//     if (nextDiff < diff) {
//       diff = nextDiff;
//       curr = arr[i];
//     }
//   }

//   return curr;
// }

// const closest = [].reduce((prev, curr) =>
//   Math.abs(curr.y - y) < Math.abs(prev.y - y) ? curr : prev
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
