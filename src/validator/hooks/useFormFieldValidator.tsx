import { dequal } from 'dequal';
import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import {
  FormValidatorValidationNode,
  FormValidatorValidationNodes,
  InitialValidationFieldDataType,
  ValidationFieldDataType,
  ValidationFieldMetaData
} from '@/validator/hooks/validation-field-types';
import { formFiledValueSelector } from '@/validator/utils';

type FieldValidatorConfig<TValue, TError = string> = {
  fieldPath: ReadonlyArray<string | number>;
  initialValue: TValue;
  isValid?: boolean;
  isDirty?: boolean;
  isValidating?: boolean;
  isTouched?: boolean;
  isSkipped?: boolean;
  errors?: TError;
  validator: (value: TValue) => TError | Promise<TError>;
  // subscribeOnError?: () => void;
  // subscribeOnMetaChange?: () => void;
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

type FieldValidatorReturnType<TValue, TError = string> = {
  fieldPath: ReadonlyArray<string | number>;
  value: TValue | undefined;
  errors: TError | undefined;
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  isTouched: boolean;
  isSkipped: boolean;
  // resetField: () => void;
  setFieldValue: (value: TValue) => void;
  // validateField: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const ValidatorContext = createContext<FormValidatorReturnType<{}>>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  {} as FormValidatorReturnType<{}>
);

export default function useFormFieldValidator<TValue, TError = string>(
  config: FieldValidatorConfig<TValue, TError>
): FieldValidatorReturnType<TValue, TError> {
  const formValidator = useContext(ValidatorContext);

  const data = useSyncExternalStore(
    formValidator.subscribe,
    formValidator.getFormData,
    formValidator.getFormData
  );

  const currentValidationNode = formFiledValueSelector<
    FormValidatorValidationNode<TValue, TError> | undefined,
    FormValidatorValidationNodes
  >(data.validationData, config.fieldPath, undefined);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const currentValue = formFiledValueSelector<TValue | undefined, {}>(
    data.currentData,
    config.fieldPath,
    undefined
  );

  useEffect(() => {
    formValidator.initializeValidationField({
      initialValue: config.initialValue,
      initialMetaData: {
        isValid: !!config.isValid,
        isDirty: !!config.isDirty,
        isTouched: !!config.isTouched,
        errors: config.errors
      },
      fieldPath: config.fieldPath,
      isSkipped: !!config.isSkipped,
      validator: config.validator
    });

    return () => {
      formValidator.deleteValidationField(config.fieldPath);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDeepCompareEffect(() => {
    if (currentValidationNode) {
      const isCurrentDirty = !dequal(currentValue, currentValidationNode.initialValue);
      console.log('isCurrentDirty', isCurrentDirty);
      console.log('currentValue', currentValue);
    }
  }, [currentValue]);

  // const resetField = () => {
  //   console.log('resetField: ', config.fieldPath);
  // };

  const setFieldValue = (value: TValue) => {
    formValidator.setFieldData<TValue>({
      fieldPath: config.fieldPath,
      metaData: { isTouched: true },
      value
    });
    console.log('setFieldValue: ', config.fieldPath, value);
  };

  // const validateField = () => {
  //   if (currentValidationNode) {
  //     console.log('validateField: ', config.fieldPath);
  //     currentValidationNode.validator(currentValidationNode.value, {});
  //   }
  // };

  console.log('FieldValidator render analyzer:', config.fieldPath);

  const vNode =
    currentValidationNode ??
    ({
      metaData: {} as ValidationFieldMetaData<TError>
    } as FormValidatorValidationNode<unknown, TError>);

  return {
    value: currentValue,
    fieldPath: config.fieldPath,
    isValid: !!vNode.metaData.isValid,
    isDirty: !!vNode.metaData.isDirty,
    isValidating: !!vNode.isValidating,
    isTouched: !!vNode.metaData.isTouched,
    isSkipped: !!vNode.isSkipped,
    errors: vNode.metaData.errors,
    setFieldValue
  };
}
