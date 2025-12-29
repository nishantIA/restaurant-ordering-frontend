import type { Order } from '@/types/order';
import { apiClient } from '../api/client';

export interface KitchenStats {
  received: number;
  preparing: number;
  ready: number;
  completed: number;
  cancelled: number;
  active: number;
}

export interface UpdateOrderStatusRequest {
  status: 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  changedBy?: string;
}

class KitchenService {
  /**
   * Get all orders (default: active orders only)
   */
  async getOrders(status?: 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'): Promise<Order[]> {
    const params = status ? { status } : {};
    return apiClient.get<Order[]>('kitchen/orders', { params });
  }

  /**
   * Get active orders (RECEIVED, PREPARING, READY)
   */
  async getActiveOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('kitchen/orders');
  }

  /**
   * Get single order details
   */
  async getOrder(id: string): Promise<Order> {
    return apiClient.get<Order>(`kitchen/orders/${id}`);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, data: UpdateOrderStatusRequest): Promise<Order> {
    return apiClient.patch<Order>(`kitchen/orders/${orderId}/status`, data);
  }

  /**
   * Get kitchen statistics
   */
  async getStats(): Promise<KitchenStats> {
    return apiClient.get<KitchenStats>('kitchen/stats');
  }
}

export const kitchenService = new KitchenService();