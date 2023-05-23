import lodash from 'lodash';
import { useRef, useState } from 'react';

import {
  ValidationFieldMetaState,
  ValidationFieldStateManagerReturnType
} from '@/validator/hooks/validation-field-types';

export default function useValidationFieldState<TValue, TError = string>(
  initialSate: ValidationFieldMetaState<TError> & { initialValue: TValue }
): ValidationFieldStateManagerReturnType<TValue, TError> {
  const initialState = useRef<ValidationFieldMetaState<TError>>(initialSate);
  const initialValue = useRef<TValue | undefined>(initialSate.initialValue);

  const [value, setFieldValue] = useState<TValue | undefined>(initialSate.initialValue);
  const [fieldState, setFieldState] = useState<ValidationFieldMetaState<TError>>(initialSate);

  const setInitialFieldState = (
    state: Partial<ValidationFieldMetaState<TError> & { initialValue: TValue }>
  ) => {
    const generatedState = {
      isValid: state.isValid !== undefined ? state.isValid : !!initialState.current.isValid,
      isDirty: state.isDirty !== undefined ? state.isDirty : !!initialState.current.isDirty,
      isValidating:
        state.isValidating !== undefined ? state.isValidating : !!initialState.current.isValidating,
      isTouched: state.isTouched !== undefined ? state.isTouched : !!initialState.current.isTouched,
      errors: lodash.has(state, 'errors') ? state.errors : initialState.current.errors
    };

    initialState.current = generatedState;
    setFieldState(generatedState);

    if (lodash.has(state, 'initialValue')) {
      initialValue.current = state.initialValue;
      setFieldValue(state.initialValue);
    }
  };

  const resetFieldState = () => {
    setFieldState({ ...initialState.current });
    setFieldValue(initialValue.current);
  };

  return {
    value,
    initialValue: initialValue.current,
    fieldState,
    setFieldValue,
    setInitialFieldState,
    setFieldState,
    resetFieldState
  };
}
