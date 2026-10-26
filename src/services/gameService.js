/**
 * Servicio unificado de juego para El Desafío Mágico de TI
 * Implementa las reglas de la Versión 2.2:
 * - 5 desafíos por partida de un banco de 10.
 * - Puntuación: 1er intento = 100 pts, 2do intento = 60 pts, Fénix = 60 pts, agotados = 0 pts.
 * - Máximo: 500 pts. Umbral de pegatina: >= 350 pts.
 * - 6 comodines (Escudo, Giratiempo, Fénix, Sabiduría, Ayuda del Mago, Felix Felicis).
 * - Modo Demo Seguro: opera con datos de demostración aislados hasta que el backend Supabase esté migrado.
 */

import { CHALLENGES } from '../data/challenges';
import { WILDCARDS, SOCIAL_TARGETS } from '../data/wildcards';

const STORAGE_KEY_DEMO = 'qr_quest_magico_match_v2';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateVerificationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TI-${code}`;
}

export const gameService = {
  isOfflineDemo: true, // Indica claramente que opera en modo demo local hasta migrar Supabase

  startMatch(participantName) {
    const cleanName = participantName.trim();
    if (cleanName.length < 2 || cleanName.length > 50) {
      throw new Error('El nombre debe tener entre 2 y 50 caracteres.');
    }

    // 1. Sorteo de 5 desafíos únicos de 10
    const shuffledChallenges = shuffle(CHALLENGES);
    const selectedChallenges = shuffledChallenges.slice(0, 5).map(c => c.id);

    // 2. Sorteo probabilístico de cantidad de comodines: 1 (40%), 2 (40%), 3 (20%)
    const rand = Math.random();
    let count = 1;
    if (rand < 0.40) count = 1;
    else if (rand < 0.80) count = 2;
    else count = 3;

    // 3. Sorteo de comodines sin repetición
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

    const matchId = 'match_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const matchToken = 'tok_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    const matchState = {
      matchId,
      matchToken,
      participantName: cleanName,
      status: 'in_progress',
      currentStep: 0, // 0 a 4
      totalScore: 0,
      assignedChallengeIds: selectedChallenges,
      wildcards: chosenWildcards,
      isShieldArmed: false,
      extraTimeSecs: 0,
      isEnvelopeOpened: false,
      verificationCode: null,
      prizeStatus: 'not_eligible',
      // Estado detallado de cada uno de los 5 retos
      challengesState: selectedChallenges.map((cId, idx) => ({
        stepOrder: idx,
        challengeId: cId,
        attemptsOrdinaryUsed: 0,
        phoenixRescueGranted: false,
        phoenixRescueUsed: false,
        isSolved: false,
        scoreEarned: 0,
        extraTimeSecs: 0,
        startedAt: idx === 0 ? Date.now() : null, // Activación secuencial
        resolvedAt: null
      })),
      idempotencyRecords: {}, // { [idempotencyKey]: response }
      startedAt: Date.now(),
      completedAt: null
    };

    this.saveLocalState(matchState);
    return matchState;
  },

  getCurrentMatch() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DEMO);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveLocalState(state) {
    try {
      localStorage.setItem(STORAGE_KEY_DEMO, JSON.stringify(state));
    } catch (e) {
      console.error('Error guardando estado local del juego:', e);
    }
  },

  clearCurrentMatch() {
    localStorage.removeItem(STORAGE_KEY_DEMO);
  },

  validateAnswer(matchId, matchToken, stepOrder, selectedOptionId, idempotencyKey) {
    const match = this.getCurrentMatch();
    if (!match || match.matchId !== matchId || match.matchToken !== matchToken) {
      throw new Error('Sesión no autorizada o partida inválida');
    }

    // 1. Idempotencia: Verificar si la clave ya fue procesada
    if (match.idempotencyRecords[idempotencyKey]) {
      const cached = match.idempotencyRecords[idempotencyKey];
      if (cached.stepOrder !== stepOrder || cached.selectedOptionId !== selectedOptionId) {
        throw new Error('IDEMPOTENCY_PAYLOAD_MISMATCH: La clave fue usada con otro payload.');
      }
      return { response: cached.response, updatedMatch: match };
    }

    const currentChallengeState = match.challengesState[stepOrder];
    const challengeData = CHALLENGES.find(c => c.id === currentChallengeState.challengeId);
    if (!challengeData) throw new Error('Desafío no encontrado.');

    if (currentChallengeState.isSolved) {
      throw new Error('Este desafío ya fue resuelto previamente.');
    }

    const selectedOpt = challengeData.options.find(o => o.id === selectedOptionId);
    const isCorrect = selectedOpt ? selectedOpt.isCorrect : false;

    let response = {};

    if (isCorrect) {
      // RESPUESTA CORRECTA
      let score = 0;
      if (currentChallengeState.phoenixRescueGranted && !currentChallengeState.phoenixRescueUsed) {
        score = 60;
        currentChallengeState.phoenixRescueUsed = true;
      } else if (currentChallengeState.attemptsOrdinaryUsed === 0) {
        score = 100;
      } else {
        score = 60;
      }

      currentChallengeState.isSolved = true;
      currentChallengeState.scoreEarned = score;
      currentChallengeState.resolvedAt = Date.now();

      match.totalScore += score;
      match.currentStep += 1;

      // Iniciar temporizador secuencial del siguiente reto
      if (stepOrder < 4) {
        match.challengesState[stepOrder + 1].startedAt = Date.now();
      }

      response = {
        isCorrect: true,
        scoreEarned: score,
        totalScore: match.totalScore,
        explanation: challengeData.explanation
      };
    } else {
      // RESPUESTA INCORRECTA
      if (match.isShieldArmed) {
        // Escudo absorbe el error
        match.isShieldArmed = false;
        response = {
          isCorrect: false,
          shieldAbsorbed: true,
          message: '🛡️ El Escudo de Protección absorbió el error. No has perdido vidas.'
        };
      } else {
        if (currentChallengeState.phoenixRescueGranted && !currentChallengeState.phoenixRescueUsed) {
          // Falló el intento Fénix
          currentChallengeState.phoenixRescueUsed = true;
          currentChallengeState.resolvedAt = Date.now();
          match.currentStep += 1;
          if (stepOrder < 4) {
            match.challengesState[stepOrder + 1].startedAt = Date.now();
          }

          response = {
            isCorrect: false,
            shieldAbsorbed: false,
            message: 'El intento de rescate Fénix no fue acertado.',
            exhausted: true,
            allowPhoenix: false,
            explanation: challengeData.explanation
          };
        } else {
          currentChallengeState.attemptsOrdinaryUsed += 1;

          if (currentChallengeState.attemptsOrdinaryUsed >= 2) {
            // Se agotaron los 2 intentos ordinarios
            const hasPhoenix = match.wildcards.some(w => w.slug === 'fenix' && !w.isUsed);
            if (hasPhoenix) {
              response = {
                isCorrect: false,
                shieldAbsorbed: false,
                message: 'Has agotado tus intentos ordinarios, ¡pero tienes el Fénix Salvador disponible!',
                exhausted: true,
                allowPhoenix: true,
                explanation: challengeData.explanation
              };
            } else {
              // Cierre en 0 pts y avance al siguiente reto
              currentChallengeState.resolvedAt = Date.now();
              match.currentStep += 1;
              if (stepOrder < 4) {
                match.challengesState[stepOrder + 1].startedAt = Date.now();
              }

              response = {
                isCorrect: false,
                shieldAbsorbed: false,
                message: 'Intentos agotados. Se revela la solución para continuar.',
                exhausted: true,
                allowPhoenix: false,
                explanation: challengeData.explanation
              };
            }
          } else {
            response = {
              isCorrect: false,
              shieldAbsorbed: false,
              message: 'Respuesta incorrecta. Te queda 1 intento.',
              attemptsLeft: 1
            };
          }
        }
      }
    }

    // Guardar registro de idempotencia
    match.idempotencyRecords[idempotencyKey] = {
      stepOrder,
      selectedOptionId,
      response
    };

    this.saveLocalState(match);
    return { response, updatedMatch: match };
  },

  useWildcard(matchId, matchToken, wildcardSlug, stepOrder, idempotencyKey, targetSlug = null) {
    const match = this.getCurrentMatch();
    if (!match || match.matchId !== matchId || match.matchToken !== matchToken) {
      throw new Error('Sesión inválida.');
    }

    if (match.idempotencyRecords[idempotencyKey]) {
      return { response: match.idempotencyRecords[idempotencyKey].response, updatedMatch: match };
    }

    const wildcard = match.wildcards.find(w => w.slug === wildcardSlug && !w.isUsed);
    if (!wildcard) {
      throw new Error('El comodín no existe o ya ha sido utilizado.');
    }

    let response = {};

    switch (wildcardSlug) {
      case 'escudo':
        match.isShieldArmed = true;
        response = { success: true, slug: 'escudo', message: '🛡️ Escudo de Protección armado. Tu próximo error será absorbido.' };
        break;

      case 'giratiempo':
        match.challengesState[stepOrder].extraTimeSecs += 20;
        response = { success: true, slug: 'giratiempo', extraSeconds: 20, message: '⏳ +20 segundos añadidos al reloj.' };
        break;

      case 'fenix': {
        const cState = match.challengesState[stepOrder];
        if (cState.attemptsOrdinaryUsed < 2 || cState.isSolved) {
          throw new Error('El Fénix solo se activa cuando has agotado los intentos del reto.');
        }
        cState.phoenixRescueGranted = true;
        cState.phoenixRescueUsed = false;
        cState.startedAt = Date.now(); // Reinicio de temporizador
        response = { success: true, slug: 'fenix', message: '🔥 ¡El Fénix renace! Temporizador reiniciado con 1 intento de rescate por 60 pts.' };
        break;
      }

      case 'sabiduria': {
        const currentCId = match.challengesState[stepOrder].challengeId;
        const challenge = CHALLENGES.find(c => c.id === currentCId);
        const wrongOpts = challenge.options.filter(o => !o.isCorrect).map(o => o.id);
        const discarded = wrongOpts.slice(0, 2);
        response = { success: true, slug: 'sabiduria', discardedOptions: discarded, message: '🧪 El caldero ha disuelto 2 opciones incorrectas.' };
        break;
      }

      case 'ayuda_mago':
        response = { success: true, slug: 'ayuda_mago', isSocial: true, message: '🧙 Busca ayuda en la feria para resolver el misterio.' };
        break;

      case 'felix':
        if (targetSlug && targetSlug !== 'felix') {
          const toRecycle = match.wildcards.find(w => w.slug === targetSlug && w.isUsed);
          if (toRecycle) {
            toRecycle.isUsed = false;
            response = { success: true, slug: 'felix', action: 'recycle', message: `✨ Comodín ${toRecycle.name} reactivado.` };
          } else {
            response = { success: true, slug: 'felix', action: 'hint', message: '✨ Suerte líquida lista para guiarte.' };
          }
        } else {
          const currentCId = match.challengesState[stepOrder].challengeId;
          const challenge = CHALLENGES.find(c => c.id === currentCId);
          response = { success: true, slug: 'felix', action: 'hint', hint: challenge.hint, message: '✨ Pista revelada por Felix Felicis.' };
        }
        break;

      default:
        throw new Error('Comodín desconocido.');
    }

    wildcard.isUsed = true;
    wildcard.usedAt = Date.now();

    match.idempotencyRecords[idempotencyKey] = {
      wildcardSlug,
      stepOrder,
      response
    };

    this.saveLocalState(match);
    return { response, updatedMatch: match };
  },

  completeMatch(matchId, matchToken) {
    const match = this.getCurrentMatch();
    if (!match || match.matchId !== matchId || match.matchToken !== matchToken) {
      throw new Error('Sesión no autorizada.');
    }

    // Sumar puntaje real acumulado
    const actualScore = match.challengesState.reduce((acc, c) => acc + (c.scoreEarned || 0), 0);
    const passed = actualScore >= 350;
    const code = passed ? generateVerificationCode() : null;

    match.totalScore = actualScore;
    match.status = passed ? 'completed_passed' : 'completed_failed';
    match.prizeStatus = passed ? 'pending' : 'not_eligible';
    match.verificationCode = code;
    match.completedAt = Date.now();

    this.saveLocalState(match);

    return {
      totalScore: actualScore,
      passed,
      verificationCode: code,
      prizeStatus: match.prizeStatus
    };
  }
};
