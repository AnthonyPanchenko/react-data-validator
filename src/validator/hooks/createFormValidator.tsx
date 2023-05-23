import lodash from 'lodash';
import { createContext, useCallback, useContext, useRef, useSyncExternalStore } from 'react';

export default function createFormValidator<TData extends { [key in keyof TData]: TData[key] }>() {
  function useFormValidator(initialData: TData) {
    // subscribeOnFieldError: () => void;
    // const [value, setFieldValue] = useState<TData>();

    const data = useRef<TData>(initialData);
    const subscribers = useRef(new Set<() => void>());

    // useEffect(() => {
    //   if (condition) {

    //   }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    //  useDeepCompareEffect(() => {
    //   if (shouldReinitialize) {
    //     initialSate
    //   }

    // }, [initialSate, shouldReinitialize]);

    // const registerField = () => {

    // }

    //{ 'companyData.companyName': value }

    const getData = useCallback(() => data.current, []);

    const setData = useCallback((value: unknown, fieldPath: string) => {
      data.current = lodash.set(data.current, fieldPath, value);
      for (const onStoreChange of subscribers.current) {
        onStoreChange();
      }
    }, []);

    const subscribe = useCallback((onStoreChange: () => void) => {
      subscribers.current.add(onStoreChange);
      return () => subscribers.current.delete(onStoreChange);
    }, []);

    return {
      // setAsyncData
      // validateForm
      getData,
      setData,
      subscribe,
      initialData
    };
  }

  // =====================================================useFormValidator============================================================

  type ValidatorContextReturnType = ReturnType<typeof useFormValidator>;

  const ValidatorContext = createContext<ValidatorContextReturnType>(
    {} as ValidatorContextReturnType
  );

  // =====================================================useFieldValidator============================================================

  function useFieldValidator<TValue>(
    selector: (data: TData) => TValue,
    fieldPath: string
  ): [value: TValue, setData: (value: TValue, fieldPath?: string) => void] {
    const store = useContext(ValidatorContext);

    const value = useSyncExternalStore(
      store.subscribe,
      () => selector(store.getData()),
      () => selector(store.initialData)
    );

    const setData = (value: TValue, path?: string) => store.setData(value, path || fieldPath);

    return [value, setData];
  }

  // =====================================================FormValidationField============================================================

  type FormFieldValidatorType<TValue> = {
    children: (
      value: TValue,
      setValue: (value: TValue, fieldPath?: string) => void
    ) => JSX.Element | null;
    fieldPath: string;
    // validator: (
    //   value: TValue | undefined
    // ) => ReadonlyArray<string> | string | Promise<ReadonlyArray<string> | string>;
  };

  function FormFieldValidator<TValue>({ children, fieldPath }: FormFieldValidatorType<TValue>) {
    const formFieldValueGetter = (store: TData): TValue =>
      lodash.get(store, fieldPath, undefined) as TValue;
    const [value, setData] = useFieldValidator<TValue>(formFieldValueGetter, fieldPath);
    console.log('qqqq: ', value);
    return children(value, setData);
  }

  // type FormValidatorErrorMessageType<TValue> = {
  //   children: (
  //     value: TValue,
  //     setValue: (value: TValue, fieldPath?: string) => void
  //   ) => JSX.Element | null;
  //   fieldPath: string;
  //   // validator: (
  //   //   value: TValue | undefined
  //   // ) => ReadonlyArray<string> | string | Promise<ReadonlyArray<string> | string>;
  // };

  // function FormValidatorErrorMessage<TError>({ children, fieldPath }: FormValidatorErrorMessageType<TError>) {
  //   const formFieldValueGetter = (store: TData): TValue =>
  //     lodash.get(store, fieldPath, undefined) as TValue;
  //   const [value, setData] = useFieldValidator<TValue>(formFieldValueGetter, fieldPath);

  //   return children(value, setData);
  // }

  return {
    useFieldValidator,
    useFormValidator,
    FormFieldValidator,
    // FormValidatorErrorMessage,
    ContextProvider: ValidatorContext.Provider
    // FormValidatorProvider,
    // FormArrayValidator,
  };
}

// export type UseDataValidatorReturnType<TData extends { [key in keyof TData]: TData[key] }> = {
//   getData: () => TData;
//   setData: (value: Partial<TData>) => void;
//   subscribe: (callback: () => void) => () => void;
// };
