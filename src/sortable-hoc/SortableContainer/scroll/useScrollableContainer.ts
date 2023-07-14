import { useCallback, useRef } from 'react';

import {
  getScrollableDocumentDescriptor,
  getScrollableParentDescriptor,
  ScrollableContainerDescriptor
} from '@/sortable-hoc/SortableContainer/scroll/getScrollableContainerDescriptor';
import { ContainerScrollBoundary, Coordinates } from '@/sortable-hoc/types';

export default function useScrollableContainer(
  isScrollableWindow = false
): [
  React.MutableRefObject<ScrollableContainerDescriptor>,
  (pos: Coordinates, axis: keyof Coordinates) => ContainerScrollBoundary,
  (element: HTMLElement | null) => void
] {
  const scrollableContainer = useRef<HTMLElement | null>(null);

  const containerScrollBoundary = useRef<ContainerScrollBoundary>({
    isTop: false,
    isLeft: false,
    isBottom: false,
    isRight: false
  });

  const descriptor = useRef<ScrollableContainerDescriptor>({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    initScroll: { x: 0, y: 0 },
    deltaScroll: { x: 0, y: 0 },
    currentScroll: { x: 0, y: 0 },
    maxScroll: { x: 0, y: 0 },
    offsets: { x: 0, y: 0 }
  });

  const defineContainerScrollBoundary = (container: HTMLElement) => {
    containerScrollBoundary.current = {
      isTop: container.scrollTop <= 0,
      isLeft: container.scrollLeft <= 0,
      isBottom: container.scrollTop >= descriptor.current.maxScroll.y,
      isRight: container.scrollLeft >= descriptor.current.maxScroll.x
    };
  };

  const scrollContainer = useCallback((pos: Coordinates, axis: keyof Coordinates) => {
    const container = isScrollableWindow ? document.documentElement : scrollableContainer.current;

    if (container) {
      if (axis === 'y') {
        container.scrollBy(0, pos.y);
      } else if (axis === 'x') {
        container.scrollBy(pos.x, 0);
      }
      defineContainerScrollBoundary(container);
    }
    return containerScrollBoundary.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setScrollContainer = useCallback((element: HTMLElement | null) => {
    if (!isScrollableWindow && element) {
      scrollableContainer.current = element;
      descriptor.current = getScrollableParentDescriptor(element);
      defineContainerScrollBoundary(element);
    } else {
      descriptor.current = getScrollableDocumentDescriptor();
      defineContainerScrollBoundary(document.documentElement);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [descriptor, scrollContainer, setScrollContainer];
}
