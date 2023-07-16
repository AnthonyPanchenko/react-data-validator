import { DraggableSortableNode } from '@/sortable-hoc/getDraggableSortableNode';

export default function horizontalSorting(
  rects: Array<DraggableSortableNode>,
  toIndex: number,
  fromIndex: number
) {
  const activeNode = rects[fromIndex];

  if (!activeNode) {
    return 0;
  }

  const itemGap = getHorizontalSortingItemGap(rects, toIndex, fromIndex);

  if (toIndex > fromIndex) {
    return -activeNode.width - itemGap;
  }

  if (toIndex < fromIndex) {
    return activeNode.width + itemGap;
  }

  return 0;
}

function getHorizontalSortingItemGap(
  rects: Array<DraggableSortableNode>,
  toIndex: number,
  fromIndex: number
) {
  const curr: DraggableSortableNode | undefined = rects[toIndex];
  const prev: DraggableSortableNode | undefined = rects[toIndex - 1];
  const next: DraggableSortableNode | undefined = rects[toIndex + 1];

  if (!curr || (!prev && !next)) {
    return 0;
  }

  if (fromIndex < toIndex) {
    return prev
      ? curr.offsets.x - (prev.offsets.x + prev.width)
      : next.offsets.x - (curr.offsets.x + curr.width);
  }

  return next
    ? next.offsets.x - (curr.offsets.x + curr.width)
    : curr.offsets.x - (prev.offsets.x + prev.width);
}
