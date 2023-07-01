import './drag-and-drop.scss';

import useDragSource from '@/drag-and-drop/useDragSource';

type PropsTypes<TItem = unknown> = {
  item: TItem;
  className?: string;
  children?: React.ReactNode | React.ReactNode[] | null;
};

export default function DragAndDropSource<TItem = unknown>({
  children,
  className,
  item
}: PropsTypes<TItem>) {
  const [onMouseDown, onTouchStart, elementRef] = useDragSource<HTMLDivElement, TItem>(item);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={elementRef}
      className={typeof className === 'string' ? 'dnd-source ' + className : 'dnd-source'}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {children}
    </div>
  );
}
