import { useCallback, useContext, useRef, useState } from 'react';

import { DragAndDropContext } from '@/drag-and-drop/drag-and-drop-context';

export default function useDragSource<TRef extends Element, TItem = unknown>(
  item: TItem,
  index: number
): [
  React.MouseEventHandler<TRef>,
  React.TouchEventHandler<TRef>,
  React.MutableRefObject<TRef | null>,
  boolean,
  [number, number]
] {
  const [isActive, setActiveState] = useState<boolean>(false);
  const [cords, setCoordinates] = useState<[number, number]>([0, 0]);
  const elementRef = useRef<TRef | null>(null);
  const startCords = useRef<[number, number]>([0, 0]);
  const ctx = useContext(DragAndDropContext);

  const dragHandler = useCallback((x: number, y: number) => {
    setCoordinates([Math.round(startCords.current[0] - x), Math.round(startCords.current[1] - y)]);

    // const d = Math.sqrt(
    //   Math.pow(startCords.current[0] - x, 2) + Math.pow(startCords.current[1] - y, 2)
    // );

    // console.clear();
    // console.log(d);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseDown = useCallback((event: React.MouseEvent<TRef>) => {
    console.log('onMouseDown');
    startCords.current = [event.pageX, event.pageY];
    ctx.registerDragItem<TRef, TItem>(dragHandler, setActiveState, event, item, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchStart = useCallback((event: React.TouchEvent<TRef>) => {
    console.log('onTouchStart');
    startCords.current = [event.touches[0].pageX, event.touches[0].pageY];
    ctx.registerDragItem<TRef, TItem>(dragHandler, setActiveState, event, item, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [onMouseDown, onTouchStart, elementRef, isActive, cords];
}
