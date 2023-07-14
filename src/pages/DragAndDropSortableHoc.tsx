import './drag-and-drop-page.scss';

import { Fragment, useState } from 'react';

import DragAndDropSortingContainer from '@/sortable-hoc/SortableContainer/DragAndDropSortingContainer';
import DragAndDropSortingSource from '@/sortable-hoc/SortableContainer/DragAndDropSortingSource';
import { arrayMove } from '@/sortable-hoc/utils';

const SORTING_ITEMS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  {
    label:
      'Lorem ipsum dolor sit amet, consectetur adipiscaliquip ex voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    value: '4'
  },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  {
    label:
      'Lorem ipsum dolor sit amet, consectetur adna alsi ehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    value: '7'
  },
  { label: '8', value: '8' },
  {
    label:
      'Lorem ipsum dolor sit amet, consectet dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    value: '9'
  },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  {
    label:
      'Lorem ipsum dolor sit amet, consectetur aduis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    value: '13'
  },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' }
];

type ItemType = { label: string; value: string };

export default function DragAndDropSortableHoc() {
  const [sortingItemsY, setSortingItemsStateY] = useState<ReadonlyArray<ItemType>>(SORTING_ITEMS);
  const [sortingItemsX, setSortingItemsStateX] = useState<ReadonlyArray<ItemType>>(SORTING_ITEMS);

  const onSortEndX = (oldIndex: number, newIndex: number) => {
    setSortingItemsStateX(prevItems => arrayMove(prevItems, oldIndex, newIndex));
  };
  const onSortEndY = (oldIndex: number, newIndex: number) => {
    setSortingItemsStateY(prevItems => arrayMove(prevItems, oldIndex, newIndex));
  };

  return (
    <Fragment>
      <div className="text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem
        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>

      <DragAndDropSortingContainer axis="y" onDropChange={onSortEndY}>
        <div className={'dnd-area y-area'}>
          {sortingItemsY.map((item, i) => (
            <DragAndDropSortingSource key={item.value} index={i}>
              <input type="checkbox" name={item.label} id={item.value} />
              <label>{item.label}</label>
            </DragAndDropSortingSource>
          ))}
        </div>
      </DragAndDropSortingContainer>

      <DragAndDropSortingContainer axis="x" onDropChange={onSortEndX}>
        <div className={'dnd-area x-area'}>
          {sortingItemsX.map((item, i) => (
            <DragAndDropSortingSource key={item.value} index={i}>
              <input type="checkbox" name={item.label} id={item.value} />
              <label>{item.label}</label>
            </DragAndDropSortingSource>
          ))}
        </div>
      </DragAndDropSortingContainer>
    </Fragment>
  );
}
