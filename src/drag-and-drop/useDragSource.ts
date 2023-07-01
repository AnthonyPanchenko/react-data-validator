import { useCallback, useContext, useRef } from 'react';

import { DragAndDropContext } from '@/drag-and-drop/drag-and-drop-context';

export default function useDragSource<TRef extends Element, TItem = unknown>(
  item: TItem
): [
  React.MouseEventHandler<TRef>,
  React.TouchEventHandler<TRef>,
  React.MutableRefObject<TRef | null>
] {
  const elementRef = useRef<TRef | null>(null);
  const ctx = useContext(DragAndDropContext);

  const dragHandler = useCallback((x: number, y: number) => {
    console.log(x, y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseDown = useCallback((event: React.MouseEvent<TRef>) => {
    console.log('onMouseDown');
    ctx.registerDragItem<TRef, TItem>(dragHandler, event, item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchStart = useCallback((event: React.TouchEvent<TRef>) => {
    console.log('onTouchStart');
    ctx.registerDragItem<TRef, TItem>(dragHandler, event, item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [onMouseDown, onTouchStart, elementRef];
}
