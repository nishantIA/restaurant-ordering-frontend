import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/lib/services/order.service';
import type { Order } from '@/types/order';

/**
 * Hook to fetch and track a single order
 */
export function useOrder(idOrOrderNumber: string | null, enablePolling = false) {
  return useQuery<Order>({
    queryKey: ['order', idOrOrderNumber],
    queryFn: () => orderService.getOrder(idOrOrderNumber!),
    enabled: !!idOrOrderNumber,
    staleTime: 0,
    // Only poll if WebSocket is not available OR explicitly enabled
    refetchInterval: enablePolling ? 5000 : false,
  });
}

/**
 * Hook to fetch orders by session
 */
export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrdersBySession(),
    staleTime: 30000,
  });
}