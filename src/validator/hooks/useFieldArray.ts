import { useRef, useState } from 'react';
import isEqual from 'react-fast-compare';

import { isAsyncFunction } from '@/validator/utils';

type ValidationFieldMeta<TError = string> = {
  parentId?: string | number | undefined;
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  isTouched: boolean;
  errors: ReadonlyArray<TError> | TError | undefined;
};

type ValidationFieldState<TValue, TError = string> = {
  fieldId: string | number;
  initialValue: TValue;
} & ValidationFieldMeta<TError>;

type ValidationField<TValue, TError = string> = {
  validator: <TAddValue = undefined>(
    value: TValue | undefined,
    addValue?: TAddValue
  ) => ReadonlyArray<TError> | TError | Promise<ReadonlyArray<TError> | TError> | undefined;
} & ValidationFieldState<TValue, TError>;

type ValidationFieldReturnType<TValue, TError = string> = {
  value: TValue | undefined;
  metaData: ValidationFieldState<TValue, TError>;
  setInitialFieldState: (initialState: Partial<ValidationFieldState<TValue, TError>>) => void;
  setFieldState: (newState: Partial<ValidationFieldMeta<TError>>) => void;
  setFieldValue: (value: TValue) => {
    validate: <TAddValue = undefined>(value?: TAddValue) => void;
  };
  resetFieldState: () => void;
};

export default function useFieldArray<TValue, TError = string>(
  config: ValidationField<TValue, TError>
): ValidationFieldReturnType<TValue, TError> {
  const initialState = useRef<ValidationFieldState<TValue, TError>>(
    getInitialValidationFieldState<TValue, TError>(config)
  );

  const [currentState, setCurrentState] = useState<ValidationFieldState<TValue, TError>>(
    getInitialValidationFieldState<TValue, TError>(config)
  );

  const [value, setCurrentValue] = useState<TValue | undefined>(config.initialValue);

  const setStateOnError = (errors: ReadonlyArray<TError> | TError | undefined) => {
    const isCurrentValid = Array.isArray(errors) ? !errors.length : !errors;
    setCurrentState(prev => ({ ...prev, isValidating: false, errors, isValid: isCurrentValid }));
  };

  const handleValidate = <TAddValue = undefined>(val: TValue, addVal?: TAddValue) => {
    if (isAsyncFunction(config.validator)) {
      setCurrentState(prev => ({ ...prev, isValidating: true }));
      (config.validator<TAddValue>(val, addVal) as Promise<ReadonlyArray<TError> | TError>)
        .then(setStateOnError)
        .catch(setStateOnError);
    } else {
      const syncedErrors = config.validator<TAddValue>(val, addVal);
      setStateOnError(syncedErrors as ReadonlyArray<TError> | TError);
    }
  };

  const setInitialFieldState = (s: Partial<ValidationFieldState<TValue, TError>>) => {
    const state = getInitialValidationFieldState<TValue, TError>(s);
    initialState.current = state;
    setCurrentState(state);
    setCurrentValue(state.initialValue);
  };

  const setFieldState = (s: Partial<ValidationFieldMeta<TError>>) => {
    setCurrentState(prev => ({
      fieldId: prev.fieldId,
      parentId: prev.parentId,
      initialValue: prev.initialValue,
      isValid: s.isValid !== undefined ? s.isValid : prev.isValid,
      isDirty: s.isDirty !== undefined ? s.isDirty : prev.isDirty,
      isValidating: s.isValidating !== undefined ? s.isValidating : prev.isValidating,
      isTouched: s.isTouched !== undefined ? s.isTouched : prev.isTouched,
      errors: 'errors' in s ? s.errors : prev.errors
    }));
  };

  const resetFieldState = () => {
    setCurrentState({ ...initialState.current });
  };

  const setFieldValue = (val: TValue) => {
    setCurrentValue(val);

    const isCurrentDirty = !isEqual(initialState.current.initialValue, val);
    if (!currentState.isTouched || currentState.isDirty !== isCurrentDirty) {
      setCurrentState(prev => ({ ...prev, isTouched: true, isDirty: isCurrentDirty }));
    }

    return {
      validate: <TAddValue = undefined>(data?: TAddValue) => handleValidate(val, data)
    };
  };

  return {
    value,
    metaData: currentState,
    setInitialFieldState,
    setFieldValue,
    setFieldState,
    resetFieldState
  };
}

function getInitialValidationFieldState<TValue, TError>(
  data: Partial<ValidationFieldState<TValue, TError>>
): ValidationFieldState<TValue, TError> {
  return {
    fieldId: data.fieldId !== undefined ? data.fieldId : '',
    parentId: data.parentId,
    isValid: data.isValid !== undefined ? data.isValid : true,
    isDirty: !!data.isDirty,
    isValidating: !!data.isValidating,
    isTouched: !!data.isTouched,
    initialValue: data.initialValue as TValue,
    errors: data.errors
  };
}
