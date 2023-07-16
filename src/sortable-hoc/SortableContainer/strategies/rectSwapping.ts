import { DraggableSortableNode } from '@/sortable-hoc/getDraggableSortableNode';

export default function rectSwappingStrategy(
  rects: Array<DraggableSortableNode>,
  index: number,
  activeIndex: number
) {
  let oldRect;
  let newRect;

  if (index === activeIndex) {
    oldRect = rects[index];
    newRect = rects[overIndex];
  }

  if (index === overIndex) {
    oldRect = rects[index];
    newRect = rects[activeIndex];
  }

  if (!newRect || !oldRect) {
    return null;
  }

  return {
    x: newRect.left - oldRect.left,
    y: newRect.top - oldRect.top
  };
}
