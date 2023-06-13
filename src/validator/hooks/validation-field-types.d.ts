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

export type ValidationFieldMetaData<TError = string> = {
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  errors: TError | undefined;
};

export type PartialValidationFieldMetaData<TError = string> = {
  isValid?: boolean;
  isDirty?: boolean;
  isTouched?: boolean;
  errors?: TError | undefined;
};

type BaseValidationFieldDataType<TValue, TError = string> = {
  fieldPath: ReadonlyArray<string | number>;
  isSkipped: boolean;
  validator: (
    value: TValue,
    data: { [key in keyof TData]: TData[key] }
  ) => TError | Promise<TError>;
};

export type InitialValidationFieldDataType<TValue, TError = string> = {
  initialValue: TValue | undefined;
  initialMetaData: ValidationFieldMetaData<TError>;
} & BaseValidationFieldDataType<TValue, TError>;

export type FormValidatorValidationNode<TValue, TError = string> = {
  initialValue: TValue;
  metaData: ValidationFieldMetaData<TError>;
  initialMetaData: ValidationFieldMetaData<TError>;
  isValidating: boolean;
  // parentFieldPath: ReadonlyArray<string> | null;
  // childrenFieldPath: ReadonlyArray<string> | null;
  // hashValue: 'bhjacsuygqwf87q349',
  // createHashKey: (hashValue, fieldPath) => string;
  // extraData?: TExtraData;
} & BaseValidationFieldDataType<TValue, TError>;

export type ValidationFieldDataType<TValue, TError = string> = {
  fieldPath: ReadonlyArray<string | number>;
  value?: TValue;
  metaData?: PartialValidationFieldMetaData<TError>;
  isValidating?: boolean;
  isSkipped?: boolean;
  validator?: (
    value: TValue,
    data: { [key in keyof TData]: TData[key] }
  ) => TError | Promise<TError>;
};

export type FormValidatorValidationNodes = {
  [key: string | number]:
    | FormValidatorValidationNode<unknown, unknown>
    | Array<FormValidatorValidationNode<unknown, unknown>>
    | FormValidatorValidationNodes;
};
