import { Coordinates } from '@/sortable-hoc/types';

export type DraggableSortableNode = {
  width: number;
  height: number;
  index: number;
  initPosition: Coordinates;
  translatePosition: Coordinates;
  offsets: Coordinates;
  setPosition: (cords: Coordinates) => void;
  setActiveState: (isActive: boolean) => void;
  setHelperPosition: (cords: Coordinates) => void;
};

export function getDraggableSortableNode(
  el: HTMLElement,
  index: number,
  setPosition: (cords: Coordinates) => void,
  setActiveState: (isActive: boolean) => void,
  setHelperPosition: (cords: Coordinates) => void
): DraggableSortableNode {
  const rect: DOMRect = el.getBoundingClientRect();

  return {
    index,
    initPosition: { x: rect.left, y: rect.top },
    translatePosition: { x: 0, y: 0 },
    offsets: { x: el.offsetLeft, y: el.offsetTop },
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    setPosition,
    setActiveState,
    setHelperPosition
  };
}
