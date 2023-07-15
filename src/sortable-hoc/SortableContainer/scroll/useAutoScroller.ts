import { useCallback, useRef } from 'react';

import { useInterval } from '@/sortable-hoc/SortableContainer/scroll/useInterval';
import { useTimeOut } from '@/sortable-hoc/SortableContainer/scroll/useTimeOut';
import { ContainerScrollBoundary, Coordinates } from '@/sortable-hoc/types';
import { clamp } from '@/sortable-hoc/utils';

type AutoScrollerOptions = {
  axis: keyof Coordinates;
  interval: number;
  threshold: number;
  minSpeed: number;
  maxSpeed: number;
};

type AutoScrollerReturnType = [
  (
    direction: Coordinates,
    delta: Coordinates,
    initClickPos: Coordinates,
    containerHeight: number,
    containerWidth: number
  ) => void,
  () => void
];

export function useAutoScroller(
  onStopInteraction: () => void,
  onScrollContainer: (pos: Coordinates, axis: keyof Coordinates) => ContainerScrollBoundary,
  { axis, interval, threshold, minSpeed, maxSpeed }: AutoScrollerOptions
): AutoScrollerReturnType {
  const scrollStep = useRef<Coordinates>({ x: 0, y: 0 });

  const [setScrollInterval, clearScrollInterval] = useInterval(interval);
  const [setInteractionTimeOut, clearInteractionTimeOut] = useTimeOut(300);

  const scrollView = useCallback(() => {
    const boundary = onScrollContainer(scrollStep.current, axis);

    const boundaryByAxis = {
      x: boundary.isLeft || boundary.isRight,
      y: boundary.isTop || boundary.isBottom
    };

    // NOTE executing ONLY for single axis
    if (boundaryByAxis[axis]) {
      clearScrollInterval();
      clearInteractionTimeOut();
      setInteractionTimeOut(onStopInteraction);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateScroll = useCallback(
    (direction: Coordinates, delta: Coordinates, pos: Coordinates, h: number, w: number) => {
      clearInteractionTimeOut();
      setInteractionTimeOut(onStopInteraction);
      clearScrollInterval();

      const normAcceleration = getNormalizedScrollAcceleration(direction, delta, pos, h, w);

      scrollStep.current = {
        x: clamp(normAcceleration.x * maxSpeed, minSpeed, maxSpeed) * direction.x,
        y: clamp(normAcceleration.y * maxSpeed, minSpeed, maxSpeed) * direction.y
      };

      // NOTE executing ONLY for single axis
      if (normAcceleration[axis] > threshold) {
        clearInteractionTimeOut();
        setScrollInterval(scrollView);
      } else {
        clearScrollInterval();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [updateScroll, clearScrollInterval];
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
