import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Order, OrderStats, PaginatedResponse } from '../interfaces/products';
import apiClient from '../lib/apiClient';

export function useAdminOrders(params: { page: number; limit: number; status?: string }) {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Order>>('/orders/admin/list', {
        params: {
          page: params.page,
          limit: params.limit,
          ...(params.status ? { status: params.status } : {}),
        },
      });
      return data;
    },
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Order>(`/orders/admin/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useAdminOrderStats() {
  return useQuery({
    queryKey: ['admin-order-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<OrderStats>('/orders/admin/stats');
      return data;
    },
  });
}

export function useAdminCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.delete<Order>(`/orders/admin/${orderId}/cancel`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-order-stats'] });
    },
  });
}
