import { useCallback, useRef } from 'react';

import { useInterval } from '@/sortable-hoc/SortableContainer/scroll/useInterval';
import { Coordinates } from '@/sortable-hoc/types';
import { clamp } from '@/sortable-hoc/utils';

type AutoScrollerOptions = {
  axis: keyof Coordinates;
  interval: number;
  threshold: number;
  minSpeed: number;
  maxSpeed: number;
};

type AutoScrollerSettings = {
  speed: Coordinates;
  direction: Coordinates;
  max: Coordinates;
};

export function useAutoScroller({
  axis,
  interval,
  threshold,
  minSpeed,
  maxSpeed
}: AutoScrollerOptions): [
  React.MutableRefObject<HTMLDivElement | null>,
  (delta: Coordinates) => void
] {
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const scroll = useRef<AutoScrollerSettings>({
    speed: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
    max: { x: 0, y: 0 }
  });

  const [setScrollInterval, clearScrollInterval] = useInterval(interval);

  const scrollView = useCallback(() => {
    // const scrollTopValue = Math.min(
    //   Math.max(container.scrollTop + acceleration * direction, 0),
    //   maxScroll
    // );

    // if (scrollTopValue === maxScroll || scrollTopValue === 0) {
    //   this.clearMouseMoveTimer();
    //   this.onStopMove(delta + this.elementRelativeOffsetTop + scrollTopValue, direction);
    //   this.clearScrollView();
    // }

    if (scrollContainer.current) {
      const speed = scroll.current.speed[axis] * scroll.current.direction[axis];
      const scrollSpeed = clamp(speed, 0, scroll.current.max[axis]);

      const scrollLeft = axis === 'x' ? scrollSpeed : 0;
      const scrollTop = axis === 'y' ? scrollSpeed : 0;

      scrollContainer.current.scrollBy(scrollLeft, scrollTop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateScroll = useCallback((delta: Coordinates) => {
    const container = scrollContainer.current;
    if (container) {
      scroll.current.max.y = container.scrollHeight - container.clientHeight;
      scroll.current.max.x = container.scrollWidth - container.clientWidth;
    }

    const axisDirection = Math.sign(delta[axis]);
    scroll.current.direction[axis] = axisDirection;

    const normAcceleration = getNormalizedAcceleration(axisDirection, delta[axis]);
    scroll.current.speed[axis] = clamp(normAcceleration * maxSpeed, minSpeed, maxSpeed);

    if (normAcceleration > threshold) {
      setScrollInterval(scrollView);
    } else {
      clearScrollInterval();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [scrollContainer, updateScroll];
}

function getNormalizedAcceleration(
  direction: number,
  delta: number,
  containerHeight: number
): number {
  if (direction === 0) {
    return 0;
  }

  return Math.abs(
    direction < 0
      ? delta / this.elementRelativeOffsetTop
      : delta / (this.containerRect.height - this.elementRelativeOffsetTop)
  );
}

/*
  useEffect(
    () => {
      if (!enabled || !scrollableAncestors.length || !rect) {
        clearAutoScrollInterval();
        return;
      }

      const index = scrollableAncestors.indexOf(scrollContainer);
      const scrollContainerRect = scrollableAncestorRects[index];

      if (!scrollContainerRect) {
        continue;
      }

      const { direction, speed } = getScrollDirectionAndSpeed(
        scrollContainer,
        scrollContainerRect,
        rect,
        acceleration,
        threshold
      );

      for (const axis of ['x', 'y'] as const) {
        if (!scrollIntent[axis][direction[axis] as Direction]) {
          speed[axis] = 0;
          direction[axis] = 0;
        }
      }

      if (speed.x > 0 || speed.y > 0) {
        clearAutoScrollInterval();

        scrollContainerRef.current = scrollContainer;
        setAutoScrollInterval(autoScroll, interval);

        scrollSpeed.current = speed;
        scrollDirection.current = direction;

        return;
      }

      scrollSpeed.current = { x: 0, y: 0 };
      scrollDirection.current = { x: 0, y: 0 };
      clearAutoScrollInterval();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      scrollContainer,
      acceleration,
      autoScroll,
      canScroll,
      clearAutoScrollInterval,
      enabled,
      interval,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(rect),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(scrollIntent),
      setAutoScrollInterval,
      scrollableAncestors,
      sortedScrollableAncestors,
      scrollableAncestorRects,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(threshold)
    ]
  );

*/
