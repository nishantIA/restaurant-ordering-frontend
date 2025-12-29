let audio: HTMLAudioElement | null = null;
let isEnabled = true;

/**
 * Initialize audio element
 */
function initAudio() {
  if (typeof window === 'undefined') return;
  
  try {
    audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5; // 50% volume
  } catch (error) {
    console.warn('Could not initialize audio:', error);
  }
}

/**
 * Play notification sound
 */
export function playNotificationSound() {
  if (!isEnabled) return;
  
  try {
    if (!audio) {
      initAudio();
    }
    
    audio?.play().catch((error) => {
      console.warn('Could not play notification sound:', error);
      // Browser might block autoplay - that's okay
    });
  } catch (error) {
    console.warn('Error playing sound:', error);
  }
}

/**
 * Toggle sound on/off
 */
export function toggleSound(): boolean {
  isEnabled = !isEnabled;
  localStorage.setItem('kitchen_sound_enabled', String(isEnabled));
  return isEnabled;
}

/**
 * Get sound preference from localStorage
 */
export function getSoundPreference(): boolean {
  if (typeof window === 'undefined') return true;
  
  const stored = localStorage.getItem('kitchen_sound_enabled');
  if (stored !== null) {
    isEnabled = stored === 'true';
  }
  return isEnabled;
}

/**
 * Check if sound is enabled
 */
export function isSoundEnabled(): boolean {
  return isEnabled;
}