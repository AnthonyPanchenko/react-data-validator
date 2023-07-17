import './drag-and-drop-page.scss';

import { Fragment, useState } from 'react';

import DragAndDropSortingContainer from '@/sortable-hoc/SortableContainer/DragAndDropSortingContainer';
import DragAndDropSortingSource from '@/sortable-hoc/SortableContainer/DragAndDropSortingSource';
import { arrayMove } from '@/sortable-hoc/utils';

const SORTING_ITEMS = [
  { label: '0', value: 'item_0' },
  { label: '1', value: 'item_1' },
  { label: '2', value: 'item_2' },
  { label: '3', value: 'item_3' },
  {
    label:
      '4 - Lorem ipsum dolor sit amet, consectetur adipiscaliquip ex voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    value: 'item_4'
  },
  { label: '5', value: 'item_5' },
  { label: '6', value: 'item_6' },
  {
    label:
      '7 - Lorem ipsum dolor sit amet, consectetur adna alsi ehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    value: 'item_7'
  },
  { label: '8', value: 'item_8' },
  {
    label:
      '9 - Lorem ipsum dolor sit amet, consectet dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    value: 'item_9'
  },
  { label: '10', value: 'item_10' },
  { label: '11', value: 'item_11' },
  { label: '12', value: 'item_12' },
  {
    label:
      '13 - Lorem ipsum dolor sit amet, consectetur aduis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    value: 'item_13'
  },
  { label: '14', value: 'item_14' },
  { label: '15', value: 'item_15' },
  { label: '16', value: 'item_16' },
  { label: '17', value: 'item_17' },
  { label: '18', value: 'item_18' },
  { label: '19', value: 'item_19' }
];

type ItemType = { label: string; value: string };

export default function DragAndDropSortableHoc() {
  const [sortingItemsY, setSortingItemsStateY] = useState<ReadonlyArray<ItemType>>(SORTING_ITEMS);
  const [sortingItemsX, setSortingItemsStateX] = useState<ReadonlyArray<ItemType>>(SORTING_ITEMS);

  const onSortEndX = (oldIndex: number, newIndex: number) => {
    if (oldIndex !== newIndex) {
      setSortingItemsStateX(prevItems => arrayMove(prevItems, oldIndex, newIndex));
    }
  };
  const onSortEndY = (oldIndex: number, newIndex: number) => {
    if (oldIndex !== newIndex) {
      setSortingItemsStateY(prevItems => arrayMove(prevItems, oldIndex, newIndex));
    }
  };

  return (
    <Fragment>
      <div className="text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>

      <DragAndDropSortingContainer axis="y" onDropChange={onSortEndY}>
        <div className={'dnd-area y-area'}>
          {sortingItemsY.map((item, i) => (
            <DragAndDropSortingSource key={item.value} id={item.value} index={i} label={item.label}>
              <input type="checkbox" name={item.label} id={item.value} />
              <label>{item.label}</label>
            </DragAndDropSortingSource>
          ))}
        </div>
      </DragAndDropSortingContainer>

      <DragAndDropSortingContainer axis="x" onDropChange={onSortEndX}>
        <div className={'dnd-area x-area'}>
          {sortingItemsX.map((item, i) => (
            <DragAndDropSortingSource key={item.value} id={item.value} index={i} label={item.label}>
              <input type="checkbox" name={item.label} id={item.value} />
              <label>{item.label}</label>
            </DragAndDropSortingSource>
          ))}
        </div>
      </DragAndDropSortingContainer>
    </Fragment>
  );
}
