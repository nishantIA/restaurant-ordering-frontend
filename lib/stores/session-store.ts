/**
 * Session Store
 * 
 * Manages anonymous session state using Zustand
 * Persists session ID to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getOrCreateSessionId } from '../utils/session';

interface SessionState {
  sessionId: string;
  initialized: boolean;
  initializeSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: '',
      initialized: false,

      initializeSession: () => {
        const sessionId = getOrCreateSessionId();
        set({ sessionId, initialized: true });
      },
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
);

/**
 * Hook to get session ID
 */
export function useSession() {
  const { sessionId, initialized, initializeSession } = useSessionStore();

  // Initialize on first render (client-side only)
  if (typeof window !== 'undefined' && !initialized) {
    initializeSession();
  }

  return {
    sessionId,
    initialized,
  };
}