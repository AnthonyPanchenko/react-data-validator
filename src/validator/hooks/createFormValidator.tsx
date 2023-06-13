import { dequal } from 'dequal';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';

import {
  FormValidatorValidationNode,
  FormValidatorValidationNodes,
  InitialValidationFieldDataType,
  PartialValidationFieldMetaData,
  ValidationFieldDataType,
  ValidationFieldMetaData
} from '@/validator/hooks/validation-field-types';
import { formFiledValueSelector, setValueWith, traverseValidationData } from '@/validator/utils';

type FormValidatorState = {
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
};

type FormValidatorProps<TData extends { [key in keyof TData]: TData[key] }> = {
  initialData: TData;
  onSubmit: (data: TData) => void;
};

type FormFieldArrayReturnType<TArrayItem> = {
  fieldPath: ReadonlyArray<string | number>;
  entries: ReadonlyArray<TArrayItem>;
  addField: (item: TArrayItem) => void;
  deleteField: (index: number) => void;
};

type FieldErrorConfig = {
  fieldPath: ReadonlyArray<string | number>;
};

type FormFieldValidatorReturnType<TValue, TError = string> = {
  fieldPath: ReadonlyArray<string | number>;
  value: TValue | undefined;
  errors: TError | undefined;
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  isTouched: boolean;
  isSkipped: boolean;
  // resetField: () => void;
  setFieldValue: (value: TValue) => void;
  // validateField: () => void;
};

type FormValidatorReturnType<TData extends { [key in keyof TData]: TData[key] }> = {
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  subscribe: (onStoreChange: () => void) => () => boolean;
  validateForm: (data: TData) => void;
  validateField: (fieldPath: ReadonlyArray<string | number>) => void;
  deleteValidationField: (fieldPath: ReadonlyArray<string | number>) => void;
  setFieldData: <TValue, TError = string>(field: ValidationFieldDataType<TValue, TError>) => void;
  initializeValidationField: <TValue, TError = string>(
    field: InitialValidationFieldDataType<TValue, TError>
  ) => void;
  resetForm: () => void;
  getCurrentData: () => TData;
  getValidationData: () => FormValidatorValidationNodes;
};

export default function createFormValidator<TData extends { [key in keyof TData]: TData[key] }>() {
  function useFormValidator(props: FormValidatorProps<TData>) {
    const [formState, setFormState] = useState<FormValidatorState>({
      isValid: true,
      isDirty: false,
      isValidating: false
    });

    const initialData = useRef<TData>(props.initialData);
    const currentData = useRef<TData>(props.initialData);
    const validationData = useRef<FormValidatorValidationNodes>({});

    const subscribers = useRef(new Set<() => void>());

    const getCurrentData = useCallback(() => currentData.current, []);
    const getValidationData = useCallback(() => validationData.current, []);

    const setFieldData = useCallback(
      <TValue, TError = string>(field: ValidationFieldDataType<TValue, TError>) => {
        setValueWith<TData>({
          data: currentData.current,
          path: field.fieldPath,
          valueCustomizer: n => {
            console.log('old value: ', n);
            return field.value as TData[keyof TData];
          }
        });

        currentData.current = Object.assign({}, currentData.current);

        console.log('subscribers.current: ', subscribers.current);

        for (const onStoreChange of subscribers.current) {
          onStoreChange();
        }

        console.log('setFieldData: ', field, validationData.current);
      },
      []
    );

    // only for useSyncExternalStore
    const subscribe = useCallback((onStoreChange: () => void) => {
      subscribers.current.add(onStoreChange);
      return () => subscribers.current.delete(onStoreChange);
    }, []);

    const validateForm = useCallback(() => {
      traverseValidationData(
        validationData.current,
        (node: FormValidatorValidationNode<unknown, unknown>) => {
          node.validator(
            formFiledValueSelector(validationData.current, node.fieldPath, undefined),
            validationData.current
          );
        }
      );
      console.log('validateForm', formState);
    }, [formState]);

    // validate particular field
    const validateField = useCallback((fieldPath: ReadonlyArray<string | number>) => {
      console.log('validateField: ', fieldPath);
    }, []);

    // delete field from validation validationData only
    const deleteValidationField = useCallback((fieldPath: ReadonlyArray<string | number>) => {
      console.log('deleteValidationField: ', fieldPath);
    }, []);

    // add / update field with initial data -> in validationData
    const initializeValidationField = useCallback(
      <TValue, TError = string>(field: InitialValidationFieldDataType<TValue, TError>) => {
        console.log('initializeValidationField', field, validationData.current);
      },
      []
    );

    // back to initial values and meta data state
    const resetForm = useCallback(() => {
      console.log('resetForm');
    }, []);

    console.log('Form Validator render analyzer:', validationData.current, currentData.current);

    return {
      isValid: formState.isValid,
      isDirty: formState.isDirty,
      isValidating: formState.isValidating,
      subscribe,
      validateForm,
      resetForm,
      validateField,
      getCurrentData,
      getValidationData,
      setFieldData,
      deleteValidationField,
      initializeValidationField
    };
  }

  // ========================================= FormValidatorContext ===================================

  const FormValidatorContext = createContext<FormValidatorReturnType<TData>>(
    {} as FormValidatorReturnType<TData>
  );

  // ========================================= FormValidatorProvider ===================================

  function FormValidatorProvider({
    children,
    ...rest
  }: FormValidatorProps<TData> & {
    children: React.ReactNode | ReadonlyArray<React.ReactNode> | null | undefined;
  }): JSX.Element {
    return (
      <FormValidatorContext.Provider value={useFormValidator(rest)}>
        {children}
      </FormValidatorContext.Provider>
    );
  }

  // ========================================= useFormFieldArray ===================================

  type FormFieldArrayConfig = {
    fieldPath: ReadonlyArray<string | number>;
  };

  function useFormFieldArray<TArrayItem>(
    config: FormFieldArrayConfig
  ): FormFieldArrayReturnType<TArrayItem> {
    const formValidator = useContext(FormValidatorContext);

    const formFieldArraySelector = useCallback(
      () =>
        formFiledValueSelector<ReadonlyArray<TArrayItem>, TData>(
          formValidator.getCurrentData(),
          config.fieldPath,
          []
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const entries = useSyncExternalStore(
      formValidator.subscribe,
      formFieldArraySelector,
      formFieldArraySelector
    );

    // const addField = (item: TItem, beforeIndex?: number) => void
    const addField = useCallback((item: TArrayItem) => {
      console.log('addField item: ', item);
    }, []);

    // const deleteField = (item: TItem, beforeIndex?: number) => void
    const deleteField = useCallback((index: number) => {
      console.log('deleteField: ', index);
    }, []);

    console.log('FieldArray render analyzer:', config.fieldPath);

    return {
      fieldPath: config.fieldPath,
      entries,
      addField,
      deleteField
    };
  }

  type FormFieldArrayType<TValue> = {
    children: (entries: ReadonlyArray<TValue>) => JSX.Element;
  } & FormFieldArrayConfig;

  function FormFieldArray<TValue>({ children, ...rest }: FormFieldArrayType<TValue>): JSX.Element {
    const field = useFormFieldArray<TValue>(rest);

    console.log('FormFieldArray: ', field);

    return children(field.entries);
  }

  // ========================================= useFormFieldError ===================================

  function useFormFieldError<TError>(config: FieldErrorConfig): TError | undefined {
    const formValidator = useContext(FormValidatorContext);

    const data = useSyncExternalStore(
      formValidator.subscribe,
      () => formValidator.getCurrentData(),
      () => formValidator.getCurrentData()
    );

    // eslint-disable-next-line @typescript-eslint/ban-types
    const currentValidationNode = formFiledValueSelector<
      FormValidatorValidationNode<unknown, TError>,
      FormValidatorValidationNodes
    >(data, config.fieldPath, {
      metaData: {} as ValidationFieldMetaData<TError>
    } as FormValidatorValidationNode<unknown, TError>);

    console.log('FieldError render analyzer:', config.fieldPath);

    return currentValidationNode.metaData.errors;
  }

  // ========================================= useFormFieldValidator ===================================

  type FormFieldValidatorConfig<TValue, TError = string> = {
    fieldPath: ReadonlyArray<string | number>;
    initialValue?: TValue;
    isValid?: boolean;
    isDirty?: boolean;
    isValidating?: boolean;
    isTouched?: boolean;
    isSkipped?: boolean;
    errors?: TError;
    validator: (value: TValue | undefined, data: TData) => TError | Promise<TError> | undefined;
    // subscribeOnError?: () => void;
    // subscribeOnMetaChange?: () => void;
  };

  function useFormFieldValidator<TValue, TError = string>(
    config: FormFieldValidatorConfig<TValue, TError>
  ): FormFieldValidatorReturnType<TValue, TError> {
    const formValidator = useContext(FormValidatorContext);

    const formFieldValueSelector = useCallback(
      () =>
        formFiledValueSelector<TValue | undefined, TData>(
          formValidator.getCurrentData(),
          config.fieldPath,
          undefined
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const currentValue = useSyncExternalStore(
      formValidator.subscribe,
      formFieldValueSelector,
      formFieldValueSelector
    );

    const currentValidationNode: FormValidatorValidationNode<TValue, TError> | undefined =
      undefined;

    // const currentValidationNode = formFiledValueSelector<
    //   FormValidatorValidationNode<TValue, TError> | undefined,
    //   FormValidatorValidationNodes
    // >(data, config.fieldPath, undefined);

    useEffect(() => {
      formValidator.initializeValidationField({
        initialValue: config.initialValue,
        initialMetaData: {
          isValid: !!config.isValid,
          isDirty: !!config.isDirty,
          isTouched: !!config.isTouched,
          errors: config.errors
        },
        fieldPath: config.fieldPath,
        isSkipped: !!config.isSkipped,
        validator: config.validator
      });

      return () => {
        formValidator.deleteValidationField(config.fieldPath);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (currentValidationNode) {
        const isCurrentDirty = !dequal(currentValue, currentValidationNode);
        console.log('isCurrentDirty', isCurrentDirty);
        console.log('currentValue', currentValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue]);

    // const resetField = () => {
    //   console.log('resetField: ', config.fieldPath);
    // };

    const setFieldValue = (value: TValue) => {
      formValidator.setFieldData<TValue>({
        fieldPath: config.fieldPath,
        metaData: { isTouched: true },
        value
      });
      console.log('setFieldValue: ', config.fieldPath, value);
    };

    // const validateField = () => {
    //   if (currentValidationNode) {
    //     console.log('validateField: ', config.fieldPath);
    //     currentValidationNode.validator(currentValidationNode.value, {});
    //   }
    // };

    console.log('FieldValidator render analyzer:', config.fieldPath);

    const vNode =
      // currentValidationNode ??
      {
        metaData: {} as ValidationFieldMetaData<TError>
      } as FormValidatorValidationNode<unknown, TError>;

    return {
      value: currentValue,
      fieldPath: config.fieldPath,
      isValid: !!vNode.metaData.isValid,
      isDirty: !!vNode.metaData.isDirty,
      isValidating: !!vNode.isValidating,
      isTouched: !!vNode.metaData.isTouched,
      isSkipped: !!vNode.isSkipped,
      errors: vNode.metaData.errors,
      setFieldValue
    };
  }

  // ========================================= FormFieldValidator ===================================

  type FormFieldValidatorType<TValue, TError = string> = {
    children: (value: TValue | undefined, setValue: (value: TValue) => void) => JSX.Element;
    fieldPath: ReadonlyArray<string | number>;
    initialValue?: TValue;
    isSkipped?: boolean;
    validator: (value: TValue | undefined, data: TData) => TError | Promise<TError> | undefined;
  } & PartialValidationFieldMetaData<TError>;

  function FormFieldValidator<TValue, TError = string>({
    children,
    ...rest
  }: FormFieldValidatorType<TValue, TError>): JSX.Element {
    const field = useFormFieldValidator<TValue, TError>(rest);

    console.log('>>>>>> FormFieldValidator: ', field);

    return children(field.value, field.setFieldValue);
  }

  return {
    useFormValidator,
    useFormFieldArray,
    useFormFieldError,
    useFormFieldValidator,
    FormValidatorContext,
    FormValidatorProvider,
    FormFieldValidator,
    FormFieldArray
  };
}

/*
  function mergeMetaData<TError = string>(
    currentData: ValidationFieldMetaData<TError>,
    data: PartialValidationFieldMetaData<TError>
  ): ValidationFieldMetaData<TError> {
    return {
      isValid: data.isValid !== undefined ? data.isValid : !!currentData.isValid,
      isDirty: data.isDirty !== undefined ? data.isDirty : !!currentData.isDirty,
      isTouched: data.isTouched !== undefined ? data.isTouched : !!currentData.isTouched,
      errors: Object.prototype.hasOwnProperty.call(data, 'errors') ? data.errors : currentData.errors
    };
  }

    const setInitialFieldData = <TValue, TError = string>(
      fieldPath: ReadonlyArray<string | number>,
      metaData: PartialValidationFieldMetaData<TError> & { initialValue?: TValue }
    ) => {
      setValueWith({
        data: dataForm.current.currentData,
        path: fieldPath,
        valueCustomizer: node => {
          const mergedMetaData = mergeMetaData(node.metaData, metaData);
          return Object.prototype.hasOwnProperty.call(metaData, 'initialValue')
            ? {
                value: metaData.initialValue,
                initialValue: metaData.initialValue,
                metaData: mergedMetaData,
                initialMetaData: mergedMetaData
              }
            : {
                value: node.value,
                initialValue: node.initialValue,
                metaData: mergedMetaData,
                initialMetaData: mergedMetaData
              };
        }
      });
    };
  
    const setFieldValue = <TValue, TError = string>(
      fieldPath: ReadonlyArray<string | number>,
      metaData: PartialValidationFieldMetaData<TError> & { initialValue?: TValue }
    ) => {
      setValueWith({
        data: dataForm.current.currentData,
        path: fieldPath,
        valueCustomizer: node => {
          const mergedMetaData = mergeMetaData(node.metaData, metaData);
          return Object.prototype.hasOwnProperty.call(data, 'initialValue')
            ? {
                value: metaData.initialValue,
                initialValue: metaData.initialValue,
                metaData: mergedMetaData,
                initialMetaData: mergedMetaData
              }
            : {
                value: node.value,
                initialValue: node.initialValue,
                metaData: mergedMetaData,
                initialMetaData: mergedMetaData
              };
        }
      });
    };
  
    const setStateOnError = <TError = string>(fieldPath: ReadonlyArray<string | number>, errors: TError) => {
      const isCurrentValid = Array.isArray(errors) ? !errors.length : !errors;
      setValueWith({data: dataForm.current.currentData, path: [...fieldPath, 'metaData'], valueCustomizer: (node) => {
        return mergeMetaData(node, {
          errors,
          isValidating: false,
          isValid: isCurrentValid,
        });
      }});
    };
  
     const validateField = <TValue, TError = string, TAdditionalData = undefined>({
      value: TValue;
      validator: () =>
      additionalData?: TAdditionalData
    }) => {
      if (isAsyncFunction(config.validator)) {
        formValidator.setFieldState(prev => ({ ...prev, isValidating: true }));
  
        (config.validator(val, addVal) as Promise<ReadonlyArray<TError> | TError>)
          .then(setStateOnError)
          .catch(setStateOnError);
      } else {
        const syncedErrors = config.validator(val, addVal);
        setStateOnError(syncedErrors as ReadonlyArray<TError> | TError);
      }
    };
  
    if (
      !formValidator.fieldState.isTouched ||
      formValidator.fieldState.isDirty !== isCurrentDirty
    ) {
      formValidator.setFieldState(prev => ({
        ...prev,
        isTouched: true,
        isDirty: isCurrentDirty
      }));
    }
  
    return {
      validate: <TAdditionalData = undefined>(data?: TAdditionalData) => formValidator.validateField<TAdditionalData = undefined>(config.fieldPath, data)
    };
      */
