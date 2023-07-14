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
};

export function useAutoScroller(
  onStopInteraction: () => void,
  onScrollContainer: (pos: Coordinates, axis: keyof Coordinates) => { x: boolean; y: boolean },
  { axis, interval, threshold, minSpeed, maxSpeed }: AutoScrollerOptions
): [
  React.MutableRefObject<HTMLDivElement | null>,
  (delta: Coordinates, initClickPos: Coordinates) => void,
  () => void
] {
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const scroll = useRef<AutoScrollerSettings>({
    speed: { x: 0, y: 0 },
    direction: { x: 0, y: 0 }
  });

  const [setScrollInterval, clearScrollInterval] = useInterval(interval);
  const [setInteractionTimeOut, clearInteractionTimeOut] = useTimeOut(300);

  const scrollView = useCallback(() => {
    const container = scrollContainer.current;

    if (container) {
      const scrollPosition = {
        x: scroll.current.speed.x * scroll.current.direction.x,
        y: scroll.current.speed.y * scroll.current.direction.y
      };

      const isBoundaryPosition = onScrollContainer(scrollPosition, axis);

      // NOTE executing ONLY for single axis
      if (isBoundaryPosition[axis]) {
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

    const shouldScrollBy = {
      x: container && container.scrollWidth <= container.clientWidth,
      y: container && container.scrollHeight <= container.clientHeight
    };

    if (shouldScrollBy[axis]) {
      return;
    }

    if (container) {
      clearScrollInterval();

      scroll.current.direction = {
        x: Math.sign(delta.x),
        y: Math.sign(delta.y)
      };

      const normAcceleration = getNormalizedScrollAcceleration(
        scroll.current.direction,
        delta,
        pos,
        container.clientHeight,
        container.clientWidth
      );

      scroll.current.speed = {
        x: clamp(normAcceleration.x * maxSpeed, minSpeed, maxSpeed),
        y: clamp(normAcceleration.y * maxSpeed, minSpeed, maxSpeed)
      };

      // NOTE executing ONLY for single axis
      if (normAcceleration[axis] > threshold) {
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

function getNormalizedScrollAcceleration(
  direction: Coordinates,
  delta: Coordinates,
  clickPos: Coordinates,
  h: number,
  w: number
): Coordinates {
  return {
    x:
      direction.x === 0
        ? 0
        : Math.abs(direction.x < 0 ? delta.x / clickPos.x : delta.x / (w - clickPos.x)),
    y:
      direction.y === 0
        ? 0
        : Math.abs(direction.y < 0 ? delta.y / clickPos.y : delta.y / (h - clickPos.y))
  };
}
