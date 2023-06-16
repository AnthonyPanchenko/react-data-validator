export type ValidationFieldMetaData<TError = string> = {
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isSkipped: boolean;
  errors: TError | undefined;
};

export type FormFieldValidationNode<TValue, TError = string> = {
  initialValue: TValue | undefined;
  initialMetaData: ValidationFieldMetaData<TError>;
  fieldPath: ReadonlyArray<string | number>;
  isValidating: boolean;
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
  fieldPath: ReadonlyArray<string | number>;
  isValidating?: boolean;
  validator?: (
    value: TValue | undefined,
    data: { [key in keyof TData]: TData[key] }
  ) => TError | Promise<TError>;
} & PartialValidationFieldMetaData<TError>;

export type InitialValidationFieldData<TValue, TError = string> = {
  fieldPath: ReadonlyArray<string | number>;
  initialValue?: TValue | undefined;
  validator: (
    value: TValue | undefined,
    data: { [key in keyof TData]: TData[key] }
  ) => TError | Promise<TError>;
} & PartialValidationFieldMetaData<TError>;

export type FormFieldValidationNodes<TValue, TError = string> = {
  [key: string | number]:
    | FormFieldValidationNode<TValue, TError>
    | Array<FormFieldValidationNode<TValue, TError>>
    | FormFieldValidationNodes;
};

// parentFieldPath: ReadonlyArray<string> | null;
// childrenFieldPath: ReadonlyArray<string> | null;
// hashValue: 'bhjacsuygqwf87q349',
// createHashKey: (hashValue, fieldPath) => string;
// extraData?: TExtraData;
