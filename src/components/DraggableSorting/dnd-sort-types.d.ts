export type SelectOption = { label: string; value: string };
export type SortableItems = Record<string, ReadonlyArray<SelectOption>>;
export type SequentiallyColumns = Record<string, ReadonlyArray<UniqueIdentifier>>;

export type SequenceOfIdentifiers<TColumnName extends string> = {
  inactive: ReadonlyArray<TColumnName>;
  active: ReadonlyArray<TColumnName>;
};
