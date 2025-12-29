'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketContext } from '@/lib/websocket/WebSocketContext';
import { wsClient } from '@/lib/websocket/websocket-client';
import type { OrderStatusUpdatePayload, NewOrderPayload } from '@/lib/websocket/websocket-client';
import { toast } from 'sonner';
import { playNotificationSound, getSoundPreference } from '@/lib/utils/notification-sound';

export function useKitchenWebSocket() {
  const { isConnected } = useWebSocketContext();
  const queryClient = useQueryClient();

  const handleNewOrder = useCallback((data: NewOrderPayload) => {
    console.log('New order received:', data);

    // Invalidate queries to refetch
    queryClient.invalidateQueries({ queryKey: ['kitchen', 'orders'] });
    queryClient.invalidateQueries({ queryKey: ['kitchen', 'stats'] });

    // Play sound notification
    if (getSoundPreference()) {
      playNotificationSound();
    }

    // Show toast notification
    toast.success('New Order Received! 🔔', {
      description: `Order ${data.orderNumber} - ${data.items.length} item${data.items.length !== 1 ? 's' : ''}`,
      duration: 5000,
    });
  }, [queryClient]);

  const handleOrderUpdate = useCallback((data: OrderStatusUpdatePayload) => {
    console.log('Order updated:', data);

    // Invalidate queries to refetch
    queryClient.invalidateQueries({ queryKey: ['kitchen', 'orders'] });
    queryClient.invalidateQueries({ queryKey: ['kitchen', 'stats'] });

    // Show info toast
    toast.info('Order Updated', {
      description: `Order ${data.orderNumber} is now ${data.status.toLowerCase()}`,
      duration: 3000,
    });
  }, [queryClient]);

  useEffect(() => {
    if (!isConnected) {
      console.log('Waiting for WebSocket connection...');
      return;
    }

    console.log('Kitchen WebSocket connected');

    // Connect to kitchen events
    wsClient.connectKitchen(handleNewOrder, handleOrderUpdate);

    // Cleanup
    return () => {
      console.log('Disconnecting kitchen WebSocket');
      wsClient.disconnectKitchen(handleNewOrder, handleOrderUpdate);
    };
  }, [isConnected, handleNewOrder, handleOrderUpdate]);

  return { isConnected };
}