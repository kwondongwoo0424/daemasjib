import { useState, useEffect } from 'react';
import { visitService } from '../api/visitService';
import type { Visit } from '@/shared/types';

export const useVisits = (userId: string | undefined) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadVisits();
    }
  }, [userId]);

  const loadVisits = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await visitService.getVisitsByUserId(userId);
      setVisits(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createVisit = async (visitData: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const id = await visitService.createVisit(visitData);
      await loadVisits();
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateVisit = async (visitId: string, updates: Partial<Visit>) => {
    try {
      setError(null);
      await visitService.updateVisit(visitId, updates);
      await loadVisits();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteVisit = async (visitId: string) => {
    try {
      setError(null);
      await visitService.deleteVisit(visitId);
      await loadVisits();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    visits,
    loading,
    error,
    createVisit,
    updateVisit,
    deleteVisit,
    refresh: loadVisits,
  };
};
