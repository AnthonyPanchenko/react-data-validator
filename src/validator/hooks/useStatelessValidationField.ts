import { useEffect } from 'react';
import isEqual from 'react-fast-compare';

import {
  StatelessValidationFieldConfig,
  ValidationFieldState,
  ValidationFieldStateManagerReturnType
} from '@/validator/hooks/validation-field-types';
import { isAsyncFunction } from '@/validator/utils';

type StatelessValidationFieldReturnType<TValue, TError = string> = {
  value: TValue | undefined;
  fieldState: ValidationFieldState<TValue, TError>;
  setInitialFieldState: (initialState: Partial<ValidationFieldState<TValue, TError>>) => void;
  setFieldState: (newState: Partial<ValidationFieldState<TValue, TError>>) => void;
  setFieldValue: (value: TValue) => {
    validate: <TAddValue = undefined>(value?: TAddValue) => void;
  };
  resetFieldState: () => void;
};

export default function useStatelessValidationField<TValue, TError = string>(
  useStateManager: (
    initialSate: ValidationFieldState<TValue, TError>
  ) => ValidationFieldStateManagerReturnType<TValue, TError>,
  config: StatelessValidationFieldConfig<TValue, TError>
): StatelessValidationFieldReturnType<TValue, TError> {
  const validationFieldState = useStateManager({
    initialValue: config.initialValue,
    isValid: config.isValid,
    isDirty: config.isDirty,
    isValidating: config.isValidating,
    isTouched: config.isTouched,
    errors: config.errors
  });

  useEffect(() => {
    console.log('Register field', config.fieldPath);

    return () => {
      console.log('UN_register field', config.fieldPath);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useDeepCompareEffect(() => {
  //   if (shouldReinitialize) {
  //     initialSate
  //   }

  // }, [initialSate, shouldReinitialize]);

  const setStateOnError = (errors: ReadonlyArray<TError> | TError | undefined) => {
    const isCurrentValid = Array.isArray(errors) ? !errors.length : !errors;
    validationFieldState.setFieldState(prev => ({
      ...prev,
      isValidating: false,
      errors,
      isValid: isCurrentValid
    }));
  };

  const handleValidate = <TAddValue = undefined>(val: TValue, addVal?: TAddValue) => {
    if (isAsyncFunction(config.validator)) {
      validationFieldState.setFieldState(prev => ({ ...prev, isValidating: true }));
      (config.validator<TAddValue>(val, addVal) as Promise<ReadonlyArray<TError> | TError>)
        .then(setStateOnError)
        .catch(setStateOnError);
    } else {
      const syncedErrors = config.validator<TAddValue>(val, addVal);
      setStateOnError(syncedErrors as ReadonlyArray<TError> | TError);
    }
  };

  const setFieldValue = (val: TValue) => {
    validationFieldState.setCurrentFieldValue(val);

    const isCurrentDirty = !isEqual(validationFieldState.fieldState.initialValue, val);
    if (
      !validationFieldState.fieldState.isTouched ||
      validationFieldState.fieldState.isDirty !== isCurrentDirty
    ) {
      validationFieldState.setFieldState(prev => ({
        ...prev,
        isTouched: true,
        isDirty: isCurrentDirty
      }));
    }

    return {
      validate: <TAddValue = undefined>(data?: TAddValue) => handleValidate(val, data)
    };
  };

  console.log('useStatelessValidationField renderer');

  return {
    value: validationFieldState.value,
    fieldState: validationFieldState.fieldState,
    setInitialFieldState: validationFieldState.setInitialFieldState,
    setFieldState: validationFieldState.setCurrentFieldState,
    resetFieldState: validationFieldState.resetFieldState,
    setFieldValue
  };
}
