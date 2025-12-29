import { io, Socket } from 'socket.io-client';

/**
 * WebSocket Event Interfaces
 */
export interface OrderStatusUpdatePayload {
  orderId: string;
  orderNumber: string;
  status: string;
  previousStatus?: string;
  changedBy?: string;
  notes?: string;
  timestamp: string;
}

export interface NewOrderPayload {
  orderId: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    customizations: Array<{ name: string }>;
  }>;
  totalAmount: number;
  estimatedPrepTime: number;
  user?: {
    phone?: string;
    name?: string;
  };
  timestamp: string;
}

/**
 * WebSocket Client
 * Manages Socket.io connection to backend
 */
class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  /**
   * Connect to WebSocket server
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const backendUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    
    this.socket = io(`${backendUrl}/orders`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 10000);
        console.log(`Retrying connection in ${this.reconnectDelay}ms...`);
      }
    });

    this.socket.on('connected', (data: { socketId: string }) => {
      console.log('Server confirmed connection:', data.socketId);
    });

    return this.socket;
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Subscribe to order updates (customer)
   */
  subscribeToOrder(orderId: string, callback: (data: OrderStatusUpdatePayload) => void): void {
    if (!this.socket) {
      console.warn('Socket not connected. Call connect() first.');
      return;
    }

    // Subscribe to order
    this.socket.emit('order:subscribe', orderId);
    
    // Listen for status updates
    this.socket.on('order:statusUpdate', callback);
    
    console.log(`Subscribed to order: ${orderId}`);
  }

  /**
   * Unsubscribe from order updates
   */
  unsubscribeFromOrder(orderId: string, callback: (data: OrderStatusUpdatePayload) => void): void {
    if (!this.socket) return;

    this.socket.emit('order:unsubscribe', orderId);
    this.socket.off('order:statusUpdate', callback);
    
    console.log(`Unsubscribed from order: ${orderId}`);
  }

  /**
   * Connect as kitchen staff
   */
  connectKitchen(
    onNewOrder: (data: NewOrderPayload) => void,
    onOrderUpdate: (data: OrderStatusUpdatePayload) => void
  ): void {
    if (!this.socket) {
      console.warn('Socket not connected. Call connect() first.');
      return;
    }

    // Connect to kitchen
    this.socket.emit('kitchen:connect');
    
    // Listen for new orders
    this.socket.on('kitchen:newOrder', onNewOrder);
    
    // Listen for order updates
    this.socket.on('kitchen:orderUpdate', onOrderUpdate);
    
    console.log('Connected to kitchen dashboard');
  }

  /**
   * Disconnect from kitchen
   */
  disconnectKitchen(
    onNewOrder: (data: NewOrderPayload) => void,
    onOrderUpdate: (data: OrderStatusUpdatePayload) => void
  ): void {
    if (!this.socket) return;

    this.socket.emit('kitchen:disconnect');
    this.socket.off('kitchen:newOrder', onNewOrder);
    this.socket.off('kitchen:orderUpdate', onOrderUpdate);
    
    console.log('Disconnected from kitchen');
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();