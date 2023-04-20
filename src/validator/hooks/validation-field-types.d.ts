export type ValidationFieldState<TValue, TError = string> = {
  initialValue: TValue;
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  isTouched: boolean;
  errors: ReadonlyArray<TError> | TError | undefined;
};

export type StatelessValidationFieldConfig<TValue, TError = string> = {
  fieldPath: string | number;
  // shouldReinitialize?: boolean;
  validator: <TAddValue = undefined>(
    value: TValue | undefined,
    addValue?: TAddValue
  ) => ReadonlyArray<TError> | TError | Promise<ReadonlyArray<TError> | TError> | undefined;
  subscribeOnFieldError?: () => void;
  subscribeOnFieldStateChange?: () => void;
} & ValidationFieldState<TValue, TError>;

export type ValidationFieldStateManagerReturnType<TValue, TError = string> = {
  value: TValue | undefined;
  fieldState: ValidationFieldState<TValue, TError>;
  setInitialFieldState: (initialState: Partial<ValidationFieldState<TValue, TError>>) => void;
  setFieldValue: React.Dispatch<React.SetStateAction<TValue | undefined>>;
  setFieldState: React.Dispatch<React.SetStateAction<ValidationFieldState<TValue, TError>>>;
  resetFieldState: () => void;
};
