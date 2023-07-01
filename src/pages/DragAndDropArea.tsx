import './drag-and-drop.scss';

import useDragAndDropArea from '@/drag-and-drop/useDragAndDropArea';

type PropsTypes = {
  className?: string;
  children?: React.ReactNode | React.ReactNode[] | null;
};

export default function DragAndDropArea({ children, className }: PropsTypes) {
  const [areaRef] = useDragAndDropArea();

  return (
    <div
      ref={areaRef}
      className={typeof className === 'string' ? 'dnd-area ' + className : 'dnd-area'}
    >
      {children}
    </div>
  );
}
