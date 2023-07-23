import './dnd-kit.scss';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { SequenceOfIdentifiers } from '@/components/DraggableSorting/dnd-sort-types';
import useSequentiallyActiveColumns from '@/components/DraggableSorting/useSequentiallyActiveColumns';
import { SelectOption } from '@/typings';

import SortableContainer from './SortableContainer';
import SortableItem from './SortableItem';

type PropsType = {
  sortingItems: ReadonlyArray<SelectOption<string>>;
};

export default function TableColumnsDraggableSorting({ sortingItems }: PropsType) {
  const [items, setItems, mapOfLabels] = useSequentiallyActiveColumns<string>({
    localStoreKey: 'testItems',
    columnList: sortingItems,
    defaultSequenceOfColumns: ['item_8', 'item_12', 'item_16', 'item_5', 'item_3', 'item_17']
    // filterColumns: () =>
  });

  console.log('items: ', items);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [clonedItems, setClonedItems] = useState<SequenceOfIdentifiers<string> | null>(null);

  const itemLabelGetter = (name: string) => mapOfLabels.current[name];

  const findContainer = (id: string) => {
    return Object.hasOwn(items, id)
      ? id
      : Object.keys(items).find(key =>
          items[key as keyof SequenceOfIdentifiers<string>].includes(id as string)
        );
  };

  // const getIndex = (id: string): number => {
  //   const container = findContainer(id);
  //   return !container
  //     ? -1
  //     : items[container as keyof SequenceOfIdentifiers<string>].indexOf(id as string);
  // };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    setClonedItems(items);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId as string);
    const activeContainer = findContainer(active.id as string);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems(prevItems => {
        const activeItems = prevItems[activeContainer as keyof SequenceOfIdentifiers<string>];
        const overItems = prevItems[overContainer as keyof SequenceOfIdentifiers<string>];
        const overIndex = overItems.indexOf(overId as string);
        const activeIndex = activeItems.indexOf(active.id as string);

        let newIndex: number;

        if (overId in prevItems) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        const newActiveItems = prevItems[
          activeContainer as keyof SequenceOfIdentifiers<string>
        ].filter(item => item !== active.id);

        return {
          [activeContainer]: newActiveItems as ReadonlyArray<string>,
          [overContainer]: [
            ...prevItems[overContainer as keyof SequenceOfIdentifiers<string>].slice(0, newIndex),
            prevItems[activeContainer as keyof SequenceOfIdentifiers<string>][activeIndex],
            ...prevItems[overContainer as keyof SequenceOfIdentifiers<string>].slice(
              newIndex,
              prevItems[overContainer as keyof SequenceOfIdentifiers<string>].length
            )
          ] as ReadonlyArray<string>
        } as SequenceOfIdentifiers<string>;
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findContainer(active.id as string);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId as string);

    if (overContainer) {
      const activeIndex = items[activeContainer as keyof SequenceOfIdentifiers<string>].indexOf(
        active.id as string
      );
      const overIndex = items[overContainer as keyof SequenceOfIdentifiers<string>].indexOf(
        overId as string
      );

      if (activeIndex !== overIndex) {
        setItems(prevItems => ({
          ...prevItems,
          [overContainer]: arrayMove(
            prevItems[overContainer as keyof SequenceOfIdentifiers<string>] as string[],
            activeIndex,
            overIndex
          )
        }));
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  return (
    <DndContext
      sensors={sensors}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
      collisionDetection={rectIntersection}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="sortable-items-container">
        <SortableContainer
          label="Visible Columns"
          items={items.active}
          containerId="active"
          itemLabelGetter={itemLabelGetter}
        />
        <SortableContainer
          label="Hidden Columns"
          items={items.inactive}
          containerId="inactive"
          itemLabelGetter={itemLabelGetter}
        />
      </div>
      {createPortal(
        <DragOverlay adjustScale={false}>
          {!!activeId && (
            <SortableItem dragOverlay isSorting isDragging isDragOverlay>
              {itemLabelGetter(activeId)}
            </SortableItem>
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
