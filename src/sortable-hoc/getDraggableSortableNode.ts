import { Coordinates } from '@/sortable-hoc/types';

export type DraggableSortableNode = {
  width: number;
  height: number;
  index: number;
  activeIndex: number;
  initPosition: Coordinates;
  offsets: Coordinates;
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
    index,
    activeIndex: index,
    initPosition: { x: rect.left, y: rect.top },
    offsets: { x: 0, y: 0 },
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    setPosition,
    setActiveState,
    setHelperPosition
  };
}
