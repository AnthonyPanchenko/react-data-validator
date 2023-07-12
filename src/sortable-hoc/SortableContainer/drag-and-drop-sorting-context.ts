import React from 'react';

import { Coordinates } from '@/sortable-hoc/types';

export type DragAndDropSortingContextType = {
  registerStateSetters: (
    setListRelatedPosition: (cords: Coordinates) => void,
    setActiveSourceState: (isActive: boolean) => void,
    setHelperNodePosition: (cords: Coordinates) => void,
    sourceKye: string,
    domRect: DOMRect
  ) => void;
  unRegisterStateSetters: (sourceKye: string) => void;
  onStartDrag: (
    index: number,
    sourceKye: string,
    event: MouseEvent | TouchEvent,
    sourceDomRect: DOMRect,
    node: React.MutableRefObject<HTMLElement | null>
  ) => void;
};

export const DragAndDropSortingContext = React.createContext<DragAndDropSortingContextType>({
  registerStateSetters: () => undefined,
  unRegisterStateSetters: () => undefined,
  onStartDrag: () => undefined
});
