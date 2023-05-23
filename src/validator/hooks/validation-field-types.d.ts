export type ValidationFieldMetaState<TError = string> = {
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  isTouched: boolean;
  errors: ReadonlyArray<TError> | TError | undefined;
};

export type StatelessValidationFieldConfig<TValue, TError = string> = {
  fieldPath: string | number;
  initialValue: TValue;
  // shouldReinitialize?: boolean;
  validator: <TAddValue = undefined>(
    value: TValue | undefined,
    addValue?: TAddValue
  ) => ReadonlyArray<TError> | TError | Promise<ReadonlyArray<TError> | TError> | undefined;
  subscribeOnFieldError?: () => void;
  subscribeOnFieldStateChange?: () => void;
} & ValidationFieldMetaState<TError>;

export type ValidationFieldStateManagerReturnType<TValue, TError = string> = {
  value: TValue | undefined;
  initialValue: TValue | undefined;
  fieldState: ValidationFieldMetaState<TError>;
  setInitialFieldState: (initialState: Partial<ValidationFieldMetaState<TError>>) => void;
  setFieldValue: React.Dispatch<React.SetStateAction<TValue | undefined>>;
  setFieldState: React.Dispatch<React.SetStateAction<ValidationFieldMetaState<TError>>>;
  resetFieldState: () => void;
};
