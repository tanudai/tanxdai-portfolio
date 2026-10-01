// Web Haptic Feedback utilities with graceful fallback for devices without vibration support.
export function triggerHaptic(type = 'light') {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    switch (type) {
      case 'selection':
      case 'light':
        navigator.vibrate(8);
        break;
      case 'medium':
        navigator.vibrate(18);
        break;
      case 'heavy':
      case 'shake':
        navigator.vibrate([20, 25, 30]);
        break;
      case 'success':
        navigator.vibrate([10, 35, 15]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch {}
}
