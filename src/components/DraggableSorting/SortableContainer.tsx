import { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Fragment } from 'react';

import SortableItemWrapper from './SortableItemWrapper';

type PropsTypes<TColumnName extends string> = {
  label: string;
  containerId: string;
  items: ReadonlyArray<TColumnName>;
  itemLabelGetter: (name: TColumnName) => string;
  // style?: React.CSSProperties;
};

export default function SortableContainer<TColumnName extends string>({
  containerId,
  items,
  label,
  itemLabelGetter
}: PropsTypes<TColumnName>) {
  return (
    <Fragment>
      <div className="sort-container-label">{label}</div>
      <ul className="sortable-list">
        <SortableContext
          items={items as unknown as UniqueIdentifier[]}
          strategy={verticalListSortingStrategy}
        >
          {items.map((value, index) => (
            <SortableItemWrapper key={value} id={value} index={index} containerId={containerId}>
              {itemLabelGetter(value)}
            </SortableItemWrapper>
          ))}
        </SortableContext>
      </ul>
    </Fragment>
  );
}
