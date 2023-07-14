import { Coordinates } from '@/sortable-hoc/types';

export function getDelta<
  T extends {
    x: number;
    y: number;
  }
>(current: T | null | undefined, start: T | null | undefined): Coordinates {
  return current && start
    ? {
        x: current.x - start.x,
        y: current.y - start.y
      }
    : { x: 0, y: 0 };
}
