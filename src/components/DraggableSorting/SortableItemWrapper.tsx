import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import SortableItem from './SortableItem';

type PropsTypes = {
  id: string | number;
  containerId: string;
  className?: string;
  children: React.ReactNode | React.ReactNode[] | string | null;
};

export default function SortableItemWrapper({ id, containerId, children }: PropsTypes) {
  const sortItem = useSortable({
    id,
    data: {
      containerId
    }
  });

  // active: import("@dnd-kit/core").Active | null;
  // activeIndex: number;
  // data: SortableData & {
  //     [x: string]: any;
  // };
  // rect: import("react").MutableRefObject<import("@dnd-kit/core").ClientRect | null>;
  // index: number;
  // newIndex: number;
  // items: import("@dnd-kit/core").UniqueIdentifier[];
  // isOver: boolean;
  // isSorting: boolean;
  // isDragging: boolean;
  // overIndex: number;
  // over: import("@dnd-kit/core").Over | null;
  // setNodeRef: (node: HTMLElement | null) => void;
  // setActivatorNodeRef: (element: HTMLElement | null) => void;
  // setDroppableNodeRef: (element: HTMLElement | null) => void;
  // setDraggableNodeRef: (element: HTMLElement | null) => void;
  // transform: import("@dnd-kit/utilities").Transform | null;
  // transition: string | undefined;

  const style = {
    transform: CSS.Transform.toString({
      scaleX: 1,
      scaleY: 1,
      x: sortItem.transform?.x || 0,
      y: sortItem.transform?.y || 0
    }),
    opacity: sortItem.isDragging ? 0.3 : undefined,
    transition: sortItem.transition
  };

  return (
    <SortableItem
      ref={sortItem.setNodeRef}
      attributes={sortItem.attributes}
      listeners={sortItem.listeners}
      containerId={containerId}
      style={style}
    >
      {children}
    </SortableItem>
  );
}
