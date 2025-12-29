'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsClient, type OrderStatusUpdatePayload } from '@/lib/websocket/websocket-client';
import { useWebSocketContext } from '@/lib/websocket/WebSocketContext';
import type { Order } from '@/types/order';
import { toast } from 'sonner';

export function useOrderTracking(orderId: string | null) {
  const { isConnected } = useWebSocketContext();
  const queryClient = useQueryClient();

  const handleStatusUpdate = useCallback((data: OrderStatusUpdatePayload) => {
    console.log('Order status update:', data);

    // Update React Query cache
    queryClient.setQueryData<Order>(['order', data.orderNumber], (oldData) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        status: data.status as Order['status'],
        updatedAt: data.timestamp,
      };
    });

    // Show toast notification
    toast.success('Order Status Updated', {
      description: `Your order is now ${data.status.toLowerCase().replace('_', ' ')}`,
    });
  }, [queryClient]);

  useEffect(() => {
    if (!orderId || !isConnected) return;

    // Subscribe to order updates
    wsClient.subscribeToOrder(orderId, handleStatusUpdate);

    // Cleanup
    return () => {
      wsClient.unsubscribeFromOrder(orderId, handleStatusUpdate);
    };
  }, [orderId, isConnected, handleStatusUpdate]);

  return { isConnected };
}