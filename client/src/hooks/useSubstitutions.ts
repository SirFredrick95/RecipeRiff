import { useState, useCallback } from 'react';
import client from '../api/client';
import type { Substitution, UseSubstitutionsReturn, SubstitutionApiResponse } from '../types';

export function useSubstitutions(): UseSubstitutionsReturn {
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const lookupSubstitutions = useCallback(async (ingredient: string): Promise<Substitution[]> => {
    setLoading(true);
    try {
      const { data } = await client.get<SubstitutionApiResponse>('/substitutions/lookup', {
        params: { ingredient },
      });
      setSubstitutions(data.substitutions);
      return data.substitutions;
    } catch (err) {
      console.error('Substitution lookup error:', err);
      setSubstitutions([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { substitutions, loading, lookupSubstitutions };
}
