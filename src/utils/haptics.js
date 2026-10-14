// Utilidad para vibración háptica en dispositivos móviles
export function triggerHaptic(type = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(30);
        break;
      case 'medium':
        navigator.vibrate(50);
        break;
      case 'success':
        navigator.vibrate([40, 60, 80]);
        break;
      case 'error':
        navigator.vibrate([80, 50, 80]);
        break;
      case 'magic':
        navigator.vibrate([30, 40, 30, 40, 60]);
        break;
      default:
        navigator.vibrate(40);
    }
  } catch {
    // Si el navegador bloquea la vibración, silenciar sin error
  }
}
