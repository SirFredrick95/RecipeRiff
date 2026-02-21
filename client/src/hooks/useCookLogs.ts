import { useState, useCallback } from 'react';
import client from '../api/client';
import type {
  CookLog,
  CookLogInput,
  UseCookLogsReturn,
  CookLogApiResponse,
  CookLogListApiResponse,
} from '../types';

export function useCookLogs(): UseCookLogsReturn {
  const [cookLogs, setCookLogs] = useState<CookLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const logCook = useCallback(async ({ recipeId, rating, notes, photoUri }: CookLogInput): Promise<CookLog> => {
    setLoading(true);
    try {
      if (photoUri) {
        const formData = new FormData();
        formData.append('recipeId', recipeId.toString());
        if (rating) formData.append('rating', rating.toString());
        if (notes) formData.append('notes', notes);
        formData.append('photo', {
          uri: photoUri,
          name: `cook-${Date.now()}.jpg`,
          type: 'image/jpeg',
        } as unknown as Blob);
        const { data } = await client.post<CookLogApiResponse>('/cook-logs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.cookLog;
      } else {
        const { data } = await client.post<CookLogApiResponse>('/cook-logs', { recipeId, rating, notes });
        return data.cookLog;
      }
    } catch (err) {
      console.error('Log cook error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCookLogs = useCallback(async (recipeId?: number): Promise<CookLog[]> => {
    setLoading(true);
    try {
      const params: Record<string, number> = {};
      if (recipeId) params.recipeId = recipeId;
      const { data } = await client.get<CookLogListApiResponse>('/cook-logs', { params });
      setCookLogs(data.cookLogs);
      return data.cookLogs;
    } catch (err) {
      console.error('Fetch cook logs error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cookLogs, loading, logCook, fetchCookLogs };
}
