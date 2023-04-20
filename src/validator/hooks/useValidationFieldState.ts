import lodash from 'lodash';
import { useRef, useState } from 'react';

import {
  ValidationFieldState,
  ValidationFieldStateManagerReturnType
} from '@/validator/hooks/validation-field-types';

export default function useValidationFieldState<TValue, TError = string>(
  initialSate: ValidationFieldState<TValue, TError>
): ValidationFieldStateManagerReturnType<TValue, TError> {
  const initialState = useRef<ValidationFieldState<TValue, TError>>(initialSate);
  const [value, setFieldValue] = useState<TValue | undefined>(initialSate.initialValue);
  const [fieldState, setFieldState] = useState<ValidationFieldState<TValue, TError>>(initialSate);

  const setInitialFieldState = (state: Partial<ValidationFieldState<TValue, TError>>) => {
    const prev = { ...initialState.current };
    const generatedState = {
      initialValue: (lodash.has(state, 'initialValue')
        ? state.initialValue
        : prev.initialValue) as TValue,
      isValid: state.isValid !== undefined ? state.isValid : !!prev.isValid,
      isDirty: state.isDirty !== undefined ? state.isDirty : !!prev.isDirty,
      isValidating: state.isValidating !== undefined ? state.isValidating : !!prev.isValidating,
      isTouched: state.isTouched !== undefined ? state.isTouched : !!prev.isTouched,
      errors: lodash.has(state, 'errors') ? state.errors : prev.errors
    };

    initialState.current = generatedState;

    setFieldState(generatedState);
    setFieldValue(state.initialValue);
  };

  const resetFieldState = () => {
    setFieldState({ ...initialState.current });
    setFieldValue(initialState.current.initialValue);
  };

  return {
    value,
    fieldState,
    setFieldValue,
    setInitialFieldState,
    setFieldState,
    resetFieldState
  };
}
