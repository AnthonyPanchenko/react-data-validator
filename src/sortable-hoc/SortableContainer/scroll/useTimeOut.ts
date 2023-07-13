import { useCallback, useRef } from 'react';

export function useTimeOut(delay: number): [(listener: () => void) => void, () => void] {
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const set = useCallback(
    (listener: () => void) => {
      intervalRef.current = setTimeout(listener, delay);
    },
    [delay]
  );

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return [set, clear];
}
