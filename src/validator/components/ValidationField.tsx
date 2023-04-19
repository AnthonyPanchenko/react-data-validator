import {
  UseDataValidatorReturnType,
  useValidationField
} from '@/validator/hooks/createDataValidatorContext';

type ValidationFieldType<TValue, TData extends { [key in keyof TData]: TData[key] }> = {
  children: (value: TValue, setValue: (value: Partial<TData>) => void) => JSX.Element | null;
  fieldPath: keyof TData;
  validator: (
    value: TValue | undefined
  ) => ReadonlyArray<string> | string | Promise<ReadonlyArray<string> | string>;
  validatorStore: UseDataValidatorReturnType<TData>;
};

export default function ValidationField<
  TValue,
  TData extends { [key in keyof TData]: TData[key] }
>({ fieldPath, children, validator, validatorStore }: ValidationFieldType<TValue, TData>) {
  const [data, setValue] = useValidationField<TValue, TData>(
    store => store[fieldPath],
    validatorStore
  );

  return children(data, setValue);
}
