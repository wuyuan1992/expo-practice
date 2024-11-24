import { useEffect, useRef } from 'react';

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
}

export function useThrottle<T extends (...args: any[]) => void>(callback: T, limit: number, deps: any[] = []): void {
  const lastCall = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastCall.current >= limit) {
      callback();
      lastCall.current = now;
    }
  }, [...deps, limit]);
}
