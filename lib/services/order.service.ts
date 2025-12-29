import { apiClient } from '@/lib/api/client';
import { getSessionId } from '@/lib/utils/session';
import type {
  Order,
  CreateOrderRequest,
  Payment,
  ProcessPaymentRequest,
} from '@/types/order';

/**
 * Order Service
 * Follows same pattern as MenuService and CartService
 */
class OrderService {
  /**
   * Get headers with session ID
   */
  private getHeaders(): Record<string, string> {
    const sessionId = getSessionId();
    return sessionId ? { 'x-session-id': sessionId } : {};
  }

  /**
   * Create order from cart
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('orders', data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Get order by ID or order number
   */
  async getOrder(idOrOrderNumber: string): Promise<Order> {
    return apiClient.get<Order>(`orders/${idOrOrderNumber}`);
  }

  /**
   * Get orders by session
   */
  async getOrdersBySession(): Promise<Order[]> {
    return apiClient.get<Order[]>('orders', {
      headers: this.getHeaders(),
    });
  }

  /**
   * Get order history by phone or email
   */
  async getOrderHistory(phone?: string, email?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (phone) params.append('phone', phone);
    if (email) params.append('email', email);

    return apiClient.get<Order[]>(`orders/history/search?${params.toString()}`);
  }

  /**
   * Process payment
   */
  async processPayment(data: ProcessPaymentRequest): Promise<Payment> {
    return apiClient.post<Payment>('payments/process', data);
  }

  /**
   * Get payment by ID
   */
  async getPayment(id: string): Promise<Payment> {
    return apiClient.get<Payment>(`payments/${id}`);
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrder(orderId: string): Promise<Payment> {
    return apiClient.get<Payment>(`payments/order/${orderId}`);
  }
}

export const orderService = new OrderService();