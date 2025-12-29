/**
 * Cart Types
 * Based on backend schema and API responses
 */

import type { QuantityType } from './menu';

/**
 * Cart Customization
 */
export interface CartCustomization {
  customizationId: string;
  name: string;
  type: string;
  price: number;
}

/**
 * Cart Item
 */
export interface CartItem {
  id: string;
  menuItemId: string;
  menuItemSlug: string;
  name: string;
  imageUrl?: string;
  basePrice: number;
  quantity: number;
  quantityType: QuantityType;
  unit?: string;
  customizations: CartCustomization[];
  specialInstructions?: string;
  itemSubtotal: number;
  itemTaxAmount: number;
  itemTotal: number;
  isAvailable: boolean;
  availableQuantity?: number;
}

/**
 * Cart Response
 */
export interface Cart {
  sessionId: string;
  items: CartItem[];
  itemCount: number; 
  subtotal: number;
  taxAmount: number;
  total: number;
  canCheckout: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Add Cart Item Request
 */
export interface AddCartItemRequest {
  menuItemId: string;
  quantity: number;
  customizations?: Array<{
    customizationId: string;
  }>;
  specialInstructions?: string;
}

/**
 * Update Cart Item Request
 */
export interface UpdateCartItemRequest {
  quantity?: number;
  customizations?: Array<{
    customizationId: string;
  }>;
  specialInstructions?: string;
}

/**
 * Cart Summary (for display purposes)
 */
export interface CartSummary {
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  canCheckout: boolean;
}