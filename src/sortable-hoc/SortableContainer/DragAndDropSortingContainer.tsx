import { useCallback, useRef } from 'react';

import { DragAndDropSortingContext } from '@/sortable-hoc/SortableContainer/drag-and-drop-sorting-context';
import { getScrollableAncestors } from '@/sortable-hoc/SortableContainer/scroll/getScrollableAncestors';
import { getScrollOffsets } from '@/sortable-hoc/SortableContainer/scroll/getScrollOffsets';
import { useAutoScroller } from '@/sortable-hoc/SortableContainer/scroll/useAutoScroller';
import { Coordinates, DnDSortingValues } from '@/sortable-hoc/types';
import { Direction, getEdgeOffset, getEventCoordinates } from '@/sortable-hoc/utils';

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
    containerScrollOffsets: { x: 0, y: 0 },
    sourceScrollOffsets: { x: 0, y: 0 },
    initClickPosition: { x: 0, y: 0 },
    containerScroll: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    deltaPosition: { x: 0, y: 0 },
    edgeOffsets: { x: 0, y: 0 },
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

  const [dndSortingContainer, updateScroll] = useAutoScroller(reRangeNodesPositions, {
    axis,
    interval: 5,
    threshold: 0.45,
    minSpeed: 2,
    maxSpeed: 10
  });

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
      x: pos.x - meta.startPosition.x,
      y: pos.y - meta.startPosition.y
    };

    if (meta.containerRect && meta.containerScroll) {
      const gap = 30;
      const translate = {
        x:
          axis === 'x'
            ? meta.deltaPosition.x + meta.edgeOffsets.x + meta.containerScroll.x - gap
            : 0,
        y:
          axis === 'y'
            ? meta.deltaPosition.y + meta.deltaRects.y - meta.sourceScrollOffsets.y
            : // ? meta.deltaPosition.y + meta.edgeOffsets.y - gap - meta.sourceScrollOffsets.y
              0
      };

      // containerScrollOffsets: { x: 0, y: 0 },
      // sourceScrollOffsets: { x: 0, y: 0 },
      // initClickPosition: { x: 0, y: 0 },
      // containerScroll: { x: 0, y: 0 },
      // startPosition: { x: 0, y: 0 },
      // deltaPosition: { x: 0, y: 0 },
      // edgeOffsets: { x: 0, y: 0 },
      // deltaRects: { x: 0, y: 0 },

      // meta.deltaRects
      // meta.containerScrollOffsets
      // meta.sourceScrollOffsets

      node.setHelperNodePosition(translate);
    }

    updateScroll(meta.deltaPosition, meta.initClickPosition);

    // Adjust for window scroll
    //  translate.y -= window.scrollY - this.initialWindowScroll.top;
    //  translate.x -= window.scrollX - this.initialWindowScroll.left;
  };

  const onDrop = (event: MouseEvent) => {
    console.log(event);
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

      meta.startPosition = getEventCoordinates(event);
      document.addEventListener('mousemove', onDrag, { passive: false });
      document.addEventListener('mouseup', onDrop);

      meta.edgeOffsets = getEdgeOffset(node.current, dndSortingContainer.current);

      const scrollableNodeAncestors = getScrollableAncestors(node.current);
      meta.sourceScrollOffsets = getScrollOffsets(scrollableNodeAncestors);

      const scrollableContainerAncestors = getScrollableAncestors(node.current?.parentElement);
      meta.containerScrollOffsets = getScrollOffsets(scrollableContainerAncestors);

      meta.activeIndex = index;
      meta.activeNodeRect = sourceDomRect;
      meta.sourceKey = sourceKye;
      meta.containerRect = dndSortingContainer.current?.getBoundingClientRect() || null;

      meta.initClickPosition = {
        x: meta.startPosition.x - (meta.containerRect?.x || 0),
        y: meta.startPosition.y - (meta.containerRect?.y || 0)
      };

      console.log(
        'scrollHeight: ',
        dndSortingContainer.current?.scrollHeight,
        'clientHeight: ',
        dndSortingContainer.current?.clientHeight,
        'offsetHeight: ',
        dndSortingContainer.current?.offsetHeight
      );

      meta.containerScroll = isWindowScrollContainer
        ? {
            x: window.scrollX,
            y: window.scrollY
          }
        : {
            x: dndSortingContainer.current?.scrollLeft || 0,
            y: dndSortingContainer.current?.scrollTop || 0
          };

      meta.deltaRects = {
        x: sourceDomRect.top - (meta.containerRect?.top || 0),
        y: sourceDomRect.left - (meta.containerRect?.left || 0)
      };
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
