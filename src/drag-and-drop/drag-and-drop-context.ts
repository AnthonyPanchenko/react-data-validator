import React from 'react';

export type DragAndDropContextType = {
  registerDragItem: <TRef extends Element, TItem = unknown>(
    dragHandler: (x: number, y: number) => void,
    event: React.MouseEvent<TRef> | React.TouchEvent<TRef>,
    item: TItem
  ) => void;
  unRegisterDragItem: () => void;
};

export const DragAndDropContext = React.createContext<DragAndDropContextType>({
  registerDragItem: () => undefined,
  unRegisterDragItem: () => undefined
});
