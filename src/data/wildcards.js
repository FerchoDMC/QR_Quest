// Banco oficial de los 6 Comodines Mágicos (Recursos de Hogwarts)
export const WILDCARDS = [
  {
    slug: 'escudo',
    name: 'Escudo de Protección',
    type: 'defensive',
    icon: 'Shield',
    emoji: '🛡️',
    shortDesc: 'Protege contra 1 error',
    description: 'Si respondes incorrectamente, este escudo mágico anula la penalización y te permite conservar tu intento.',
    useLabel: 'Activar Escudo'
  },
  {
    slug: 'ayuda_mago',
    name: 'Ayuda del Mago',
    type: 'social',
    icon: 'Users',
    emoji: '🧙',
    shortDesc: 'Misión social en el campus',
    description: 'Pide ayuda a alguien en el campus con un rasgo visible aleatorio para resolver este misterio juntos.',
    useLabel: 'Consultar Mago'
  },
  {
    slug: 'sabiduria',
    name: 'Poción de la Sabiduría',
    type: 'logic',
    icon: 'FlaskRound',
    emoji: '🧪',
    shortDesc: 'Descarta opciones incorrectas',
    description: 'Elimina automáticamente 2 opciones erróneas del desafío actual (efecto 50/50 mágico).',
    useLabel: 'Beber Poción'
  },
  {
    slug: 'giratiempo',
    name: 'Giratiempo',
    type: 'time',
    icon: 'Hourglass',
    emoji: '⏳',
    shortDesc: '+20 segundos de tiempo',
    description: 'Gira el artefacto encantado y añade 20 segundos adicionales al contador del desafío.',
    useLabel: 'Girar Tiempo'
  },
  {
    slug: 'fenix',
    name: 'Fénix Salvador',
    type: 'retry',
    icon: 'Flame',
    emoji: '🔥',
    shortDesc: 'Renace de las cenizas',
    description: 'Si fallas los intentos de un desafío, el fénix te permite reiniciar el reto actual desde cero con nuevos intentos.',
    useLabel: 'Invocar Fénix'
  },
  {
    slug: 'felix',
    name: 'Felix Felicis',
    type: 'special',
    icon: 'Sparkle',
    emoji: '✨',
    shortDesc: 'Suerte líquida pura',
    description: 'Te permite elegir: recibir una revelación directa de la pista O restaurar un comodín que ya hayas utilizado.',
    useLabel: 'Tomar Suerte'
  }
];

// Rasgos visuales rotativos para la misión social "Ayuda del Mago"
export const SOCIAL_TARGETS = [
  'lleve gafas o lentes puestos',
  'tenga gorra o sombrero',
  'vista una prenda o camiseta verde',
  'lleve una mochila roja o llamativa',
  'esté usando audífonos',
  'tenga un reloj de mano visible',
  'lleve una botella o termo de agua',
  'vista chaqueta o abrigo negro'
];
