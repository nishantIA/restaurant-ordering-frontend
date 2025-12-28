/**
 * Application Constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000',
  TIMEOUT: 30000,
} as const;

/**
 * Cache Times (in milliseconds)
 */
export const CACHE_TIME = {
  MENU: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 10 * 60 * 1000, // 10 minutes
  CART: 0, // No stale time (always fresh)
  ORDER: 30 * 1000, // 30 seconds
} as const;

/**
 * Order Status
 */
export const ORDER_STATUS = {
  RECEIVED: 'RECEIVED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

/**
 * Order Status Display Labels
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  READY: 'Ready for Pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

/**
 * Order Status Colors (Tailwind classes)
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  RECEIVED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-yellow-100 text-yellow-800',
  READY: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

/**
 * Payment Methods
 */
export const PAYMENT_METHODS = {
  CARD: 'CARD',
  CASH: 'CASH',
  UPI: 'UPI',
  MOCK: 'MOCK',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

/**
 * Payment Method Labels
 */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CARD: 'Credit/Debit Card',
  CASH: 'Cash on Delivery',
  UPI: 'UPI',
  MOCK: 'Mock Payment (Test)',
};

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;

/**
 * Debounce Times (in milliseconds)
 */
export const DEBOUNCE_TIME = {
  SEARCH: 300,
  INPUT: 500,
} as const;

/**
 * WebSocket Events
 */
export const WS_EVENTS = {
  // Client -> Server
  ORDER_SUBSCRIBE: 'order:subscribe',
  ORDER_UNSUBSCRIBE: 'order:unsubscribe',
  KITCHEN_CONNECT: 'kitchen:connect',
  KITCHEN_DISCONNECT: 'kitchen:disconnect',
  
  // Server -> Client
  ORDER_STATUS_UPDATE: 'order:statusUpdate',
  KITCHEN_NEW_ORDER: 'kitchen:newOrder',
  KITCHEN_ORDER_UPDATE: 'kitchen:orderUpdate',
  CONNECTED: 'connected',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  SESSION_ID: 'sessionId',
  CART_BACKUP: 'cartBackup',
} as const;

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  CHECKOUT: '/checkout',
  PAYMENT: (orderId: string) => `/payment/${orderId}`,
  ORDER_TRACKING: (orderId: string) => `/orders/${orderId}`,
  KITCHEN: '/kitchen/dashboard',
} as const;