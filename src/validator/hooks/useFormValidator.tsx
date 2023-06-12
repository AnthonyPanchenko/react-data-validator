import { useCallback, useRef, useState } from 'react';

import {
  FormValidatorValidationNode,
  FormValidatorValidationNodes,
  InitialValidationFieldDataType,
  PartialValidationFieldMetaData,
  ValidationFieldDataType,
  ValidationFieldMetaData
} from '@/validator/hooks/validation-field-types';
import { formFiledValueSelector, traverseValidationData } from '@/validator/utils';

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
  validateField: (fieldPath: ReadonlyArray<string>) => void;
  deleteValidationField: (fieldPath: ReadonlyArray<string>) => void;
  setFieldData: <TValue, TError = string>(field: ValidationFieldDataType<TValue, TError>) => void;
  initializeValidationField: <TValue, TError = string>(
    field: InitialValidationFieldDataType<TValue, TError>
  ) => void;
  resetForm: () => void;
  getFormData: () => {
    validationData: FormValidatorValidationNodes;
    currentData: TData;
  };
};

export default function useFormValidator<TData extends { [key in keyof TData]: TData[key] }>(
  props: FormValidatorProps<TData>
): FormValidatorReturnType<TData> {
  const [formState, setFormState] = useState<FormValidatorState>({
    isValid: true,
    isDirty: false,
    isValidating: false
  });

  const initialData = useRef<TData>(props.initialData);
  const currentData = useRef<TData>(props.initialData);
  const validationData = useRef<FormValidatorValidationNodes>({
    // fff: [
    //   node,
    //   node,
    // ],
    // qwe: {
    //   node,
    //   rty: {
    //     aaa: node,
    //     asd: [node, node, node]
    //   }
    // }
  });

  const subscribers = useRef(new Set<() => void>());

  const getFormData = useCallback(() => {
    return {
      validationData: validationData.current,
      currentData: currentData.current
    };
  }, []);

  const setFieldData = useCallback(
    <TValue, TError = string>(field: ValidationFieldDataType<TValue, TError>) => {
      console.log('setFieldData', field, validationData.current);
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
          formFiledValueSelector(currentData.current, node.fieldPath, undefined),
          currentData.current
        );
      }
    );
    console.log('validateForm', formState);
  }, [formState]);

  // validate particular field
  const validateField = useCallback((fieldPath: ReadonlyArray<string>) => {
    console.log('validateField: ', fieldPath);
  }, []);

  // delete field from validation validationData only
  const deleteValidationField = useCallback((fieldPath: ReadonlyArray<string>) => {
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
    getFormData,
    setFieldData,
    deleteValidationField,
    initializeValidationField
  };
}

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

/*
  const setInitialFieldData = <TValue, TError = string>(
    fieldPath: ReadonlyArray<string>,
    metaData: PartialValidationFieldMetaData<TError> & { initialValue?: TValue }
  ) => {
    setValueWith({
      data: currentData.current,
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
    fieldPath: ReadonlyArray<string>,
    metaData: PartialValidationFieldMetaData<TError> & { initialValue?: TValue }
  ) => {
    setValueWith({
      data: currentData.current,
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

  const setStateOnError = <TError = string>(fieldPath: ReadonlyArray<string>, errors: TError) => {
    const isCurrentValid = Array.isArray(errors) ? !errors.length : !errors;
    setValueWith({data: currentData.current, path: [...fieldPath, 'metaData'], valueCustomizer: (node) => {
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

  const setData = useCallback(
    (data: FormValidatorValidationNode<unknown, unknown>, fieldPath: ReadonlyArray<string>) => {
      validationData.current[fieldPath] = data;
      validationData.current = lodash.set(currentData.current, fieldPath, value);
      for (const onStoreChange of subscribers.current) {
        onStoreChange();
      }
    },
    []
  );
    */
