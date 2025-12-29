'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { wsClient } from './websocket-client';
import type { Socket } from 'socket.io-client';

interface WebSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  socket: null,
  isConnected: false,
});

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WebSocketContextValue>({
    socket: null,
    isConnected: false,
  });

  useEffect(() => {
    const socketInstance = wsClient.connect();
    
    const handleConnect = () => {
      console.log('WebSocket connected');
      setState(prev => ({ ...prev, isConnected: true }));
    };
    
    const handleDisconnect = () => {
      console.log('WebSocket disconnected');
      setState(prev => ({ ...prev, isConnected: false }));
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    // Use queueMicrotask to defer state update
    queueMicrotask(() => {
      setState({
        socket: socketInstance,
        isConnected: socketInstance.connected,
      });
    });

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      wsClient.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={state}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}