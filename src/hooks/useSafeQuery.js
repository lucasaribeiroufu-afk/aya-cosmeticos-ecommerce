import { useState, useEffect } from 'react';

export function useSafeQuery(queryFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    queryFn()
      .then((res) => {
        if (mounted) {
          setData(res || []); // Garante que nunca retorne null/undefined
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, deps);

  return { data, loading, error };
}
