export default function verticalListSorting({
  activeIndex,
  activeNodeRect: fallbackActiveRect,
  index,
  rects
}) {
  const activeNodeRect = rects[activeIndex] ?? fallbackActiveRect;

  if (!activeNodeRect) {
    return null;
  }

  const itemGap = getItemGap(rects, index, activeIndex);

  if (index > activeIndex) {
    return {
      x: 0,
      y: -activeNodeRect.height - itemGap
    };
  }

  if (index < activeIndex) {
    return {
      x: 0,
      y: activeNodeRect.height + itemGap
    };
  }

  return {
    x: 0,
    y: 0
  };
}

function getItemGap(clientRects: ClientRect[], index: number, activeIndex: number) {
  const currentRect: ClientRect | undefined = clientRects[index];
  const previousRect: ClientRect | undefined = clientRects[index - 1];
  const nextRect: ClientRect | undefined = clientRects[index + 1];

  if (!currentRect) {
    return 0;
  }

  if (activeIndex < index) {
    return previousRect
      ? currentRect.top - (previousRect.top + previousRect.height)
      : nextRect
      ? nextRect.top - (currentRect.top + currentRect.height)
      : 0;
  }

  return nextRect
    ? nextRect.top - (currentRect.top + currentRect.height)
    : previousRect
    ? currentRect.top - (previousRect.top + previousRect.height)
    : 0;
}
