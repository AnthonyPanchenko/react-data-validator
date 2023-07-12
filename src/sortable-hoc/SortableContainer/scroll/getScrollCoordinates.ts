import { isWindow } from '@/sortable-hoc/utils';

import type { Coordinates } from '../../types';

export function getScrollXCoordinate(element: Element | typeof window): number {
  return isWindow(element) ? (element as typeof window).scrollX : (element as Element).scrollLeft;
}

export function getScrollYCoordinate(element: Element | typeof window): number {
  return isWindow(element) ? (element as typeof window).scrollY : (element as Element).scrollTop;
}

export function getScrollCoordinates(element: Element | typeof window): Coordinates {
  return {
    x: getScrollXCoordinate(element),
    y: getScrollYCoordinate(element)
  };
}
