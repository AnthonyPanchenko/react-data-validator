export default function rectSortingStrategy({ rects, activeIndex, overIndex, index }) {
  const newRects = arrayMove(rects, overIndex, activeIndex);

  const oldRect = rects[index];
  const newRect = newRects[index];

  if (!newRect || !oldRect) {
    return null;
  }

  return {
    x: newRect.left - oldRect.left,
    y: newRect.top - oldRect.top
  };
}
