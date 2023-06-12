import { createContext, useContext, useSyncExternalStore } from 'react';

import {
  FormValidatorValidationNode,
  FormValidatorValidationNodes,
  InitialValidationFieldDataType,
  ValidationFieldDataType,
  ValidationFieldMetaData
} from '@/validator/hooks/validation-field-types';
import { formFiledValueSelector } from '@/validator/utils';

type FieldErrorConfig = {
  fieldPath: ReadonlyArray<string>;
};

type FormValidatorReturnType<TData extends { [key in keyof TData]: TData[key] }> = {
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  subscribe: (onStoreChange: () => void) => () => boolean;
  validateForm: (data: TData) => void;
  validateField: (fieldPath: ReadonlyArray<string>) => void;
  deleteValidationField: (fieldPath: ReadonlyArray<string>) => void;
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

// eslint-disable-next-line @typescript-eslint/ban-types
const ValidatorContext = createContext<FormValidatorReturnType<{}>>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  {} as FormValidatorReturnType<{}>
);

export default function useFormFieldError<TError>(config: FieldErrorConfig): TError | undefined {
  const formValidator = useContext(ValidatorContext);

  const data = useSyncExternalStore(
    formValidator.subscribe,
    formValidator.getFormData,
    formValidator.getFormData
  );

  // eslint-disable-next-line @typescript-eslint/ban-types
  const currentValidationNode = formFiledValueSelector<
    FormValidatorValidationNode<unknown, TError>,
    FormValidatorValidationNodes
  >(data.validationData, config.fieldPath, {
    metaData: {} as ValidationFieldMetaData<TError>
  } as FormValidatorValidationNode<unknown, TError>);

  console.log('FieldError render analyzer:', config.fieldPath);

  return currentValidationNode.metaData.errors;
}
