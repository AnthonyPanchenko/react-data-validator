import { Coordinates } from '@/sortable-hoc/types';

export type DraggableSortableNode = {
  width: number;
  height: number;
  initIndex: number;
  currentIndex: number;
  initPosition: Coordinates;
  offsetPosition: Coordinates;
  setPosition: (cords: Coordinates) => void;
  setActiveState: (isActive: boolean) => void;
  setHelperPosition: (cords: Coordinates) => void;
};

export function getDraggableSortableNode(
  element: HTMLElement,
  index: number,
  setPosition: (cords: Coordinates) => void,
  setActiveState: (isActive: boolean) => void,
  setHelperPosition: (cords: Coordinates) => void
): DraggableSortableNode {
  const rect: DOMRect = element.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    initIndex: index,
    currentIndex: index,
    initPosition: { x: rect.left, y: rect.top },
    offsetPosition: { x: 0, y: 0 },
    setPosition,
    setActiveState,
    setHelperPosition
  };
}
