import React, { useCallback, useEffect, useRef } from 'react';

import { DragAndDropContext } from './drag-and-drop-context';

type PropsTypes = {
  children: React.ReactNode[] | React.ReactNode;
};

type DnDHandlers = {
  onMove: (x: number, y: number) => void;
  onSetActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DragAndDropContainer({ children }: PropsTypes) {
  const dndHandlers = useRef<DnDHandlers | null>(null);

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (dndHandlers.current) {
      dndHandlers.current.onSetActive(false);
      dndHandlers.current = null;
      // console.clear();
      console.log('handleTouchEnd', e);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    // transform: translateY(4px);
    if (dndHandlers.current) {
      dndHandlers.current.onSetActive(true);
      dndHandlers.current.onMove(e.touches[0].pageX, e.touches[0].pageY);
      // console.clear();
      console.log('handleTouchMove', e);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    if (dndHandlers.current) {
      dndHandlers.current.onSetActive(false);
      dndHandlers.current = null;
      // console.clear();
      console.log('handleMouseUp', e);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (dndHandlers.current) {
      dndHandlers.current.onSetActive(true);
      dndHandlers.current.onMove(e.pageX, e.pageY);
      // console.clear();
      console.log('handleMouseMove', e);
    }
  };

  useEffect(() => {
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mousemove', handleMouseMove);

    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mousemove', handleMouseMove);

      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerDragItem = useCallback(
    <TRef extends Element, TItem = unknown>(
      moveHandler: (x: number, y: number) => void,
      setActiveState: React.Dispatch<React.SetStateAction<boolean>>,
      event: React.MouseEvent<TRef, MouseEvent> | React.TouchEvent<TRef>,
      item: TItem,
      index: number
    ) => {
      dndHandlers.current = {
        onMove: moveHandler,
        onSetActive: setActiveState
      };
      console.log(item, moveHandler, setActiveState, event, index);
    },
    []
  );

  const unRegisterDragItem = useCallback(() => {
    console.log('unRegisterDragItem');
  }, []);

  return (
    <DragAndDropContext.Provider
      value={{
        registerDragItem,
        unRegisterDragItem
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
}
