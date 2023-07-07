import React, { useCallback, useEffect, useRef, useState } from 'react';

import DnDropSortingManager from '@/drag-and-drop-sorting/DnDropSortingManager';

type PropsTypes<TSortItem> = {
  items: ReadonlyArray<TSortItem>;
  className?: string;
  onChange: (item: ReadonlyArray<TSortItem>) => void;
  children: (
    item: TSortItem,
    index: number,
    onRegisterDragItem:
      | ((
          setPosition: (posY: number) => void,
          setActiveState: (isActive: boolean) => void,
          event: MouseEvent | Touch,
          index: number,
          elementClientRect: DOMRect
        ) => void)
      | undefined
  ) => React.ReactNode;
};

export default function DragAndDropSorting<TSortItem>({
  children,
  className,
  items
}: PropsTypes<TSortItem>) {
  const dndSortingArea = useRef<HTMLDivElement | null>(null);
  const dndSortManager = useRef<DnDropSortingManager | null>(null);
  const [sortItems, setSortItems] = useState<ReadonlyArray<TSortItem>>(items);

  useEffect(() => {
    console.log('DragAndDropSorting created');
    dndSortManager.current = new DnDropSortingManager(dndSortingArea);

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      if (dndSortManager.current) {
        dndSortManager.current.onEndMove(e);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (dndSortManager.current) {
        dndSortManager.current.onMove(e);
      }
    };

    // window.addEventListener('touchmove', handleTouchMove);
    // window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      // window.addEventListener('touchmove', handleTouchMove);
      // window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerDragItem = useCallback(
    (
      setPosition: (posY: number) => void,
      setActiveState: (isActive: boolean) => void,
      event: MouseEvent | Touch,
      index: number,
      elementClientRect: DOMRect
    ) => {
      if (dndSortManager.current) {
        dndSortManager.current.onRegisterDragItem(
          setPosition,
          setActiveState,
          event,
          index,
          elementClientRect
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  return (
    <div ref={dndSortingArea} className={className ? 'dnd-area ' + className : 'dnd-area'}>
      {sortItems.map((item, i) => children(item, i, registerDragItem))}
    </div>
  );
}
