import { DraggableSortableNode } from '@/sortable-hoc/getDraggableSortableNode';

export default function verticalSorting(
  rects: Array<DraggableSortableNode>,
  toIndex: number,
  fromIndex: number
) {
  const activeNode = rects[fromIndex];

  if (!activeNode) {
    return 0;
  }

  const itemGap = getVerticalSortingItemGap(rects, toIndex, fromIndex);

  if (toIndex > fromIndex) {
    return -activeNode.height - itemGap;
  }

  if (toIndex < fromIndex) {
    return activeNode.height + itemGap;
  }

  return 0;
}

function getVerticalSortingItemGap(
  rects: Array<DraggableSortableNode>,
  toIndex: number,
  fromIndex: number
) {
  const curr: DraggableSortableNode | undefined = rects[toIndex];
  const prev: DraggableSortableNode | undefined = rects[toIndex - 1];
  const next: DraggableSortableNode | undefined = rects[toIndex + 1];

  if (!curr) {
    return 0;
  }

  if (fromIndex < toIndex) {
    return prev
      ? curr.offsets.y - (prev.offsets.y + prev.height)
      : next
      ? next.offsets.y - (curr.offsets.y + curr.height)
      : 0;
  }

  return next
    ? next.offsets.y - (curr.offsets.y + curr.height)
    : prev
    ? curr.offsets.y - (prev.offsets.y + prev.height)
    : 0;
}
