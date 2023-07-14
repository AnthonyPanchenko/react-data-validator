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
};

export function getScrollableDocumentDescriptor(): ScrollableContainerDescriptor {
  const doc = document.documentElement;

  return {
    offsets: { x: 0, y: 0 },
    initScroll: { x: doc.scrollLeft, y: doc.scrollTop },
    maxScroll: { x: doc.scrollWidth - doc.clientWidth, y: doc.scrollHeight - doc.clientHeight },
    deltaScroll: { x: 0, y: 0 },
    currentScroll: { x: 0, y: 0 },
    scrollWidth: doc.scrollWidth,
    scrollHeight: doc.scrollHeight,
    width: doc.clientWidth,
    height: doc.clientHeight
  };
}

export function getScrollableParentDescriptor(el: HTMLElement): ScrollableContainerDescriptor {
  const rect = el.getBoundingClientRect();

  return {
    offsets: { x: rect.left, y: rect.top },
    initScroll: { x: el.scrollLeft, y: el.scrollTop },
    maxScroll: { x: el.scrollWidth - el.clientWidth, y: el.scrollHeight - el.clientHeight },
    deltaScroll: { x: 0, y: 0 },
    currentScroll: { x: 0, y: 0 },
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
    width: rect.width,
    height: rect.height
  };
}
