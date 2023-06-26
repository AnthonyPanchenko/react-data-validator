export function miniUID() {
  return Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
}

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
  return (
    p instanceof Promise ||
    (p !== null &&
      typeof p === 'object' &&
      Object.prototype.toString.call(p) === '[object Promise]')
  );
}

export function isAsyncFunction(f: unknown) {
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

const propertyName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

// Used to match backslashes in property paths.
const reEscapeChar = /\\(\\)?/g;

export function stringToPath(path: string) {
  const result = [];
  // define dot .
  if (path.charCodeAt(0) === 46) {
    result.push('');
  }

  path.replace(propertyName, ((match: string, num: number, quote: string, subString: string) => {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : num || match);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as (substring: string, ...args: any[]) => string);

  return result as ReadonlyArray<string | number>;
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
