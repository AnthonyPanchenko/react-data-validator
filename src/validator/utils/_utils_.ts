// /** @private is the value an empty array? */
// export const isEmptyArray = (value?: any) => Array.isArray(value) && value.length === 0;

// /** @private is the given object a Function? */
// export const isFunction = (obj: any): obj is Function => typeof obj === 'function';

// /** @private is the given object an Object? */
// export const isObject = (obj: any): obj is Object => obj !== null && typeof obj === 'object';

// /** @private is the given object an integer? */
// export const isInteger = (obj: any): boolean => String(Math.floor(Number(obj))) === obj;

// /** @private is the given object a string? */
// export const isString = (obj: any): obj is string =>
//   Object.prototype.toString.call(obj) === '[object String]';

// /** @private is the given object a NaN? */
// // eslint-disable-next-line no-self-compare
// export const isNaN = (obj: any): boolean => obj !== obj;

// /** @private Does a React component have exactly 0 children? */
// export const isEmptyChildren = (children: any): boolean => React.Children.count(children) === 0;

// /** @private is the given object/value a promise? */
// export const isPromise = (value: any): value is PromiseLike<any> =>
//   isObject(value) && isFunction(value.then);

// /** @private is the given object/value a type of synthetic event? */
// export const isInputEvent = (value: any): value is React.SyntheticEvent<any> =>
//   value && isObject(value) && isObject(value.target);

/**
 * Recursively a set the same value for all keys and arrays nested object, cloning
 * @param object
 * @param value
 * @param visited
 * @param response
 */
// export function setNestedObjectValues<T>(
//   object: any,
//   value: any,
//   visited: any = new WeakMap(),
//   response: any = {}
// ): T {
//   for (const k of Object.keys(object)) {
//     const val = object[k];
//     if (isObject(val)) {
//       if (!visited.get(val)) {
//         visited.set(val, true);
//         // In order to keep array values consistent for both dot path  and
//         // bracket syntax, we need to check if this is an array so that
//         // this will output  { friends: [true] } and not { friends: { "0": true } }
//         response[k] = Array.isArray(val) ? [] : {};
//         setNestedObjectValues(val, value, visited, response[k]);
//       }
//     } else {
//       response[k] = value;
//     }
//   }

//   return response;
// }

// useEffect(() => {
//   if (
//     isChangedCurrent('isValid') ||
//     isChangedCurrent('isDirty') ||
//     isChangedCurrent('isValidating') ||
//     isChangedCurrent('isTouched') ||
//     isChangedErrors()
//   ) {
//     // console.log('useEffect: ', config);
//     setCurrentState(prev => ({
//       initialValue: prev.initialValue,
//       fieldName: prev.fieldName,
//       isValid: isChangedCurrent('isValid') ? config.isValid : prev.isValid,
//       isDirty: isChangedCurrent('isDirty') ? config.isDirty : prev.isDirty,
//       isValidating: isChangedCurrent('isValidating') ? config.isValidating : prev.isValidating,
//       isTouched: isChangedCurrent('isTouched') ? config.isTouched : prev.isTouched,
//       errors: isChangedErrors() ? config.errors : prev.errors
//     }));
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [config.isValid, config.isDirty, config.isValidating, config.isTouched, config.errors]);
