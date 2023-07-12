import './drag-and-drop-page.scss';

import { Fragment, useState } from 'react';

import DragAndDropSorting from '@/drag-and-drop-sorting/DragAndDropSorting';
import DragAndDropSortingSource from '@/drag-and-drop-sorting/DragAndDropSortingSource';

const SORTING_ITEMS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' }
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
        {(item, registerEventInfo, registerStateSetters, registerRef) => (
          <DragAndDropSortingSource
            key={item.value}
            onRegisterRef={registerRef}
            onRegisterEventInfo={registerEventInfo}
            onRegisterStateSetters={registerStateSetters}
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
