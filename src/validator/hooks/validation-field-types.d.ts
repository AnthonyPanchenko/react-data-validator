export type ValidationFieldMetaData<TError = string> = {
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isSkipped: boolean;
  errors: TError | undefined;
};

export type FormFieldValidationNode<TValue, TError = string> = {
  initialMetaData: ValidationFieldMetaData<TError>;
  arrayPath: ReadonlyArray<string | number>;
  fieldPath: string;
  hashKey: string;
  isValidating: boolean;
  subscribers: Set<() => void>;
  validator: (
    value: TValue | undefined,
    data: { [key in keyof TData]: TData[key] }
  ) => TError | Promise<TError>;
} & ValidationFieldMetaData<TError>;

export type PartialValidationFieldMetaData<TError = string> = {
  isValid?: boolean;
  isDirty?: boolean;
  isTouched?: boolean;
  isSkipped?: boolean;
  errors?: TError | undefined;
};

export type PartialFormFieldValidationNode<TValue, TError = string> = {
  value?: TValue | undefined;
  arrayPath: ReadonlyArray<string | number>;
  fieldPath: string;
  isValidating?: boolean;
  validator?: (
    value: TValue | undefined,
    data: { [key in keyof TData]: TData[key] }
  ) => TError | Promise<TError>;
} & PartialValidationFieldMetaData<TError>;

export type InitialValidationFieldData<TValue, TError = string> = {
  arrayPath: ReadonlyArray<string | number>;
  fieldPath: string;
  hashKey: string;
  initialValue?: TValue | undefined;
  subscribers: Set<() => void>;
  validator: (
    value: TValue | undefined,
    data: { [key in keyof TData]: TData[key] }
  ) => TError | Promise<TError>;
} & PartialValidationFieldMetaData<TError>;

// parentFieldPath: ReadonlyArray<string> | null;
// childrenFieldPath: ReadonlyArray<string> | null;
// hashValue: 'bhjacsuygqwf87q349',
// createHashKey: (hashValue, fieldPath) => string;
// extraData?: TExtraData;
