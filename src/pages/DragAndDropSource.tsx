import './drag-and-drop.scss';

import useDragSource from '@/drag-and-drop/useDragSource';

type PropsTypes<TItem = unknown> = {
  item: TItem;
  index: number;
  axis?: 'x' | 'y';
  className?: string;
  children?: React.ReactNode | React.ReactNode[] | null;
};

export default function DragAndDropSource<TItem = unknown>({
  children,
  className,
  axis,
  item,
  index
}: PropsTypes<TItem>) {
  const [onMouseDown, onTouchStart, elementRef, isActive, cords] = useDragSource<
    HTMLDivElement,
    TItem
  >(item, index);

  let currentClassName = 'dnd-source';

  if (className) {
    currentClassName += ' ' + className;
  }

  if (isActive) {
    currentClassName += axis === undefined ? ' active' : ' active-' + axis;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={elementRef}
      style={{ '--cord-x': cords[0] + 'px', '--cord-y': cords[1] + 'px' } as React.CSSProperties}
      className={currentClassName}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {children}
    </div>
  );
}
