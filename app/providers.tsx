/**
 * Application Providers
 * 
 * Sets up:
 * - React Query (TanStack Query) for server state management
 * - Session initialization
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { useSessionStore } from '@/lib/stores/session-store';
import { CACHE_TIME } from '@/lib/utils/constants';

/**
 * Session Initializer Component
 * Ensures session is created on app load
 */
function SessionInitializer({ children }: { children: ReactNode }) {
  const initializeSession = useSessionStore((state) => state.initializeSession);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return <>{children}</>;
}

/**
 * Main Providers Component
 */
export function Providers({ children }: { children: ReactNode }) {
  // Create Query Client (stable reference)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: CACHE_TIME.MENU,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionInitializer>
        {children}
        <Toaster position="top-right" richColors />
      </SessionInitializer>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}