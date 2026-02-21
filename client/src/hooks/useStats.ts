import { useState, useCallback } from 'react';
import client from '../api/client';
import type { StatsData, UseStatsReturn } from '../types';

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStats = useCallback(async (): Promise<StatsData> => {
    setLoading(true);
    try {
      const { data } = await client.get<StatsData>('/stats');
      setStats(data);
      return data;
    } catch (err) {
      console.error('Fetch stats error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, fetchStats };
}
