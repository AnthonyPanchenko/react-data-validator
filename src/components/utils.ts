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
