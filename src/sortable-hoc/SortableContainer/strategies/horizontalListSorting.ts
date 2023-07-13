export default function horizontalListSorting({
  rects,
  activeNodeRect: fallbackActiveRect,
  activeIndex,
  overIndex,
  index
}) {
  const activeNodeRect = rects[activeIndex] ?? fallbackActiveRect;

  if (!activeNodeRect) {
    return null;
  }

  const itemGap = getItemGap(rects, index, activeIndex);

  if (index === activeIndex) {
    const newIndexRect = rects[overIndex];

    if (!newIndexRect) {
      return null;
    }

    return {
      x:
        activeIndex < overIndex
          ? newIndexRect.left + newIndexRect.width - (activeNodeRect.left + activeNodeRect.width)
          : newIndexRect.left - activeNodeRect.left,
      y: 0
    };
  }

  if (index > activeIndex && index <= overIndex) {
    return {
      x: -activeNodeRect.width - itemGap,
      y: 0
    };
  }

  if (index < activeIndex && index >= overIndex) {
    return {
      x: activeNodeRect.width + itemGap,
      y: 0
    };
  }

  return {
    x: 0,
    y: 0
  };
}

function getItemGap(rects: ClientRect[], index: number, activeIndex: number) {
  const currentRect: ClientRect | undefined = rects[index];
  const previousRect: ClientRect | undefined = rects[index - 1];
  const nextRect: ClientRect | undefined = rects[index + 1];

  if (!currentRect || (!previousRect && !nextRect)) {
    return 0;
  }

  if (activeIndex < index) {
    return previousRect
      ? currentRect.left - (previousRect.left + previousRect.width)
      : nextRect.left - (currentRect.left + currentRect.width);
  }

  return nextRect
    ? nextRect.left - (currentRect.left + currentRect.width)
    : currentRect.left - (previousRect.left + previousRect.width);
}
