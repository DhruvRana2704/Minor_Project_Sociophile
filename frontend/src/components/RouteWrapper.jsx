import React, { useEffect } from 'react';
import { useLoading } from '../contexts/LoadingContext';

// Wrap each route element so we can stop the global loader when the page mounts
export default function RouteWrapper({ Component }) {
  const { stopLoading } = useLoading();

  useEffect(() => {
    // stop loader when the route component mounts
    stopLoading();
  }, [stopLoading]);

  return <Component />;
}
