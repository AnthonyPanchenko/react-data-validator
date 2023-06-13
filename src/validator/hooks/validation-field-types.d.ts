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
