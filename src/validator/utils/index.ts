import {
  FormFieldValidationNode,
  FormFieldValidationNodes
} from '@/validator/hooks/validation-field-types';

export function isObject<T>(obj: T | null | undefined) {
  return (
    obj && typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]'
  );
}

export function hasSomeOwnProperty<T extends { [key in keyof T]: T[key] }>(
  obj: T | null | undefined,
  props: Array<number | string>
) {
  return isObject(obj) ? props.some(p => Object.prototype.hasOwnProperty.call(obj, p)) : false;
}

export function hasOwnProperty<T extends { [key in keyof T]: T[key] }>(
  obj: T | null | undefined,
  prop: number | string
) {
  return isObject(obj) ? Object.prototype.hasOwnProperty.call(obj, prop) : false;
}

// ✅ Check if a function's return value is a Promise
export function isPromise(p: Promise<unknown> | null) {
  if (
    p !== null &&
    typeof p === 'object' &&
    typeof p.then === 'function' &&
    typeof p.catch === 'function'
  ) {
    return true;
  }

  // p instanceof Promise
  // p && Object.prototype.toString.call(p) === "[object Promise]";

  return false;
}

export function isAsyncFunction(f: unknown) {
  // f.constructor.name === 'Function'
  return typeof f === 'function' && f.constructor.name === 'AsyncFunction';
}

type SetValueWithType<TData extends { [key in keyof TData]: TData[key] }> = {
  data: TData;
  path: ReadonlyArray<string | number>;
  value?: TData[keyof TData];
  valueCustomizer?: (valueNode: TData[keyof TData]) => TData[keyof TData] | undefined;
  isIndexAsObjectKey?: boolean;
};

// 👇️ mutate data 👉️ that's why we need to use useRef hook
export function setValueWith<TData extends { [key in keyof TData]: TData[key] }>(
  cfg: SetValueWithType<TData>
) {
  let i = 0;
  const len = cfg.path.length - 1;

  for (; i < len; i++) {
    const pathPart: keyof TData = cfg.path[i] as keyof TData;
    const currentObj: TData[keyof TData] = cfg.data[pathPart];

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      cfg.data = cfg.data[pathPart];
    } else {
      const nextPathPart = Number(cfg.path[i + 1]);
      cfg.data = cfg.data[pathPart] = (
        !cfg.isIndexAsObjectKey && Number.isInteger(nextPathPart) && nextPathPart >= 0 ? [] : {}
      ) as TData[keyof TData];
    }
  }

  if (typeof cfg.valueCustomizer === 'function') {
    const newNode = cfg.valueCustomizer(cfg.data[cfg.path[i] as keyof TData]);
    if (newNode !== undefined) {
      cfg.data[cfg.path[i] as keyof TData] = newNode;
    }
  } else {
    cfg.data[cfg.path[i] as keyof TData] = cfg.value as TData[keyof TData];
  }
}

export function formFiledValueSelector<TValue, TData extends { [key in keyof TData]: TData[key] }>(
  obj: TData,
  path: ReadonlyArray<string | number>,
  defaultValue: TValue
): TValue {
  let i = 0;
  const len = path.length;

  while (obj && i < len) {
    obj = obj[path[i++] as keyof TData];
  }

  return i && i === len ? obj : defaultValue;
}

function handleValidationNode(
  node:
    | {
        [key: string | number]:
          | FormFieldValidationNode<unknown, unknown>
          | Array<FormFieldValidationNode<unknown, unknown>>;
      }
    | FormFieldValidationNode<unknown, unknown>
    | Array<FormFieldValidationNode<unknown, unknown>>,
  callback: (node: FormFieldValidationNode<unknown, unknown>) => void
) {
  if (
    hasOwnProperty(node, 'validator') &&
    typeof (node as FormFieldValidationNode<unknown, unknown>).validator === 'function'
  ) {
    callback(node as FormFieldValidationNode<unknown, unknown>);
  } else {
    traverseValidationData(node as FormFieldValidationNodes<unknown, unknown>, callback);
  }
}

export function traverseValidationData(
  obj: FormFieldValidationNodes<unknown, unknown>,
  callback: (node: FormFieldValidationNode<unknown, unknown>) => void
) {
  if (isObject(obj)) {
    for (const key of Object.keys(obj)) {
      handleValidationNode(
        obj[key] as
          | {
              [key: string | number]:
                | FormFieldValidationNode<unknown, unknown>
                | Array<FormFieldValidationNode<unknown, unknown>>;
            }
          | FormFieldValidationNode<unknown, unknown>
          | Array<FormFieldValidationNode<unknown, unknown>>,
        callback
      );
    }
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      handleValidationNode(item, callback);
    }
  }
}

// ⛔️

/*

function isBoolean(value: boolean | null | undefined) {
  return typeof value === 'boolean' || getStringType(value) === '[object Boolean]';
}

function isEmpty<T extends Array<T>>(arr: T | null | undefined) {
  if (!arr || arr === null || arr === undefined) {
    return true;
  }

  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  } else if (typeof arr !== 'string') {
    for (const v in arr) {
      if (hasOwnProperty(arr, v)) {
        return false;
      }
    }

    return true;
  }

  return false;
}

    | ((...args: Parameters<<T>(arg: T) => T>) => Promise<TReturnType>)
    | ((...args: Parameters<<T>(arg: T) => T>) => TReturnType)
    | ((...args: Parameters<<T>(arg: T) => T>) => void)
    | (() => void)
    | (() => TReturnType)
    | Promise<TReturnType>
    | null

*/
