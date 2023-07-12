import { useCallback, useRef } from 'react';

export function useInterval(delay: number): [(listener: () => void) => void, () => void] {
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const set = useCallback(
    (listener: () => void) => {
      intervalRef.current = setInterval(listener, delay);
    },
    [delay]
  );

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return [set, clear];
}
