'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { kitchenService, type UpdateOrderStatusRequest, type KitchenStats } from '@/lib/services/kitchen.service';
import type { Order } from '@/types/order';
import { toast } from 'sonner';

/**
 * Fetch kitchen orders
 */
export function useKitchenOrders(status?: 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED') {
  return useQuery<Order[]>({
    queryKey: ['kitchen', 'orders', status],
    queryFn: () => kitchenService.getOrders(status),
    staleTime: 0, // Always fresh 
    refetchInterval: false, // No polling
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch kitchen statistics
 */
export function useKitchenStats() {
  return useQuery<KitchenStats>({
    queryKey: ['kitchen', 'stats'],
    queryFn: () => kitchenService.getStats(),
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Fetch single order
 */
export function useKitchenOrder(orderId: string | null) {
  return useQuery<Order>({
    queryKey: ['kitchen', 'order', orderId],
    queryFn: () => kitchenService.getOrder(orderId!),
    enabled: !!orderId,
    staleTime: 0,
  });
}

/**
 * Update order status mutation
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrderStatusRequest }) =>
      kitchenService.updateOrderStatus(orderId, data),
    
    onMutate: async ({ orderId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['kitchen', 'orders'] });

      // Snapshot previous value
      const previousOrders = queryClient.getQueryData<Order[]>(['kitchen', 'orders']);

      // Optimistically update
      queryClient.setQueryData<Order[]>(['kitchen', 'orders'], (old) => {
        if (!old) return old;
        return old.map(order => 
          order.id === orderId 
            ? { ...order, status: data.status }
            : order
        );
      });

      return { previousOrders };
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(['kitchen', 'orders'], context.previousOrders);
      }
      toast.error('Failed to update order status', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    },

    onSuccess: (updatedOrder) => {
      toast.success('Order status updated', {
        description: `Order ${updatedOrder.orderNumber} is now ${updatedOrder.status.toLowerCase()}`,
      });
    },

    onSettled: () => {
      // Refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'stats'] });
    },
  });
}