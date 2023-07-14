import { useCallback, useEffect, useRef } from 'react';

import { Coordinates } from '@/sortable-hoc/types';

type ScrollableContainer = {
  width: number; // clientWidth / innerWidth
  height: number; // clientHeight / innerHeight
  scrollWidth: number; // scrollLeft / scrollX
  scrollHeight: number; // scrollTop / scrollY
  initScroll: Coordinates;
  deltaScroll: Coordinates;
  maxScroll: Coordinates;
  offsets: Coordinates;
};

export default function useScrollableContainer<TContainerElement extends HTMLElement>(
  isScrollableWindow = false
): [
  React.MutableRefObject<ScrollableContainer>,
  (pos: Coordinates, axis: keyof Coordinates) => void
] {
  const containerRef = useRef<TContainerElement | null>(null);

  const descriptor = useRef<ScrollableContainer>({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    initScroll: { x: 0, y: 0 },
    deltaScroll: { x: 0, y: 0 },
    maxScroll: { x: 0, y: 0 },
    offsets: { x: 0, y: 0 }
  });

  useEffect(() => {
    if (isScrollableWindow) {
      getScrollableWindowDescriptor();
    }
  }, [isScrollableWindow]);

  const onScrollContainer = useCallback((pos: Coordinates, axis: keyof Coordinates) => {
    if (containerRef.current) {
      if (axis === 'y') {
        containerRef.current.scrollBy(0, pos.y);
      } else if (axis === 'x') {
        containerRef.current.scrollBy(pos.x, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [descriptor, onScrollContainer];
}

/*
    this.document = this.container.ownerDocument || document;

    this.scrollContainer = useWindowAsScrollContainer
      ? this.document.scrollingElement || this.document.documentElement
      : getScrollingParent(this.container) || this.container;

    meta.initContainerScroll = isWindowScrollContainer
      ? {
          x: window.scrollX,
          y: window.scrollY
        }
      : {
          x: dndSortingContainer.current?.scrollLeft || 0,
          y: dndSortingContainer.current?.scrollTop || 0
        };
*/
