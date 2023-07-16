import React from 'react';

import { DraggableSortableNode } from '@/sortable-hoc/getDraggableSortableNode';

export type DragAndDropSortingContextType = {
  registerSortableNode: (node: DraggableSortableNode) => void;
  unRegisterSortableNode: (index: number) => void;
  onStartDrag: (
    node: DraggableSortableNode,
    event: MouseEvent | TouchEvent,
    originNode: React.MutableRefObject<HTMLElement | null>
  ) => void;
};

export const DragAndDropSortingContext = React.createContext<DragAndDropSortingContextType>({
  registerSortableNode: () => undefined,
  unRegisterSortableNode: () => undefined,
  onStartDrag: () => undefined
});
