import lodash from 'lodash';

export function isPromise(p: Promise<unknown> | null) {
  if (
    p !== null &&
    typeof p === 'object' &&
    typeof p.then === 'function' &&
    typeof p.catch === 'function'
  ) {
    return true;
  }

  return false;
}

/*

    | ((...args: Parameters<<T>(arg: T) => T>) => Promise<TReturnType>)
    | ((...args: Parameters<<T>(arg: T) => T>) => TReturnType)
    | ((...args: Parameters<<T>(arg: T) => T>) => void)
    | (() => void)
    | (() => TReturnType)
    | Promise<TReturnType>
    | null

*/

// ✅ Check if a function's return value is a Promise
export function isAsyncFunction(f: unknown) {
  if (
    (typeof f === 'function' && f.constructor.name === 'AsyncFunction') ||
    (typeof f === 'object' && isPromise(f as Promise<unknown> | null))
  ) {
    return true;
  }

  return false;
}

// 👇️ Examples
// ⛔️
// 👉️ true

// function getStringType(value: unknown) {
//   return Object.prototype.toString.call(value);
// }

// function isBoolean(value: boolean | null | undefined) {
//   return typeof value === 'boolean' || getStringType(value) === '[object Boolean]';
// }

// function isObject<T>(obj: T | null | undefined) {
//   return obj && (typeof obj === 'object' || getStringType(obj) === '[object Object]');
// }

// function hasOwnProperty<T extends { [key in keyof T]: T[key] }>(
//   obj: T | null | undefined,
//   prop: number | string
// ) {
//   return obj === null || obj === undefined
//     ? false
//     : Object.prototype.hasOwnProperty.call(obj, prop);
// }

// function isEmpty<T extends Array<T>>(arr: T | null | undefined) {
//   if (!arr || arr === null || arr === undefined) {
//     return true;
//   }

//   if (Array.isArray(arr) && arr.length === 0) {
//     return true;
//   } else if (typeof arr !== 'string') {
//     for (const v in arr) {
//       if (hasOwnProperty(arr, v)) {
//         return false;
//       }
//     }

//     return true;
//   }

//   return false;
// }

// const dataToValidate: GroupDataToValidate = {
//   companyData: {
//     companyName: 'Cyberpunk Ltd',
//     postCode: '23-234',
//     license: {
//       number: 739,
//       isRegulation: true
//     },
//     documents: [{ id: '1212', file: 'ewer' }]
//   },
//   ownersData: {
//     securityNumber: 'ML73900753799',
//     owners: [
//       {
//         firstName: 'John',
//         lastName: 'Connors',
//         pep: {
//           isExposed: false
//         }
//       }
//     ]
//   }
// };

// initialValue: '',
// isValid: true,
// isDirty: true,
// isValidating: false,
// isTouched: true,
// errors: ''

const testDataArr = [
  {
    fieldPath: 'companyData.companyName',
    value: 'Cyberpunk Ltd'
  },
  {
    fieldPath: 'companyData.postCode',
    value: '13-234'
  },
  {
    fieldPath: 'companyData.license.number',
    value: 34567
  },
  {
    fieldPath: 'companyData.license.isRegulation',
    value: true
  },
  {
    fieldPath: 'companyData.documents[0]',
    value: { id: '1212', file: 'ewer' }
  },
  {
    fieldPath: 'ownersData.securityNumber',
    value: 'ML73900753799'
  },
  {
    fieldPath: 'ownersData.owners[0].firstName',
    value: 'John'
  },
  {
    fieldPath: 'ownersData.owners[0].lastName',
    value: 'Connors'
  },
  {
    fieldPath: 'ownersData.owners[0][pep].isExposed',
    value: false
  }
];

const testData = new Map();
const resultData = {};

for (const item of testDataArr) {
  testData.set(item.fieldPath, {
    value: item.value,
    fieldPath: item.fieldPath,
    objPath: lodash.toPath(item.fieldPath)
  });

  lodash.set(resultData, item.fieldPath, item.value);
}

console.log(testData);
console.log(resultData);
