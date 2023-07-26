import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Fragment } from 'react';

import SortableItemWrapper from './SortableItemWrapper';

type PropsTypes<TColumnName extends string> = {
  label: string;
  containerId: string;
  items: ReadonlyArray<TColumnName>;
  itemLabelGetter: (name: TColumnName) => string;
};

export default function SortableContainer<TColumnName extends string>({
  containerId,
  items,
  label,
  itemLabelGetter
}: PropsTypes<TColumnName>) {
  const { isOver, setNodeRef } = useDroppable({
    id: containerId
  });

  return (
    <Fragment>
      <div className="sort-container-label">{label}</div>
      <ul ref={setNodeRef} className="sortable-list">
        <SortableContext
          items={items as unknown as UniqueIdentifier[]}
          strategy={verticalListSortingStrategy}
        >
          {items.map(value => (
            <SortableItemWrapper key={value} id={value} containerId={containerId}>
              {itemLabelGetter(value)}
            </SortableItemWrapper>
          ))}
        </SortableContext>
      </ul>
    </Fragment>
  );
}
