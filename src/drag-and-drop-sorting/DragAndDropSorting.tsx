import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import DnDropSortingManager from '@/drag-and-drop-sorting/DnDropSortingManager';
import { onRegisterEventInfo, onRegisterStateSetters } from '@/drag-and-drop-sorting/types';
import { arrayMove } from '@/drag-and-drop-sorting/utils';

type PropsTypes<TSortItem> = {
  items: ReadonlyArray<TSortItem>;
  className?: string;
  onChange: (item: ReadonlyArray<TSortItem>) => void;
  children: (
    item: TSortItem,
    index: number,
    onRegisterEventInfo: onRegisterEventInfo,
    onRegisterStateSetters: onRegisterStateSetters
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

  useLayoutEffect(() => {
    console.log('DragAndDropSorting created');
    dndSortManager.current = new DnDropSortingManager(dndSortingArea, (from: number, to: number) =>
      setSortItems(prevItems => arrayMove(prevItems, from, to))
    );

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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerEventInfo = useCallback(
    (index: number, event: MouseEvent, elementDomRect: DOMRect) => {
      if (dndSortManager.current) {
        dndSortManager.current.onRegisterEventInfo(index, event, elementDomRect);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const registerStateSetters = useCallback(
    (
      setPosition: (topY: number) => void,
      setActiveState: (isActive: boolean) => void,
      setTranslatePosition: (translateY: number) => void,
      index: number
    ) => {
      if (dndSortManager.current) {
        dndSortManager.current.onRegisterStateSetters(
          setPosition,
          setActiveState,
          setTranslatePosition,
          index
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  return (
    <div ref={dndSortingArea} className={className ? 'dnd-area ' + className : 'dnd-area'}>
      {sortItems.map((item, i) => children(item, i, registerEventInfo, registerStateSetters))}
    </div>
  );
}
