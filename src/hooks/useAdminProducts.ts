import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import type { Product, PaginatedResponse } from '../interfaces/products';

interface ProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export function useAdminProducts(params: ProductsQuery = {}) {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Product>>(
        '/products/admin/list',
        { params },
      );
      return data;
    },
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Product>(`/products/admin/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: Partial<Product>) => {
      const { data } = await apiClient.post<Product>('/products/admin', dto);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: Partial<Product>) => {
      const { data } = await apiClient.patch<Product>(
        `/products/admin/${id}`,
        dto,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/admin/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}
