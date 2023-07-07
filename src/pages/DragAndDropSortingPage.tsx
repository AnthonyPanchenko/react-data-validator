import './drag-and-drop-page.scss';

import { Fragment, useState } from 'react';

import DragAndDropSorting from '@/drag-and-drop-sorting/DragAndDropSorting';
import DragAndDropSortingSource from '@/drag-and-drop-sorting/DragAndDropSortingSource';

const SORTING_ITEMS = [
  { label: '11111', value: '11111' },
  { label: '22222', value: '22222' },
  { label: '33333', value: '33333' },
  { label: '44444', value: '44444' },
  { label: '55555', value: '55555' },
  { label: '66666', value: '66666' },
  { label: '77777', value: '77777' },
  { label: '88888', value: '88888' },
  { label: '99999', value: '99999' },
  { label: '10101', value: '10101' },
  { label: '121212', value: '121212' },
  { label: '131313', value: '131313' },
  { label: '141414', value: '141414' },
  { label: '151515', value: '151515' },
  { label: '161616', value: '161616' },
  { label: '171717', value: '171717' },
  { label: '181818', value: '181818' },
  { label: '191919', value: '191919' },
  { label: '202020', value: '202020' },
  { label: '212121', value: '212121' }
];

type ItemType = { label: string; value: string };

export default function DragAndDropSortingPage() {
  const [sortingItems, setSortingItemsState] = useState<ReadonlyArray<ItemType>>(SORTING_ITEMS);
  const [checkedItems, setChecked] = useState<Record<string, boolean>>({});

  return (
    <Fragment>
      <div className="text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>

      <DragAndDropSorting<ItemType>
        className="box-1"
        items={sortingItems}
        onChange={newItems => {
          setSortingItemsState(newItems);
          console.log(newItems);
        }}
      >
        {(item, i, onRegisterDragItem) => (
          <DragAndDropSortingSource
            key={item.value + i}
            index={i}
            onRegisterDragItem={onRegisterDragItem}
          >
            <input
              type="checkbox"
              name={item.label}
              id={item.value}
              checked={!!checkedItems[item.value]}
              onChange={() =>
                setChecked(prev => {
                  return { ...prev, [item.value]: !prev[item.value] };
                })
              }
            />
            <label>{item.label}</label>
          </DragAndDropSortingSource>
        )}
      </DragAndDropSorting>
    </Fragment>
  );
}
