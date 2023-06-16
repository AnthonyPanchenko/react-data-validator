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
  FormFieldValidationNode,
  FormFieldValidationNodes,
  InitialValidationFieldData,
  PartialFormFieldValidationNode,
  PartialValidationFieldMetaData
} from '@/validator/hooks/validation-field-types';
import {
  formFiledValueSelector,
  hasOwnProperty,
  isObject,
  setValueWith,
  traverseValidationData
} from '@/validator/utils';

type FormValidatorState = {
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
};

type FormValidatorProps<TData extends { [key in keyof TData]: TData[key] }> = {
  initialData: TData;
  onSubmit: (data: TData) => void;
};

type FormValidatorReturnType<TData extends { [key in keyof TData]: TData[key] }> = {
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  subscribe: (onStoreChange: () => void) => () => boolean;
  validateForm: (data: TData) => void;
  validateField: (fieldPath: ReadonlyArray<string | number>) => void;
  deleteValidationField: (fieldPath: ReadonlyArray<string | number>) => void;
  setFieldData: <TValue, TError = string>(
    field: PartialFormFieldValidationNode<TValue, TError>
  ) => void;
  setFieldInitialData: <TValue, TError = string>(
    field: InitialValidationFieldData<TValue, TError>
  ) => void;
  resetForm: () => void;
  addArrayFieldItem: (fieldPath: ReadonlyArray<string | number>, item: TData[keyof TData]) => void;
  deleteArrayFieldItem: (fieldPath: ReadonlyArray<string | number>, index: number) => void;
  getCurrentData: () => TData;
  getValidationData: () => FormFieldValidationNodes<unknown, unknown>;
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
    const validationData = useRef<FormFieldValidationNodes<unknown, unknown>>({});

    const subscribers = useRef(new Set<() => void>());

    const getCurrentData = useCallback(() => currentData.current, []);
    const getValidationData = useCallback(() => validationData.current, []);

    // divide
    const setFieldData = useCallback(
      <TValue, TError = string>(field: PartialFormFieldValidationNode<TValue, TError>) => {
        if (Object.hasOwn(field, 'value')) {
          setValueWith<TData>({
            data: currentData.current,
            path: field.fieldPath,
            value: field.value as TData[keyof TData]
          });
          currentData.current = Object.assign({}, currentData.current);
        }

        setValueWith<FormFieldValidationNodes<TValue, TError>>({
          data: validationData.current,
          path: field.fieldPath,
          valueCustomizer: node => Object.assign({}, node, field) as TData[keyof TData]
        });
        validationData.current = Object.assign({}, validationData.current);

        console.log('validationData.current: ', validationData.current);

        console.log('subscribers.current: ', subscribers.current);

        for (const onStoreChange of subscribers.current) {
          onStoreChange();
        }
      },
      []
    );

    const addArrayFieldItem = useCallback(
      (fieldPath: ReadonlyArray<string | number>, item: never) => {
        setValueWith<TData>({
          data: currentData.current,
          path: fieldPath,
          valueCustomizer: arr =>
            (Array.isArray(arr) ? [...arr, item] : [item]) as TData[keyof TData]
        });
        currentData.current = Object.assign({}, currentData.current);

        for (const onStoreChange of subscribers.current) {
          onStoreChange();
        }
      },
      []
    );

    const deleteArrayFieldItem = useCallback(
      (fieldPath: ReadonlyArray<string | number>, index: number) => {
        setValueWith<TData>({
          data: currentData.current,
          path: fieldPath,
          valueCustomizer: arr =>
            (Array.isArray(arr)
              ? (arr as Array<TData[keyof TData]>).filter((_, i) => i !== index)
              : arr) as TData[keyof TData]
        });
        currentData.current = Object.assign({}, currentData.current);

        setValueWith({
          data: validationData.current,
          path: fieldPath,
          valueCustomizer: arr =>
            (Array.isArray(arr)
              ? (arr as Array<TData[keyof TData]>).filter((_, i) => i !== index)
              : arr) as TData[keyof TData]
        });
        validationData.current = Object.assign({}, validationData.current);

        for (const onStoreChange of subscribers.current) {
          onStoreChange();
        }
      },
      []
    );

    // only for useSyncExternalStore
    const subscribe = useCallback((onStoreChange: () => void) => {
      subscribers.current.add(onStoreChange);
      return () => subscribers.current.delete(onStoreChange);
    }, []);

    const handleValidationResult = useCallback(
      <TValue, TError = string>(node: FormFieldValidationNode<TValue, TError>, errors: TError) => {
        console.log(errors, node);
        // mutation
        node.isValidating = false;
        node.isValid = !errors;
        node.errors = errors;

        validationData.current = Object.assign({}, validationData.current);
      },
      []
    );

    // validate particular field
    const validateField = useCallback(
      <TValue, TError = string>(fieldPath: ReadonlyArray<string | number>) => {
        setValueWith<FormFieldValidationNodes<TValue, TError>>({
          data: validationData.current,
          path: fieldPath,
          valueCustomizer: node => {
            // mutation
            node.isValidating = true;

            // (value, data) => async func(...args)
            // (value, data) => func(...args)
            // (value, data) => new Promise();
            Promise.resolve(node.validator(node.value, currentData.current))
              .then(errors => handleValidationResult<TValue, TError>(node, errors)) // if resolve
              .catch(errors => handleValidationResult<TValue, TError>(node, errors)); // if reject
          }
        });
        validationData.current = Object.assign({}, validationData.current);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const validateForm = useCallback(() => {
      setFormState(prev => ({
        isValid: prev.isValid,
        isDirty: prev.isDirty,
        isValidating: true
      }));

      const validationPromises: Array<Promise<unknown>> = [];

      traverseValidationData(
        validationData.current,
        (node: FormFieldValidationNode<unknown, unknown>) => {
          // set errors to the particular field
          if (typeof node.validator === 'function') {
            validationPromises.push(
              Promise.resolve(node.validator(node.value, validationData.current))
            );
          }
        }
      );

      Promise.allSettled(validationPromises).then(results => {
        console.log(results);
        setFormState(prev => ({
          isValid: prev.isValid,
          isDirty: prev.isDirty,
          isValidating: false
        }));
      });
    }, []);

    // delete field from validation validationData only
    const deleteValidationField = useCallback((fieldPath: ReadonlyArray<string | number>) => {
      console.log('deleteValidationField: ', fieldPath);
    }, []);

    // add / update field with initial data -> validationData
    const setFieldInitialData = useCallback(
      <TValue, TError = string>(field: InitialValidationFieldData<TValue, TError>) => {
        setValueWith<FormFieldValidationNodes<TValue, TError>>({
          data: validationData.current,
          path: field.fieldPath,
          valueCustomizer: currentNode => {
            const node = (currentNode ?? {}) as FormFieldValidationNode<TValue, TError>;

            const isValid = field.isValid !== undefined ? field.isValid : !node.isValid;
            const isDirty = field.isDirty !== undefined ? field.isDirty : !!node.isDirty;
            const isTouched = field.isTouched !== undefined ? field.isTouched : !!node.isTouched;
            const isSkipped = field.isSkipped !== undefined ? field.isSkipped : !!node.isSkipped;
            const errors = Object.hasOwn(field, 'errors') ? field.errors : node.errors;

            let initialValue: TValue | undefined = undefined;

            if (Object.hasOwn(field, 'initialValue')) {
              initialValue = field.initialValue;
            } else if (hasOwnProperty(node, 'initialValue')) {
              initialValue = node.initialValue;
            } else {
              initialValue = formFiledValueSelector<TValue | undefined, TData>(
                props.initialData,
                field.fieldPath,
                undefined
              );
            }

            const initialNode: FormFieldValidationNode<TValue | undefined, TError> = {
              value: (Array.isArray(initialValue)
                ? [...initialValue]
                : isObject(initialValue)
                ? Object.assign({}, initialValue)
                : initialValue) as TValue | undefined,
              initialValue,
              initialMetaData: {
                isValid,
                isDirty,
                isTouched,
                isSkipped,
                errors
              },
              isValid,
              isDirty,
              isTouched,
              isSkipped,
              isValidating: false,
              errors: (Array.isArray(errors)
                ? [...errors]
                : isObject(errors)
                ? Object.assign({}, errors)
                : errors) as TError | undefined,
              fieldPath: field.fieldPath,
              validator: field.validator
            };

            return initialNode;
          }
        });

        validationData.current = Object.assign({}, validationData.current);

        for (const onStoreChange of subscribers.current) {
          onStoreChange();
        }

        console.log('setFieldInitialData', field, validationData.current);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      addArrayFieldItem,
      deleteArrayFieldItem,
      deleteValidationField,
      setFieldInitialData
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

  type FormFieldArrayReturnType<TArrayItem> = {
    fieldPath: ReadonlyArray<string | number>;
    entries: ReadonlyArray<TArrayItem>;
    addField: (item: TArrayItem) => void;
    deleteField: (index: number) => void;
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
      formValidator.addArrayFieldItem(config.fieldPath, item as TData[keyof TData]);

      console.log('addField item: ', item);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const deleteField = (indexes: Array<number>) => void
    const deleteField = useCallback((index: number) => {
      formValidator.deleteArrayFieldItem(config.fieldPath, index);
      console.log('deleteField: ', index);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log('FieldArray render analyzer:', config.fieldPath);

    return {
      fieldPath: config.fieldPath,
      entries,
      addField,
      deleteField
    };
  }

  // ========================================= FormFieldArray ===================================

  type FormFieldArrayType<TValue> = {
    children: (
      entries: ReadonlyArray<TValue>,
      addField: (item: TValue) => void,
      deleteField: (index: number) => void
    ) => JSX.Element;
  } & FormFieldArrayConfig;

  function FormFieldArray<TValue>({ children, ...rest }: FormFieldArrayType<TValue>): JSX.Element {
    const field = useFormFieldArray<TValue>(rest);

    console.log('FormFieldArray: ', field);

    return children(field.entries, field.addField, field.deleteField);
  }

  // ========================================= useFormFieldError ===================================

  type FieldErrorConfig = {
    fieldPath: ReadonlyArray<string | number>;
  };

  function useFormFieldError<TError>(config: FieldErrorConfig): TError | undefined {
    const formValidator = useContext(FormValidatorContext);

    const data = useSyncExternalStore(
      formValidator.subscribe,
      () => formValidator.getCurrentData(),
      () => formValidator.getCurrentData()
    );

    // eslint-disable-next-line @typescript-eslint/ban-types
    const currentValidationNode = formFiledValueSelector<
      FormFieldValidationNode<unknown, TError>,
      FormFieldValidationNodes<unknown, TError>
    >(data, config.fieldPath, {} as FormFieldValidationNode<unknown, TError>);

    console.log('FieldError render analyzer:', config.fieldPath);

    return currentValidationNode.errors;
  }

  // ========================================= FormFieldError ===================================

  type FormFieldErrorType = {
    children: JSX.Element;
    fieldPath: ReadonlyArray<string | number>;
  };

  function FormFieldError<TError = string>({ children, ...rest }: FormFieldErrorType): JSX.Element {
    const field = useFormFieldError<TError>(rest);

    console.log('>>>>>> FormFieldError: ', field);

    return children;
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
    setFieldValue: (value: TValue, shouldValidate?: boolean) => void;
    validateField: () => void;
  };

  function useFormFieldValidator<TValue, TError = string>(
    config: FormFieldValidatorConfig<TValue, TError>
  ): FormFieldValidatorReturnType<TValue, TError> {
    const formValidator = useContext(FormValidatorContext);
    const shouldValidateField = useRef<boolean>(true);

    const formFieldValueSelector = useCallback(
      () =>
        formFiledValueSelector<
          FormFieldValidationNode<TValue, TError> | undefined,
          FormFieldValidationNodes<TValue, TError>
        >(formValidator.getValidationData(), config.fieldPath, undefined),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const currentValidationNode = useSyncExternalStore(
      formValidator.subscribe,
      formFieldValueSelector,
      formFieldValueSelector
    );

    useEffect(() => {
      const initNodeData = {
        isValid: config.isValid,
        isDirty: config.isDirty,
        isTouched: config.isTouched,
        isSkipped: config.isSkipped,
        errors: config.errors,
        fieldPath: config.fieldPath,
        validator: config.validator
      };

      if (Object.hasOwn(config, 'initialValue')) {
        (initNodeData as unknown as { initialValue: TValue | undefined }).initialValue =
          config.initialValue;
      }

      formValidator.setFieldInitialData(initNodeData);

      return () => {
        formValidator.deleteValidationField(config.fieldPath);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (currentValidationNode && currentValidationNode.isTouched) {
        const isCurrentDirty = !dequal(
          currentValidationNode.value,
          currentValidationNode.initialValue
        );

        if (isCurrentDirty !== currentValidationNode.isDirty) {
          formValidator.setFieldData<TValue>({
            fieldPath: config.fieldPath,
            isDirty: isCurrentDirty
          });
        }

        if (shouldValidateField.current) {
          formValidator.validateField(config.fieldPath);
          console.log('isCurrentDirty', isCurrentDirty);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValidationNode?.value]);

    // const resetField = () => {
    //   console.log('resetField: ', config.fieldPath);
    // };

    const setFieldValue = (value: TValue, shouldValidate = true) => {
      shouldValidateField.current = shouldValidate;
      //  use mutation
      formValidator.setFieldData<TValue>({
        fieldPath: config.fieldPath,
        isTouched: true,
        value
      });
      console.log('setFieldValue: ', config.fieldPath, value);
    };

    const validateField = () => {
      formValidator.validateField(config.fieldPath);
    };

    console.log('FieldValidator render analyzer:', config.fieldPath);

    const vNode = currentValidationNode ?? ({} as FormFieldValidationNode<TValue, TError>);

    return {
      value: vNode.value,
      fieldPath: config.fieldPath,
      isValid: !!vNode.isValid,
      isDirty: !!vNode.isDirty,
      isValidating: !!vNode.isValidating,
      isTouched: !!vNode.isTouched,
      isSkipped: !!vNode.isSkipped,
      errors: vNode.errors,
      setFieldValue,
      validateField
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

  // =========================================

  return {
    useFormValidator,
    useFormFieldArray,
    useFormFieldError,
    useFormFieldValidator,
    FormValidatorContext,
    FormValidatorProvider,
    FormFieldValidator,
    FormFieldArray,
    FormFieldError
  };
}
