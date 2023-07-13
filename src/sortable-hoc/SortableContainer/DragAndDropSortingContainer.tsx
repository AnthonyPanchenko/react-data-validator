import { useCallback, useRef } from 'react';

import { DragAndDropSortingContext } from '@/sortable-hoc/SortableContainer/drag-and-drop-sorting-context';
import { getNestedScrollOffsets } from '@/sortable-hoc/SortableContainer/scroll/getNestedScrollOffsets';
import { getScrollableAncestors } from '@/sortable-hoc/SortableContainer/scroll/getScrollableAncestors';
import { useAutoScroller } from '@/sortable-hoc/SortableContainer/scroll/useAutoScroller';
import { Coordinates, DnDSortingValues } from '@/sortable-hoc/types';
import { Direction, getEventCoordinates, getNestedNodeOffset } from '@/sortable-hoc/utils';

type PropsTypes = {
  axis: keyof Coordinates;
  className?: string;
  isWindowScrollContainer?: boolean;
  children: React.ReactNode | React.ReactNode[] | null;
  onSortDropChange: (fromIndex: number, toIndex: number) => void;
};

export default function DragAndDropSortingContainer({
  axis,
  className,
  children,
  onSortDropChange,
  isWindowScrollContainer = false
}: PropsTypes) {
  const sort = useRef<DnDSortingValues>({
    isMoving: false,
    activeIndex: 0,
    overIndex: 0,
    index: 0,
    sourceKey: '',
    direction: Direction.Static,
    initRelatedContainerPosition: { x: 0, y: 0 },
    initContainerNestedScroll: { x: 0, y: 0 },
    initContainerScroll: { x: 0, y: 0 },
    initNodeNestedScroll: { x: 0, y: 0 },
    initPosition: { x: 0, y: 0 },
    deltaPosition: { x: 0, y: 0 },
    initNestedNodeOffsets: { x: 0, y: 0 },
    deltaRects: { x: 0, y: 0 },
    containerRect: null,
    activeNodeRect: null,
    registeredItems: {}
  });

  const registerStateSetters = useCallback(
    (
      setListRelatedPosition: (cords: Coordinates) => void,
      setActiveSourceState: (isActive: boolean) => void,
      setHelperNodePosition: (cords: Coordinates) => void,
      sourceKye: string,
      domRect: DOMRect
    ) => {
      sort.current.registeredItems[sourceKye] = {
        setListRelatedPosition,
        setActiveSourceState,
        setHelperNodePosition,
        domRect
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const reRangeNodesPositions = () => {
    console.log('STOP SCROLLING');
  };

  const [dndSortingContainer, updateScroll, clearAutoScrollInterval] = useAutoScroller(
    reRangeNodesPositions,
    {
      axis,
      interval: 5,
      threshold: 0.45,
      minSpeed: 2,
      maxSpeed: 10
    }
  );

  const onDrag = (event: MouseEvent) => {
    if (typeof event.preventDefault === 'function' && event.cancelable) {
      event.preventDefault();
    }

    const meta = sort.current;
    const node = meta.registeredItems[meta.sourceKey];

    if (!meta.isMoving) {
      meta.isMoving = true;
      node.setActiveSourceState(true);
    }

    const pos = getEventCoordinates(event);

    meta.deltaPosition = {
      x: pos.x - meta.initPosition.x,
      y: pos.y - meta.initPosition.y
    };

    if (meta.containerRect && meta.initContainerScroll) {
      const gap = 30;

      const translate =
        meta.deltaPosition.y + meta.initNestedNodeOffsets.y - gap - meta.initNodeNestedScroll.y;

      // const translate = meta.deltaPosition.y + meta.initNestedNodeOffsets.y - gap - meta.initNodeNestedScroll.y;

      node.setHelperNodePosition({ x: 0, y: translate });
    }

    updateScroll(meta.deltaPosition, meta.initRelatedContainerPosition);

    // Adjust for window scroll
    //  translate.y -= window.scrollY - this.initialWindowScroll.top;
    //  translate.x -= window.scrollX - this.initialWindowScroll.left;
  };

  const onDrop = (event: MouseEvent) => {
    clearAutoScrollInterval();

    const meta = sort.current;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onDrop);

    if (meta.isMoving) {
      meta.isMoving = false;
      meta.registeredItems[meta.sourceKey].setActiveSourceState(false);
    }
  };

  const unRegisterStateSetters = useCallback((sourceKye: string) => {
    delete sort.current.registeredItems[sourceKye];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStartDrag = useCallback(
    (
      index: number,
      sourceKye: string,
      event: MouseEvent | TouchEvent,
      sourceDomRect: DOMRect,
      node: React.MutableRefObject<HTMLElement | null>
    ) => {
      const meta = sort.current;

      meta.initPosition = getEventCoordinates(event);
      document.addEventListener('mousemove', onDrag, { passive: false });
      document.addEventListener('mouseup', onDrop);

      meta.initNestedNodeOffsets = getNestedNodeOffset(node.current, dndSortingContainer.current);

      const scrollableNodeAncestors = getScrollableAncestors(node.current);
      meta.initNodeNestedScroll = getNestedScrollOffsets(scrollableNodeAncestors);

      const scrollableContainerAncestors = getScrollableAncestors(dndSortingContainer.current);
      meta.initContainerNestedScroll = getNestedScrollOffsets(scrollableContainerAncestors);

      meta.activeIndex = index;
      meta.activeNodeRect = sourceDomRect;
      meta.sourceKey = sourceKye;
      meta.containerRect = dndSortingContainer.current?.getBoundingClientRect() || null;

      meta.initRelatedContainerPosition = {
        x: meta.initPosition.x - (meta.containerRect?.x || 0),
        y: meta.initPosition.y - (meta.containerRect?.y || 0)
      };

      meta.initContainerScroll = isWindowScrollContainer
        ? {
            x: window.scrollX,
            y: window.scrollY
          }
        : {
            x: dndSortingContainer.current?.scrollLeft || 0,
            y: dndSortingContainer.current?.scrollTop || 0
          };

      meta.deltaRects = {
        x: meta.activeNodeRect.x - (meta.containerRect?.x || 0),
        y: meta.activeNodeRect.y - (meta.containerRect?.y || 0)
      };

      const result = meta.deltaPosition.y + meta.deltaRects.y - meta.initNodeNestedScroll.y;
      // const result = meta.deltaPosition.y + meta.initNestedNodeOffsets.y - gap - meta.initNodeNestedScroll.y;
      console.clear();
      console.table({
        initContainerNestedScroll: meta.initContainerNestedScroll.y,
        initNodeNestedScroll: meta.initNodeNestedScroll.y,
        initContainerScroll: meta.initContainerScroll.y,
        deltaPosition: meta.deltaPosition.y,
        initNestedNodeOffsets: meta.initNestedNodeOffsets.y,
        deltaRects: meta.deltaRects.y,
        containerRect: meta.containerRect?.y,
        activeNodeRect: meta.activeNodeRect?.y,
        result
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DragAndDropSortingContext.Provider
      value={{
        registerStateSetters,
        unRegisterStateSetters,
        onStartDrag
      }}
    >
      <div ref={dndSortingContainer} className={className ? 'dnd-area ' + className : 'dnd-area'}>
        {children}
      </div>
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
