import { useEffect } from 'react';

import {
  StatelessValidationFieldConfig,
  ValidationFieldMetaState,
  ValidationFieldStateManagerReturnType
} from '@/validator/hooks/validation-field-types';
import { isAsyncFunction } from '@/validator/utils';

type StatelessValidationFieldReturnType<TValue, TError = string> = {
  value: TValue | undefined;
  fieldState: ValidationFieldMetaState<TError>;
  setInitialFieldState: (initialState: Partial<ValidationFieldMetaState<TError>>) => void;
  setFieldState: React.Dispatch<React.SetStateAction<ValidationFieldMetaState<TError>>>;
  setFieldValue: (value: TValue) => {
    validate: <TAddValue = undefined>(value?: TAddValue) => void;
  };
  resetFieldState: () => void;
};

export default function useStatelessValidationField<TValue, TError = string>(
  useStateManager: (
    initialSate: ValidationFieldMetaState<TError> & { initialValue: TValue }
  ) => ValidationFieldStateManagerReturnType<TValue, TError>,
  config: StatelessValidationFieldConfig<TValue, TError> & { initialValue: TValue }
): StatelessValidationFieldReturnType<TValue, TError> {
  const validationFieldState = useStateManager({
    initialValue: config.initialValue as TValue,
    isValid: config.isValid !== undefined ? config.isValid : true,
    isDirty: !!config.isDirty,
    isValidating: !!config.isValidating,
    isTouched: !!config.isTouched,
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
    validationFieldState.setFieldValue(val);

    // const isCurrentDirty = !isEqual(validationFieldState.initialValue, val);
    if (!validationFieldState.fieldState.isTouched) {
      validationFieldState.setFieldState(prev => ({
        ...prev,
        isTouched: true,
        isDirty: true
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
    setFieldState: validationFieldState.setFieldState,
    resetFieldState: validationFieldState.resetFieldState,
    setFieldValue
  };
}
