import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const LoadingContext = createContext();

// Provider maintains an internal counter so multiple concurrent requests
// show a single global loader until all requests complete.
export function LoadingProvider({ children }) {
  const [count, setCount] = useState(0);
  const mounted = useRef(true);

  const startLoading = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setCount(c => Math.max(0, c - 1));
  }, []);

  // derived boolean
  const loading = count > 0;

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}

export default LoadingContext;
