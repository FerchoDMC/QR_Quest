import { CHALLENGES } from '../data/challenges';
import { WILDCARDS, SOCIAL_TARGETS } from '../data/wildcards';

const STORAGE_KEY = 'qr_quest_magico_session_v1';

// Función para mezclar aleatoriamente un array (Fisher-Yates)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Inicializa una nueva sesión para un participante
 */
export function startNewSession(participantName) {
  // 1. Sorteo de 3 desafíos únicos del banco de 10
  const shuffledChallenges = shuffle(CHALLENGES);
  const selectedChallenges = shuffledChallenges.slice(0, 3).map(c => c.id);

  // 2. Sorteo probabilístico de la cantidad de comodines:
  // 40% -> 1 comodín | 40% -> 2 comodines | 20% -> 3 comodines
  const rand = Math.random();
  let count = 1;
  if (rand < 0.40) {
    count = 1;
  } else if (rand < 0.80) {
    count = 2;
  } else {
    count = 3;
  }

  // 3. Selección aleatoria de los comodines sin duplicados
  const shuffledWildcards = shuffle(WILDCARDS);
  const chosenWildcards = shuffledWildcards.slice(0, count).map(w => {
    const randomSocial = SOCIAL_TARGETS[Math.floor(Math.random() * SOCIAL_TARGETS.length)];
    return {
      slug: w.slug,
      name: w.name,
      type: w.type,
      emoji: w.emoji,
      shortDesc: w.shortDesc,
      description: w.description,
      isUsed: false,
      usedAt: null,
      socialTarget: w.slug === 'ayuda_mago' ? randomSocial : null
    };
  });

  const session = {
    id: 'wiz_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    name: participantName.trim(),
    assignedChallengeIds: selectedChallenges,
    currentStepIndex: 0, // 0, 1 o 2
    attemptsLeft: 2,
    wildcards: chosenWildcards,
    isShieldActive: false,
    discardedOptionIds: [], // opciones ocultadas por Poción de Sabiduría
    extraTimeSeconds: 0,    // segundos sumados por Giratiempo
    completedChallenges: [], // [{ id, isSuccess, attemptsUsed }]
    isEnvelopeOpened: false,
    startedAt: Date.now(),
    completedAt: null
  };

  saveSession(session);
  return session;
}

/**
 * Obtiene la sesión actual de localStorage
 */
export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer sesión de localStorage:', err);
    return null;
  }
}

/**
 * Guarda el estado actual de la sesión
 */
export function saveSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Error al persistir sesión en localStorage:', err);
  }
}

/**
 * Limpia la sesión actual
 */
export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error al limpiar sesión:', err);
  }
}
