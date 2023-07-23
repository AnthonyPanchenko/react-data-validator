import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';

export type ItemType = { label: string; value: string };

type SortableListProps = {
  items: ReadonlyArray<ItemType>;
  onSetActiveNodeId: (id: string | number) => void;
  onDragEnd: React.Dispatch<React.SetStateAction<ReadonlyArray<ItemType>>>;
  children: React.ReactNode | React.ReactNode[] | string | null;
};

export function SortableContainer({
  items,
  children,
  onSetActiveNodeId,
  onDragEnd
}: SortableListProps) {
  // useSensor(TouchSensor)
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const fromIndex: number | undefined = event.active.data.current?.sortable.index;
    const toIndex: number | undefined = event.over?.data.current?.sortable.index;

    if (fromIndex !== undefined && toIndex !== undefined && toIndex !== fromIndex) {
      onDragEnd(prevItems => arrayMove<ItemType>(prevItems as ItemType[], fromIndex, toIndex));
    }
    onSetActiveNodeId('');
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => {
        onSetActiveNodeId(active.id);
      }}
    >
      <SortableContext items={items.map(item => item.value)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
