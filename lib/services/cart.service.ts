import { getSessionId } from '@/lib/utils/session';
import { apiClient } from '@/lib/api/client';
import type {
  Cart,
  AddCartItemRequest,
  UpdateCartItemRequest,
} from '@/types/cart';

/**
 * Cart Service
 * Follows same pattern as MenuService
 */
class CartService {
  private getHeaders(): Record<string, string> {
    const sessionId = getSessionId();
    return sessionId ? { 'x-session-id': sessionId } : {};
  }

  /**
   * Get cart
   */
  async getCart(): Promise<Cart> {
    return apiClient.get<Cart>('cart', {
      headers: this.getHeaders(),
    });
  }

  /**
   * Add item to cart
   */
  async addItem(data: AddCartItemRequest): Promise<Cart> {
    return apiClient.post<Cart>('cart/items', data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Update cart item
   */
  async updateItem(itemId: string, data: UpdateCartItemRequest): Promise<Cart> {
    return apiClient.put<Cart>(`cart/items/${itemId}`, data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`cart/items/${itemId}`, {
      headers: this.getHeaders(),
    });
  }
}

export const cartService = new CartService();