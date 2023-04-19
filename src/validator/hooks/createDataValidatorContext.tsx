import { useCallback, useRef, useSyncExternalStore } from 'react';

export type UseDataValidatorReturnType<TData extends { [key in keyof TData]: TData[key] }> = {
  getData: () => TData;
  setData: (value: Partial<TData>) => void;
  subscribe: (callback: () => void) => () => void;
};

export function useDataValidatorStateManager<
  TData extends { [key in keyof TData]: TData[key] }
>(): UseDataValidatorReturnType<TData> {
  const data = useRef<TData>({} as TData);
  const subscribers = useRef(new Set<() => void>());

  const getData = useCallback(() => data.current, []);

  const setData = useCallback((value: Partial<TData>) => {
    data.current = { ...data.current, ...value };
    for (const onStoreChange of subscribers.current) {
      onStoreChange();
    }
  }, []);

  const subscribe = useCallback((onStoreChange: () => void) => {
    subscribers.current.add(onStoreChange);
    return () => subscribers.current.delete(onStoreChange);
  }, []);

  return {
    getData,
    setData,
    subscribe
  };
}

export function useValidationField<TValue, TData>(
  selector: (data: TData) => TValue,
  stateManager: UseDataValidatorReturnType<TData>
): [TValue, (value: Partial<TData>) => void] {
  if (!stateManager) {
    throw new Error('validator state manager not found!');
  }

  const state = useSyncExternalStore(
    stateManager.subscribe,
    () => selector(stateManager.getData()),
    () => selector({ initialState: 'initialState' } as TData)
  );

  return [state, stateManager.setData];
}
