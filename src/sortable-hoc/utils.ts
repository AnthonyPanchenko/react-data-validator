import { Coordinates, Offsets } from '@/sortable-hoc/types';

export enum Direction {
  Forward = 1,
  Backward = -1,
  Static = 0
}

export function arrayMove<T>(arr: ReadonlyArray<T>, from: number, to: number): ReadonlyArray<T> {
  const newArray = [...arr];
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);

  return newArray;
}

export function arraySwap<T>(array: ReadonlyArray<T>, from: number, to: number): ReadonlyArray<T> {
  const newArray = array.slice();

  newArray[from] = array[to];
  newArray[to] = array[from];

  return newArray;
}

export function miniUID(): string {
  return Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
}

export const events = {
  end: ['touchend', 'touchcancel', 'mouseup'],
  move: ['touchmove', 'mousemove'],
  start: ['touchstart', 'mousedown']
};

// export function setTranslate3d(node, translate) {
//   node.style.transform = translate == null ? '' : `translate(${translate.x}px,${translate.y}px)`;
// }

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

// function decimalAdjust(num: number, fixed = 0, round: (num: number) => number) {
//   fixed = Math.pow(10, fixed);
//   return round(num * fixed) / fixed;
// }

// function toNum(value?: string | number, precision = 0): number {
//   if (typeof value !== 'string') {
//     return 0;
//   }

//   if (precision) {
//     const n = parseFloat(value) || 0;
//     return !n || isNaN(n) ? 0 : decimalAdjust(n, precision, Math.round);
//   }

//   const n = parseInt(value, 10);
//   return isNaN(n) ? 0 : n;
// }

// export function getElementMargin(element: HTMLElement | null) {
//   if (!element) {
//     return {
//       bottom: 0,
//       left: 0,
//       right: 0,
//       top: 0
//     };
//   }
//   const style = window.getComputedStyle(element);

//   return {
//     bottom: toNum(style.marginBottom),
//     left: toNum(style.marginLeft),
//     right: toNum(style.marginRight),
//     top: toNum(style.marginTop)
//   };
// }

export function getScrollAdjustedBoundingClientRect(
  node: HTMLElement,
  scrollDelta: { top: number; left: number }
) {
  const boundingClientRect = node.getBoundingClientRect();

  return {
    top: boundingClientRect.top + scrollDelta.top,
    left: boundingClientRect.left + scrollDelta.left
  };
}

export function getWindowClientRect(element: typeof window) {
  const width = element.innerWidth;
  const height = element.innerHeight;

  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height
  };
}

export function isWindow(element: EventTarget | Element): element is typeof window {
  const resultString = Object.prototype.toString.call(element);
  return resultString === '[object Window]' || resultString === '[object global]';
}

export function isNode(node: EventTarget | Element): node is Node {
  return 'nodeType' in node;
}

export function getWindow(
  target: Event['target'] | Element | HTMLElement | null | undefined
): typeof window {
  if (!target) {
    return window;
  }

  if (isWindow(target)) {
    return target as typeof window;
  }

  if (!isNode(target)) {
    return window;
  }

  return (target as HTMLElement).ownerDocument?.defaultView ?? window;
}

export function isHTMLElement(node: Node | Window): node is HTMLElement {
  if (isWindow(node)) {
    return false;
  }

  return node instanceof getWindow(node).HTMLElement;
}

function isTouchEvent(event: Event | undefined | null): event is TouchEvent {
  if (!event) {
    return false;
  }

  return getWindow(event.target) && event instanceof TouchEvent;
}

export function isDocument(node: Node): node is Document {
  const { Document } = getWindow(node);

  return node instanceof Document;
}

export function getEventCoordinates(event: MouseEvent | TouchEvent): Coordinates {
  if (isTouchEvent(event)) {
    if (event.touches && event.touches.length) {
      const { clientX: x, clientY: y } = event.touches[0];

      return { x, y };
    } else if (event.changedTouches && event.changedTouches.length) {
      const { clientX: x, clientY: y } = event.changedTouches[0];

      return { x, y };
    }
  }

  return {
    x: (event as MouseEvent).clientX,
    y: (event as MouseEvent).clientY
  };
}

export const canUseDOM = () =>
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

function isDocumentScrollingElement(element: Element | null) {
  if (!canUseDOM() || !element) {
    return false;
  }

  return element === document.scrollingElement;
}

export function getScrollPosition(scrollingContainer: Element) {
  const minScroll = {
    x: 0,
    y: 0
  };
  const dimensions = isDocumentScrollingElement(scrollingContainer)
    ? {
        height: window.innerHeight,
        width: window.innerWidth
      }
    : {
        height: scrollingContainer.clientHeight,
        width: scrollingContainer.clientWidth
      };
  const maxScroll = {
    x: scrollingContainer.scrollWidth - dimensions.width,
    y: scrollingContainer.scrollHeight - dimensions.height
  };

  const isTop = scrollingContainer.scrollTop <= minScroll.y;
  const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
  const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
  const isRight = scrollingContainer.scrollLeft >= maxScroll.x;

  return {
    isTop,
    isLeft,
    isBottom,
    isRight,
    maxScroll,
    minScroll
  };
}

export function getEdgeOffset(
  node: HTMLElement | null,
  parent: HTMLElement | null,
  offset = { left: 0, top: 0 }
): Offsets {
  if (!node || !parent) {
    return offset;
  }

  const nodeOffset = {
    left: offset.left + node.offsetLeft,
    top: offset.top + node.offsetTop
  };

  if (node.parentNode === parent) {
    return nodeOffset;
  }

  return getEdgeOffset(node.parentNode as HTMLElement, parent, nodeOffset);
}

export function getTargetIndex(newIndex: number, prevIndex: number, oldIndex: number) {
  if (newIndex < oldIndex && newIndex > prevIndex) {
    return newIndex - 1;
  } else if (newIndex > oldIndex && newIndex < prevIndex) {
    return newIndex + 1;
  } else {
    return newIndex;
  }
}

// export function getContainerGridGap(el: HTMLElement | null) {
//   if (!el) {
//     return { x: 0, y: 0 };
//   }
//   const style = window.getComputedStyle(el);

//   if (style.display === 'grid' || style.display === 'inline-grid') {
//     return {
//       x: toNum(style.columnGap),
//       y: toNum(style.rowGap)
//     };
//   }

//   return { x: 0, y: 0 };
// }

// height: node.offsetHeight,
// width: node.offsetWidth

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
