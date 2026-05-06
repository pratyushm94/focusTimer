import { useState, useEffect, useCallback } from 'react';
import api from '../api';

export function useStats(days = 30) {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/stats/daily?days=${days}`);
      setStats(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, error, refresh: fetch };
}
