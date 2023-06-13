import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

import {
  FormValidatorValidationNodes,
  InitialValidationFieldDataType,
  ValidationFieldDataType
} from '@/validator/hooks/validation-field-types';
import { formFiledValueSelector } from '@/validator/utils';

type FieldArrayConfig = {
  fieldPath: ReadonlyArray<string | number>;
};

type FormValidatorReturnType<TData extends { [key in keyof TData]: TData[key] }> = {
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  subscribe: (onStoreChange: () => void) => () => boolean;
  validateForm: (data: TData) => void;
  validateField: (fieldPath: ReadonlyArray<string | number>) => void;
  deleteValidationField: (fieldPath: ReadonlyArray<string | number>) => void;
  setFieldData: <TValue, TError = string>(field: ValidationFieldDataType<TValue, TError>) => void;
  initializeValidationField: <TValue, TError = string>(
    field: InitialValidationFieldDataType<TValue, TError>
  ) => void;
  resetForm: () => void;
  getFormData: () => {
    validationData: FormValidatorValidationNodes;
    currentData: TData;
  };
};

type FieldValidatorReturnType<TArrayItem> = {
  fieldPath: ReadonlyArray<string | number>;
  entries: ReadonlyArray<TArrayItem>;
  addField: (item: TArrayItem) => void;
  deleteField: (index: number) => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const ValidatorContext = createContext<FormValidatorReturnType<{}>>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  {} as FormValidatorReturnType<{}>
);

export default function useFormFieldArray<TArrayItem>(
  config: FieldArrayConfig
): FieldValidatorReturnType<TArrayItem> {
  const formValidator = useContext(ValidatorContext);

  const data = useSyncExternalStore(
    formValidator.subscribe,
    formValidator.getFormData,
    formValidator.getFormData
  );

  // eslint-disable-next-line @typescript-eslint/ban-types
  const currentValue = formFiledValueSelector<ReadonlyArray<TArrayItem>, {}>(
    data.currentData,
    config.fieldPath,
    []
  );

  // const addField = (item: TItem, beforeIndex?: number) => void
  const addField = useCallback((item: TArrayItem) => {
    console.log('addField item: ', item);
  }, []);

  // const deleteField = (item: TItem, beforeIndex?: number) => void
  const deleteField = useCallback((index: number) => {
    console.log('deleteField: ', index);
  }, []);

  console.log('FieldArray render analyzer:', config.fieldPath);

  return {
    fieldPath: config.fieldPath,
    entries: currentValue,
    addField,
    deleteField
  };
}
