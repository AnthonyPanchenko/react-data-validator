import { useCallback, useRef, useSyncExternalStore } from 'react';

// type ValidationRule<TValue = undefined> = {
//   error: string;
//   validator: (value: TValue) => void;
// }

// type FieldArray = [];
// type Nested = {};
// [
//   {
//     children: []
//   }
// ]

export interface ValidationFieldMetaInfo {
  readonly isValid: boolean;
  readonly isDirty: boolean;
  readonly isValidating: boolean;
  readonly isTouched: boolean;
  readonly fieldPath: string;
  readonly errors: ReadonlyArray<string> | string;
  readonly children: ReadonlyArray<ValidationFieldMetaInfo>;
}

export interface ValidationField<TValue = undefined> extends ValidationFieldMetaInfo {
  readonly initialValue: TValue;
  readonly value: TValue;
  readonly validator: (
    value: TValue
  ) => ReadonlyArray<string> | string | Promise<ReadonlyArray<string> | string>;
}

// function createValidationFieldMetaInfo() {}

export default function useDataValidator<TValidationFields>(initialState: TValidationFields) {
  const store = useRef(initialState);
  const subscribers = useRef(new Set<() => void>());

  const getAll = useCallback(() => store.current, []);

  // const getSingle = useCallback((field: keyof TValidationFields) => store.current[field], []);

  const setSingle = useCallback(
    (field: keyof TValidationFields, value: TValidationFields[keyof TValidationFields]) => {
      store.current = { ...store.current, [field]: value };
      for (const subscriber of subscribers.current) {
        subscriber();
      }
    },
    []
  );

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  const state = useSyncExternalStore(subscribe, getAll);

  return {
    state,
    setSingle
  };
}
