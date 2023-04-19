import lodash from 'lodash';
import { useRef, useState } from 'react';

import {
  ValidationFieldState,
  ValidationFieldStateManagerReturnType
} from '@/validator/hooks/validation-field-types';

export default function useValidationFieldState<TValue, TError = string>(
  initialSate: ValidationFieldState<TValue, TError>
): ValidationFieldStateManagerReturnType<TValue, TError> {
  const initialState = useRef<ValidationFieldState<TValue, TError>>(
    getInitialValidationFieldState<TValue, TError>(initialSate)
  );

  const [value, setCurrentFieldValue] = useState<TValue | undefined>(initialSate.initialValue);
  const [fieldState, setFieldState] = useState<ValidationFieldState<TValue, TError>>(
    getInitialValidationFieldState<TValue, TError>(initialSate)
  );

  const setInitialFieldState = (state: Partial<ValidationFieldState<TValue, TError>>) => {
    const generatedState = getInitialValidationFieldState<TValue, TError>(
      state,
      initialState.current
    );
    initialState.current = generatedState;

    setFieldState(generatedState);
    setCurrentFieldValue(state.initialValue);
  };

  const setCurrentFieldState = (
    state: Partial<Omit<ValidationFieldState<TValue, TError>, 'initialValue'>>
  ) => {
    setFieldState(prev => getInitialValidationFieldState<TValue, TError>(state, prev));
  };

  const resetFieldState = () => {
    setFieldState({ ...initialState.current });
    setCurrentFieldValue(initialState.current.initialValue);
  };

  return {
    value,
    fieldState,
    setCurrentFieldValue,
    setCurrentFieldState,
    setInitialFieldState,
    setFieldState,
    resetFieldState
  };
}

function getInitialValidationFieldState<TValue, TError>(
  state: Partial<ValidationFieldState<TValue, TError>>,
  prev?: Partial<ValidationFieldState<TValue, TError>>
): ValidationFieldState<TValue, TError> {
  if (prev) {
    return {
      initialValue: prev.initialValue as TValue,
      isValid: state.isValid !== undefined ? state.isValid : !!prev.isValid,
      isDirty: state.isDirty !== undefined ? state.isDirty : !!prev.isDirty,
      isValidating: state.isValidating !== undefined ? state.isValidating : !!prev.isValidating,
      isTouched: state.isTouched !== undefined ? state.isTouched : !!prev.isTouched,
      errors: lodash.has(state, 'errors') ? state.errors : prev.errors
    };
  }

  return {
    initialValue: state.initialValue as TValue,
    isValid: state.isValid !== undefined ? state.isValid : true,
    isDirty: !!state.isDirty,
    isValidating: !!state.isValidating,
    isTouched: !!state.isTouched,
    errors: state.errors
  };
}
