import { useCallback, useRef, useState } from 'react';

import { DraggableSortableNode } from '@/sortable-hoc/getDraggableSortableNode';
import horizontalSorting from '@/sortable-hoc/horizontalSorting';
import { DragAndDropSortingContext } from '@/sortable-hoc/SortableContainer/drag-and-drop-sorting-context';
import { getDelta } from '@/sortable-hoc/SortableContainer/scroll/getDelta';
import { getNestedScrollOffsets } from '@/sortable-hoc/SortableContainer/scroll/getNestedScrollOffsets';
import { getScrollableAncestors } from '@/sortable-hoc/SortableContainer/scroll/getScrollableAncestors';
import { useAutoScroller } from '@/sortable-hoc/SortableContainer/scroll/useAutoScroller';
import useScrollableContainer from '@/sortable-hoc/SortableContainer/scroll/useScrollableContainer';
import { Coordinates } from '@/sortable-hoc/types';
import { getElementMargin, getEventCoordinates, getNestedNodeOffset } from '@/sortable-hoc/utils';
import verticalSorting from '@/sortable-hoc/verticalSorting';

type PropsTypes = {
  axis: keyof Coordinates;
  isScrollableWindow?: boolean;
  children: React.ReactNode | React.ReactNode[] | null;
  onDropChange: (fromIndex: number, toIndex: number) => void;
};

type DragAndDropSortableState = {
  to: number;
  from: number;
  activeNode: DraggableSortableNode | null;
  containerRect: DOMRect | null;
  direction: Coordinates;
  nodeMargin: Coordinates;
  deltaRects: Coordinates;
  initPosition: Coordinates;
  deltaPosition: Coordinates;
  initNodeOffsets: Coordinates;
  currentPosition: Coordinates;
  initRelatedContainerPosition: Coordinates;
  initContainerScroll: Coordinates;
  initContainerNestedScroll: Coordinates;
  initNodeNestedScroll: Coordinates;
  initNestedNodeOffsets: Coordinates;
  entries: Array<DraggableSortableNode>;
};

export default function DragAndDropSortingContainer({
  axis,
  children,
  isScrollableWindow = false,
  onDropChange
}: PropsTypes) {
  const [activeId, setActiveNodeId] = useState<string | number>('');
  const [containerDescriptor, onScrollContainer, onSetScrollableContainer] =
    useScrollableContainer(isScrollableWindow);

  const sort = useRef<DragAndDropSortableState>({
    to: 0,
    from: 0,
    activeNode: null,
    containerRect: null,
    initRelatedContainerPosition: { x: 0, y: 0 },
    initContainerNestedScroll: { x: 0, y: 0 },
    initNestedNodeOffsets: { x: 0, y: 0 },
    initContainerScroll: { x: 0, y: 0 },
    initNodeNestedScroll: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    initNodeOffsets: { x: 0, y: 0 },
    initPosition: { x: 0, y: 0 },
    deltaPosition: { x: 0, y: 0 },
    deltaRects: { x: 0, y: 0 },
    nodeMargin: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
    entries: []
  });

  const registerSortableNode = useCallback((node: DraggableSortableNode) => {
    sort.current.entries[node.index] = node;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unRegisterSortableNode = useCallback((index: number) => {
    sort.current.entries.splice(index, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStopInteraction = () => {
    // console.log('ON STOP SCROLLING / ON STOP DRAGGING');
    const meta = sort.current;

    if (meta.activeNode) {
      const relatedListPosition = {
        x:
          meta.activeNode.offsets.x +
          containerDescriptor.current.deltaScroll.x +
          meta.deltaPosition.x,
        y:
          meta.activeNode.offsets.y +
          containerDescriptor.current.deltaScroll.y +
          meta.deltaPosition.y
      };

      const closestNode = sort.current.entries.reduce((prev, curr) =>
        Math.abs(curr.offsets[axis] - relatedListPosition[axis]) <
        Math.abs(prev.offsets[axis] - relatedListPosition[axis])
          ? curr
          : prev
      );
      // console.clear();
      // console.log(meta.activeNode);
      // console.log(sort.current.entries);
      // console.log('from: ', meta.activeNode.index, 'to: ', closestNode.index);
      // on drop do not change indexes
      // const distance = distanceBetween(closestNode.offsets, relatedListPosition);

      if (meta.activeNode.index !== closestNode.index) {
        const currDir = meta.direction[axis];
        const isReversed = currDir === -1;
        const from = meta.activeNode.index + currDir;
        const to = closestNode.index;
        meta.from = meta.activeNode.index;
        meta.to = closestNode.index;
        const len = Math.abs(meta.activeNode.index - closestNode.index);

        const nodeTranslatePosition = { x: 0, y: 0 };

        if (axis === 'x') {
          nodeTranslatePosition.x = horizontalSorting(meta.entries, meta.to, meta.from);
        }
        if (axis === 'y') {
          nodeTranslatePosition.y = verticalSorting(meta.entries, meta.to, meta.from);
        }
        console.clear();
        console.log(nodeTranslatePosition, meta.activeNode.height + meta.nodeMargin.y);

        if (len === 1) {
          if (sort.current.entries[closestNode.index].position.y === 0) {
            // console.log(sort.current.entries[0], sort.current.entries[1]);
            const activeNodePos = { x: 0, y: -1 * nodeTranslatePosition.y };
            sort.current.entries[meta.activeNode.index].setPosition(activeNodePos);
            sort.current.entries[closestNode.index].setPosition(nodeTranslatePosition);

            sort.current.entries[meta.activeNode.index].position = activeNodePos;
            sort.current.entries[closestNode.index].position = nodeTranslatePosition;
          } else {
            sort.current.entries[meta.activeNode.index].setPosition({ x: 0, y: 0 });
            sort.current.entries[closestNode.index].setPosition({ x: 0, y: 0 });

            sort.current.entries[meta.activeNode.index].position = { x: 0, y: 0 };
            sort.current.entries[closestNode.index].position = { x: 0, y: 0 };
          }

          const copyActiveNode = {
            ...sort.current.entries[meta.activeNode.index],
            index: closestNode.index
          };
          const copyClosestNode = {
            ...sort.current.entries[closestNode.index],
            index: meta.activeNode.index
          };

          sort.current.entries[meta.activeNode.index] = copyClosestNode;
          sort.current.entries[copyClosestNode.index] = copyActiveNode;

          meta.activeNode.index = copyClosestNode.index;
          meta.activeNode.offsets = { ...copyClosestNode.offsets };

          console.log('from: ', meta.from, 'to: ', meta.to);
          // console.log(sort.current.entries[0], sort.current.entries[1]);
        } else if (len > 1) {
          const activeNodePos = { x: 0, y: -1 * nodeTranslatePosition.y };
          sort.current.entries[meta.activeNode.index].setPosition(activeNodePos);
          sort.current.entries[meta.activeNode.index].position = activeNodePos;

          let i = from;

          console.log(+currDir * -1, nodeTranslatePosition);

          while (isReversed ? i > to - 1 : i < len + 1) {
            sort.current.entries[i].setPosition(nodeTranslatePosition);
            sort.current.entries[i].position = nodeTranslatePosition;

            i += currDir;
          }
        }
      }

      // console.table({
      //   relatedListPosition,
      //   deltaScroll: containerDescriptor.current.deltaScroll
      // });
    }
  };

  const [onUpdateScroll, onClearAutoScrollInterval] = useAutoScroller(
    onStopInteraction,
    onScrollContainer,
    {
      axis,
      interval: 5,
      threshold: 0.8,
      minSpeed: 4,
      maxSpeed: 12
    }
  );

  const onDrag = (event: MouseEvent) => {
    if (typeof event.preventDefault === 'function' && event.cancelable) {
      event.preventDefault();
    }

    const meta = sort.current;

    if (meta.activeNode) {
      setActiveNodeId(meta.activeNode.id);
      const pos = getEventCoordinates(event);
      meta.deltaPosition = getDelta(pos, meta.initPosition);

      // based on position: fixed > top and left positions
      meta.currentPosition = {
        x: meta.deltaPosition.x + meta.initNodeOffsets.x - meta.nodeMargin.x,
        y: meta.deltaPosition.y + meta.initNodeOffsets.y - meta.nodeMargin.y
      };

      meta.direction = {
        x: Math.sign(meta.deltaPosition.x),
        y: Math.sign(meta.deltaPosition.y)
      };

      meta.activeNode.setHelperPosition(meta.currentPosition);

      if (containerDescriptor.current.hasScroll[axis]) {
        onUpdateScroll(
          meta.direction,
          meta.deltaPosition,
          meta.initRelatedContainerPosition,
          containerDescriptor.current.height,
          containerDescriptor.current.width
        );
      }
    }
  };

  const onDrop = (event: MouseEvent) => {
    onClearAutoScrollInterval();
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onDrop);

    const meta = sort.current;

    if (meta.activeNode) {
      setActiveNodeId('');
      meta.activeNode = null;
    }

    // console.log(sort.current.entries);
  };

  // ====================================== LOG_INFO =====================================
  // const LOG_INFO = (container: HTMLElement) => {
  //   const meta = sort.current;
  //   const result =
  //     meta.deltaPosition[axis] + meta.deltaRects[axis] - meta.initNodeNestedScroll[axis];
  //   // const result = meta.deltaPosition[axis] + meta.initNestedNodeOffsets[axis] - gap - meta.initNodeNestedScroll[axis];
  //   // console.clear();
  //   console.table({
  //     initContainerNestedScroll: meta.initContainerNestedScroll,
  //     initNodeNestedScroll: meta.initNodeNestedScroll,
  //     initContainerScroll: meta.initContainerScroll,
  //     deltaPosition: meta.deltaPosition,
  //     initNestedNodeOffsets: meta.initNestedNodeOffsets,
  //     deltaRects: meta.deltaRects,
  //     containerRect: { x: meta.containerRect?.x, y: meta.containerRect?.y },
  //     activeNode: meta.activeNode?.initPosition,
  //     nodeMargin: meta.nodeMargin,
  //     result
  //   });
  //   // console.log(meta.entries);
  // };
  // ====================================== LOG_INFO =====================================

  const onStartDrag = useCallback(
    (
      node: DraggableSortableNode,
      event: MouseEvent | TouchEvent,
      originNode: React.MutableRefObject<HTMLElement | null>
    ) => {
      const meta = sort.current;
      const container = originNode.current?.parentElement;

      meta.activeNode = node;
      meta.initPosition = getEventCoordinates(event);

      meta.initNestedNodeOffsets = getNestedNodeOffset(originNode.current, container);

      const scrollableNodeAncestors = getScrollableAncestors(originNode.current);
      meta.initNodeNestedScroll = getNestedScrollOffsets(scrollableNodeAncestors);

      const scrollableContainerAncestors = getScrollableAncestors(container);
      meta.initContainerNestedScroll = getNestedScrollOffsets(scrollableContainerAncestors);

      if (container && originNode.current) {
        onSetScrollableContainer(container);
        const rect: DOMRect = originNode.current.getBoundingClientRect();
        meta.initNodeOffsets = { x: rect.left, y: rect.top };
        meta.containerRect = container.getBoundingClientRect();
        meta.initRelatedContainerPosition = getDelta(meta.initPosition, meta.containerRect);
        meta.deltaRects = getDelta(meta.initNodeOffsets, meta.containerRect);
        meta.nodeMargin = getElementMargin(originNode.current);

        document.addEventListener('mousemove', onDrag, { passive: false });
        document.addEventListener('mouseup', onDrop);

        // LOG_INFO(container);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DragAndDropSortingContext.Provider
      value={{
        activeId,
        registerSortableNode,
        unRegisterSortableNode,
        onStartDrag
      }}
    >
      {children}
    </DragAndDropSortingContext.Provider>
  );
}

//   // Adding a non-capture and non-passive `touchmove` listener in order
//   // to force `event.preventDefault()` calls to work in dynamically added
//   // touchmove event handlers. This is required for iOS Safari.
//   // window.addEventListener(events.move.name, noop, {
//   //   capture: false,
//   //   passive: false,
//   // });
