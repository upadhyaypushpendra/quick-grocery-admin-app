import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import type { DashboardStats } from '../interfaces/products';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>('/products/admin/stats');
      return data;
    },
  });
}
