import React from 'react';

export type DragAndDropSortingContextType = {
  registerDragItem: <TRef extends Element, TItem = unknown>(
    dragHandler: (x: number, y: number) => void,
    setActiveState: React.Dispatch<React.SetStateAction<boolean>>,
    event: React.MouseEvent<TRef> | React.TouchEvent<TRef>,
    item: TItem,
    index: number
  ) => void;
  unRegisterDragItem: () => void;
};

export const DragAndDropSortingContext = React.createContext<DragAndDropSortingContextType>({
  registerDragItem: () => undefined,
  unRegisterDragItem: () => undefined
});
