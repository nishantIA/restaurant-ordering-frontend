/**
 * Order Types
 * Based on backend schema and API responses
 */

import type { QuantityType } from './menu';

/**
 * Order Status
 */
export type OrderStatus = 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

/**
 * Order Item Customization
 */
export interface OrderItemCustomization {
  name: string;
  type: string;
  price: number;
}

/**
 * Order Item
 */
export interface OrderItem {
  id: string;
  itemName: string;
  itemBasePrice: number;
  quantity: number;
  quantityType: QuantityType;
  unit?: string;
  customizations: OrderItemCustomization[];
  specialInstructions?: string;
  itemSubtotal: number;
  itemTaxAmount: number;
  itemTotal: number;
}

/**
 * Order Tax
 */
export interface OrderTax {
  taxName: string;
  taxType: 'PERCENTAGE' | 'FIXED';
  taxValue: number;
  calculatedAmount: number;
}

/**
 * Order User
 */
export interface OrderUser {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
}

/**
 * Order
 */
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  user?: OrderUser;
  items: OrderItem[];
  taxes: OrderTax[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  specialInstructions?: string;
  estimatedPrepTime?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Order Request
 */
export interface CreateOrderRequest {
  phone?: string;
  email?: string;
  name?: string;
  specialInstructions?: string;
}

/**
 * Payment Status
 */
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

/**
 * Payment Method
 */
export type PaymentMethod = 'CARD' | 'CASH' | 'UPI' | 'MOCK';

/**
 * Payment
 */
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  gatewayResponse: unknown;
  createdAt: string;
  updatedAt: string;
}

/**
 * Process Payment Request
 */
export interface ProcessPaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}