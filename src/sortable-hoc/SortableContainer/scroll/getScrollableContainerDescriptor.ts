import { Coordinates } from '@/sortable-hoc/types';

export type ScrollableContainerDescriptor = {
  width: number;
  height: number;
  scrollWidth: number;
  scrollHeight: number;
  initScroll: Coordinates;
  deltaScroll: Coordinates;
  currentScroll: Coordinates;
  maxScroll: Coordinates;
  offsets: Coordinates;
  hasScroll: { x: boolean; y: boolean };
};

function getScrollableContainerDescriptor(el: HTMLElement, offsets: Coordinates) {
  return {
    offsets,
    initScroll: { x: el.scrollLeft, y: el.scrollTop },
    maxScroll: { x: el.scrollWidth - el.clientWidth, y: el.scrollHeight - el.clientHeight },
    deltaScroll: { x: 0, y: 0 },
    currentScroll: { x: 0, y: 0 },
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
    width: el.clientWidth,
    height: el.clientHeight,
    hasScroll: {
      x: el.scrollWidth > el.clientWidth,
      y: el.scrollHeight > el.clientHeight
    }
  };
}

export function getScrollableDocumentDescriptor(): ScrollableContainerDescriptor {
  const doc = document.documentElement;
  return getScrollableContainerDescriptor(doc, { x: 0, y: 0 });
}

export function getScrollableParentDescriptor(el: HTMLElement): ScrollableContainerDescriptor {
  const rect = el.getBoundingClientRect();
  return getScrollableContainerDescriptor(el, { x: rect.left, y: rect.top });
}
