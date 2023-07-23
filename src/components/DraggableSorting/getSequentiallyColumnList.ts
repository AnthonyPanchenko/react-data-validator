import { SelectOption } from '@/typings';

export type SequentiallyColumnList<TColumnName extends string> = {
  inactiveSequenceOfColumns: ReadonlyArray<TColumnName>;
  activeSequenceOfColumns: ReadonlyArray<TColumnName>;
  inactiveColumnList: ReadonlyArray<SelectOption<TColumnName>>;
  activeColumnsList: ReadonlyArray<SelectOption<TColumnName>>;
};

export default function getSequentiallyColumnList<TColumnName extends string>(
  sequenceOfColumns: ReadonlyArray<TColumnName>,
  inactiveSequence: ReadonlyArray<TColumnName> | undefined | null,
  columnList: ReadonlyArray<SelectOption<TColumnName>>
): SequentiallyColumnList<TColumnName> {
  const activeSequenceOfColumns = [...sequenceOfColumns];
  const inactiveColumnList = [...columnList];
  const activeColumnsList = [];

  let i = 0;

  while (i < activeSequenceOfColumns.length) {
    const k = inactiveColumnList.findIndex(item => item.value === activeSequenceOfColumns[i]);
    if (k >= 0) {
      activeColumnsList.push(inactiveColumnList.splice(k, 1)[0]);
      i++;
    } else {
      activeSequenceOfColumns.splice(i, 1);
    }
  }

  if (inactiveSequence?.length) {
    const currentInactiveColumnList = [];

    for (const a of inactiveSequence) {
      const j = inactiveColumnList.findIndex(item => item.value === a);
      if (j >= 0) {
        currentInactiveColumnList.push(inactiveColumnList.splice(j, 1)[0]);
      }
    }

    const mergedInactiveColumnList = inactiveColumnList.length
      ? [...currentInactiveColumnList, ...inactiveColumnList]
      : currentInactiveColumnList;

    return {
      inactiveSequenceOfColumns: mergedInactiveColumnList.map(item => item.value),
      activeSequenceOfColumns,
      inactiveColumnList: mergedInactiveColumnList,
      activeColumnsList
    };
  }

  return {
    inactiveSequenceOfColumns: inactiveColumnList.map(item => item.value),
    activeSequenceOfColumns,
    inactiveColumnList,
    activeColumnsList
  };
}
