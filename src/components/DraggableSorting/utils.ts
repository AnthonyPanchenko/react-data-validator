/* eslint-disable no-console */
export const getLocalStorage = <TResult = any>(key: string): TResult | undefined => {
  try {
    const serialized = localStorage?.getItem(key);
    return serialized === null || serialized === undefined || serialized === 'undefined'
      ? undefined
      : JSON.parse(serialized);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const setLocalStorage = <TValue = any>(key: string, value: TValue): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(error);
  }
};
