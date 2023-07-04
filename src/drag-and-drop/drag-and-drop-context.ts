import React from 'react';

export type DragAndDropContextType = {
  registerDragItem: <TRef extends Element, TItem = unknown>(
    dragHandler: (x: number, y: number) => void,
    setActiveState: React.Dispatch<React.SetStateAction<boolean>>,
    event: React.MouseEvent<TRef> | React.TouchEvent<TRef>,
    item: TItem,
    index: number
  ) => void;
  unRegisterDragItem: () => void;
};

export const DragAndDropContext = React.createContext<DragAndDropContextType>({
  registerDragItem: () => undefined,
  unRegisterDragItem: () => undefined
});
