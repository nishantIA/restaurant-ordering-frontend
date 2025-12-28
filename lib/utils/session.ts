/**
 * Session Management Utilities
 * 
 * Handles anonymous session ID generation and persistence
 * Format: sess_<32-hex-chars>
 * Example: sess_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 */

const SESSION_KEY = 'sessionId';

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  
  const hexString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return `sess_${hexString}`;
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  const regex = /^sess_[a-f0-9]{32}$/;
  return regex.test(sessionId);
}

/**
 * Get or create session ID (browser only)
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return ''; // Server-side, return empty
  }

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId || !isValidSessionId(sessionId)) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Get session ID without creating
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Clear session ID
 */
export function clearSessionId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}