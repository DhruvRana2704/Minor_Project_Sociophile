import { useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';

// Hook that returns a fetch wrapper which triggers the global loader
// when a backend call takes longer than `delayMs` (to avoid flicker).
export default function useFetchWithLoader({ delayMs = 250 } = {}) {
  const { startLoading, stopLoading } = useLoading();

  return useCallback(async (input, init = {}) => {
    let timer = null;
    let started = false;

    try {
      // Start a timer; only show loader if request exceeds delayMs
      timer = setTimeout(() => {
        started = true;
        startLoading();
      }, delayMs);

      const res = await fetch(input, init);

      return res;
    } catch (err) {
      throw err;
    } finally {
      // clear timer and stop loader if it was started
      if (timer) clearTimeout(timer);
      if (started) stopLoading();
    }
  }, [delayMs, startLoading, stopLoading]);
}
