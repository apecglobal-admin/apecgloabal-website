import { useEffect, useState, useCallback } from 'react';

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiry: number;
};

const cache = new Map<string, CacheEntry<any>>();

const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 phút

export function useApiCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  cacheTime = DEFAULT_CACHE_TIME
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = cache.get(key);
      if (cached && Date.now() < cached.timestamp + cached.expiry) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      // Fetch new data
      const result = await fetchFn();
      
      // Cache the result
      cache.set(key, {
        data: result,
        timestamp: Date.now(),
        expiry: cacheTime
      });
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, cacheTime]);

  const refetch = useCallback(() => {
    cache.delete(key);
    fetchData();
  }, [key, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Utility function to clear cache
export function clearApiCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}