import { Fragment } from 'react';

import TableColumnsDraggableSorting from '@/components/DraggableSorting/TableColumnsDraggableSorting';

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

export default function DnDKitPage() {
  return (
    <Fragment>
      <TableColumnsDraggableSorting sortingItems={SORTING_ITEMS} />
    </Fragment>
  );
}
