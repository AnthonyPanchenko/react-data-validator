import { useCallback, useRef } from 'react';

import { useInterval } from '@/sortable-hoc/SortableContainer/scroll/useInterval';
import { useTimeOut } from '@/sortable-hoc/SortableContainer/scroll/useTimeOut';
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

export function useAutoScroller(
  onStopInteraction: () => void,
  { axis, interval, threshold, minSpeed, maxSpeed }: AutoScrollerOptions
): [
  React.MutableRefObject<HTMLDivElement | null>,
  (delta: Coordinates, initClickPos: Coordinates) => void,
  () => void
] {
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const scroll = useRef<AutoScrollerSettings>({
    speed: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
    max: { x: 0, y: 0 }
  });

  const [setScrollInterval, clearScrollInterval] = useInterval(interval);
  const [setInteractionTimeOut, clearInteractionTimeOut] = useTimeOut(300);

  const scrollView = useCallback(() => {
    const container = scrollContainer.current;

    if (container) {
      const speed = scroll.current.speed[axis] * scroll.current.direction[axis];

      const scrollLeft = axis === 'x' ? speed : 0;
      const scrollTop = axis === 'y' ? speed : 0;

      container.scrollBy(scrollLeft, scrollTop);

      if (container.scrollTop === scroll.current.max[axis] || container.scrollTop === 0) {
        clearScrollInterval();
        clearInteractionTimeOut();
        setInteractionTimeOut(onStopInteraction);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateScroll = useCallback((delta: Coordinates, pos: Coordinates) => {
    const container = scrollContainer.current;
    clearInteractionTimeOut();
    setInteractionTimeOut(onStopInteraction);
    if (container && container.scrollHeight <= container.clientHeight) {
      return;
    }

    if (container) {
      clearScrollInterval();

      scroll.current.max.y = container.scrollHeight - container.clientHeight;
      scroll.current.max.x = container.scrollWidth - container.clientWidth;

      const axisDirection = Math.sign(delta[axis]);
      scroll.current.direction[axis] = axisDirection;

      const normAcceleration = getNormalizedAcceleration(
        axisDirection,
        delta[axis],
        pos[axis],
        container.clientHeight
      );

      scroll.current.speed[axis] = clamp(normAcceleration * maxSpeed, minSpeed, maxSpeed);

      if (normAcceleration > threshold) {
        clearInteractionTimeOut();
        setScrollInterval(scrollView);
      } else {
        clearScrollInterval();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [scrollContainer, updateScroll, clearScrollInterval];
}

function getNormalizedAcceleration(
  direction: number,
  delta: number,
  clickPos: number,
  h: number
): number {
  if (direction === 0) {
    return 0;
  }

  return Math.abs(direction < 0 ? delta / clickPos : delta / (h - clickPos));
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
