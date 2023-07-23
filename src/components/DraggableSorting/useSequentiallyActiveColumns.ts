import { DependencyList, useRef, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { SequenceOfIdentifiers } from '@/components/DraggableSorting/dnd-sort-types';
import getSequentiallyColumnList from '@/components/DraggableSorting/getSequentiallyColumnList';
import { getLocalStorage, setLocalStorage } from '@/components/DraggableSorting/utils';
import { SelectOption } from '@/typings';

type SequentiallyActiveColumnsOptions<TColumnName extends string> = {
  localStoreKey: string;
  columnList: ReadonlyArray<SelectOption<TColumnName>>;
  isLoading?: boolean;
  serverSequenceOfColumns?: ReadonlyArray<TColumnName> | null;
  defaultSequenceOfColumns: ReadonlyArray<TColumnName>;
  filterColumns?: (columnName: TColumnName) => boolean;
};

type SequentiallyActiveColumnsReturnType<TColumnName extends string> = [
  SequenceOfIdentifiers<TColumnName>,
  React.Dispatch<React.SetStateAction<SequenceOfIdentifiers<TColumnName>>>,
  React.MutableRefObject<{ [key: string]: string }>
];

export default function useSequentiallyActiveColumns<TColumnName extends string>(
  {
    localStoreKey,
    isLoading,
    columnList,
    serverSequenceOfColumns,
    defaultSequenceOfColumns,
    filterColumns
  }: SequentiallyActiveColumnsOptions<TColumnName>,
  deps: DependencyList = []
): SequentiallyActiveColumnsReturnType<TColumnName> {
  const itemsOptions = useRef<{ [key: string]: string }>({});

  const [currentData, updateColumns] = useState<SequenceOfIdentifiers<TColumnName>>({
    inactive: [],
    active: []
  });

  const updateSequenceOfColumnsLocally = (
    state:
      | ((data: SequenceOfIdentifiers<TColumnName>) => SequenceOfIdentifiers<TColumnName>)
      | SequenceOfIdentifiers<TColumnName>
  ) => {
    const localStoreInactiveSequenceKey = localStoreKey + 'InactiveSequence';
    const localStoreActiveSequenceKey = localStoreKey + 'ActiveSequence';

    if (typeof state === 'function') {
      const columns = state(currentData);
      updateColumns(columns);
      if (serverSequenceOfColumns === null) {
        setLocalStorage(localStoreActiveSequenceKey, columns.active);
      }
      setLocalStorage(localStoreInactiveSequenceKey, columns.inactive);
    } else if (state) {
      updateColumns(state);
      if (serverSequenceOfColumns === null) {
        setLocalStorage(localStoreActiveSequenceKey, state.active);
      }
      setLocalStorage(localStoreInactiveSequenceKey, state.inactive);
    }
  };

  const getSequentiallyColumnsData = (
    sequence: ReadonlyArray<TColumnName> | null | undefined,
    inactiveSequence: ReadonlyArray<TColumnName> | null | undefined
  ) => {
    const currentSequence = sequence?.length ? sequence : defaultSequenceOfColumns;
    return getSequentiallyColumnList(
      typeof filterColumns === 'function' ? currentSequence.filter(filterColumns) : currentSequence,
      inactiveSequence,
      columnList
    );
  };

  useDeepCompareEffect(() => {
    columnList.forEach(item => {
      itemsOptions.current[item.value] = item.label;
    });
    const localStoreInactiveSequenceKey = localStoreKey + 'InactiveSequence';
    const localStoreActiveSequenceKey = localStoreKey + 'ActiveSequence';
    const localStorInactiveSequence = getLocalStorage<ReadonlyArray<TColumnName>>(
      localStoreInactiveSequenceKey
    );
    const localStorActiveSequence = getLocalStorage<ReadonlyArray<TColumnName>>(
      localStoreActiveSequenceKey
    );

    if (isLoading !== undefined) {
      if (!isLoading && serverSequenceOfColumns !== null && serverSequenceOfColumns?.length) {
        const data = getSequentiallyColumnsData(serverSequenceOfColumns, localStorInactiveSequence);
        updateColumns({
          active: data.activeSequenceOfColumns,
          inactive: data.inactiveSequenceOfColumns
        });
      } else if (!isLoading && !serverSequenceOfColumns?.length) {
        const data = getSequentiallyColumnsData(localStorActiveSequence, localStorInactiveSequence);
        updateColumns({
          active: data.activeSequenceOfColumns,
          inactive: data.inactiveSequenceOfColumns
        });
      }
    } else {
      const data = getSequentiallyColumnsData(localStorActiveSequence, localStorInactiveSequence);
      updateColumns({
        active: data.activeSequenceOfColumns,
        inactive: data.inactiveSequenceOfColumns
      });
    }
  }, [...deps, serverSequenceOfColumns, columnList, isLoading]);

  return [currentData, updateSequenceOfColumnsLocally, itemsOptions];
}
