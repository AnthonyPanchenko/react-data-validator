// import React, { createContext, useCallback, useContext, useRef, useSyncExternalStore } from 'react';

// https://grrr.tech/posts/2021/typescript-partial/

// type Partial<T> = { [P in keyof T]?: T[P] };

// type Subset<K> = {
//   [attr in keyof K]?: K[attr] extends object
//       ? Subset<K[attr]>
//       : K[attr] extends object | null
//       ? Subset<K[attr]> | null
//       : K[attr] extends object | null | undefined
//       ? Subset<K[attr]> | null | undefined
//       : K[attr];
// };

// [attr in keyof K]?: K[attr] extends object ? Subset<K[attr]> : K[attr];

// export const UseDataValidatorContext = createContext<UseDataValidatorReturnType<TData> | null>(null);

// const store = useContext<UseDataValidatorReturnType<TData>>(UseDataValidatorContext);

//     <UseDataValidatorContext.Provider value={validatorData}>
//       {children}
//     </UseDataValidatorContext.Provider>
//
