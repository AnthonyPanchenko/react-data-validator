/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends (...args: any) => any>(
  func: T,
  wait: number
): (...args: any) => void {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// export default function debounce(func, wait = 166) {
//   let timeout;
//   function debounced(...args) {
//     const later = () => {
//       func.apply(this, args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   }

//   debounced.clear = () => {
//     clearTimeout(timeout);
//   };

//   return debounced;
// }

// debounce.bind.ts

// export interface Cancelable {
//   clear(): void;
// }

// export default function debounce<T extends (...args: any[]) => any>(
//   func: T,
//   wait?: number,
// ): T & Cancelable;
