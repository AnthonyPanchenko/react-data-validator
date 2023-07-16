import { Coordinates } from '@/sortable-hoc/types';

export type DraggableSortableNode = {
  width: number;
  height: number;
  index: number;
  label: string;
  position: Coordinates;
  offsets: Coordinates;
  setPosition: (cords: Coordinates) => void;
  setActiveState: (isActive: boolean) => void;
  setHelperPosition: (cords: Coordinates) => void;
};

export function getDraggableSortableNode(
  el: HTMLElement,
  label: string,
  index: number,
  setPosition: (cords: Coordinates) => void,
  setActiveState: (isActive: boolean) => void,
  setHelperPosition: (cords: Coordinates) => void
): DraggableSortableNode {
  return {
    index,
    label,
    position: { x: 0, y: 0 },
    offsets: { x: el.offsetLeft, y: el.offsetTop },
    width: el.offsetWidth,
    height: el.offsetHeight,
    setPosition,
    setActiveState,
    setHelperPosition
  };
}
