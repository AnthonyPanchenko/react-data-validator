import React, { useCallback, useEffect, useRef } from 'react';

import { DragAndDropContext } from './drag-and-drop-context';

type PropsTypes = {
  children: React.ReactNode[] | React.ReactNode;
};

export default function DragAndDropContainer({ children }: PropsTypes) {
  const dragHandler = useRef<undefined | ((x: number, y: number) => void)>(undefined);

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (typeof dragHandler.current === 'function') {
      dragHandler.current = undefined;
      console.log('handleTouchEnd', e);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (typeof dragHandler.current === 'function') {
      console.log('handleTouchMove', e);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    if (typeof dragHandler.current === 'function') {
      dragHandler.current = undefined;
      console.log('handleMouseUp', e);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (typeof dragHandler.current === 'function') {
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
      handler: (x: number, y: number) => void,
      event: React.MouseEvent<TRef, MouseEvent> | React.TouchEvent<TRef>,
      item: TItem
    ) => {
      dragHandler.current = handler;
      console.log(item, dragHandler, event);
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
