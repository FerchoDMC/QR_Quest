import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Componentes de las pantallas del juego
import WelcomeScreen from '../components/WelcomeScreen';
import NameRegisterScreen from '../components/NameRegisterScreen';
import MagicEnvelopeScreen from '../components/MagicEnvelopeScreen';
import ChallengeRunner from '../components/ChallengeRunner';
import CelebrationScreen from '../components/CelebrationScreen';
import AreasShowcaseScreen from '../components/AreasShowcaseScreen';
import StickerScreen from '../components/StickerScreen';
import ShieldLoader from '../components/ShieldLoader';

// Servicios de persistencia y Supabase
import { 
  getCurrentSession, 
  startNewSession, 
  saveSession 
} from '../services/storageService';
import { guardarParticipante } from '../services/supabaseClient';

export default function GamePage() {
  const [session, setSession] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');

  // 1. Recuperar sesión persistente de localStorage al montar
  useEffect(() => {
    const existing = getCurrentSession();
    if (existing) {
      setSession(existing);
      if (existing.completedAt) {
        setCurrentScreen('sticker');
      } else if (!existing.isEnvelopeOpened) {
        setCurrentScreen('envelope');
      } else {
        setCurrentScreen('game');
      }
    } else {
      setCurrentScreen('welcome');
    }
  }, []);

  // 2. Desde Welcome -> Registro de Nombre
  const handleStartFromWelcome = () => {
    setCurrentScreen('register');
  };

  // 3. Desde Registro -> Iniciar sesión con animación mágica del ShieldLoader
  const handleRegisterName = (name) => {
    const newSession = startNewSession(name);
    setSession(newSession);

    // Transición inmersiva con el escudo oficial
    setLoaderMessage(`Invocando los 5 misterios para ${name}...`);
    setIsLoaderActive(true);

    setTimeout(() => {
      setIsLoaderActive(false);
      setCurrentScreen('envelope');
    }, 1600);
  };

  // 4. Desde Sobre Mágico -> Comenzar Desafíos
  const handleEnvelopeFinished = () => {
    if (!session) return;
    const updated = {
      ...session,
      isEnvelopeOpened: true
    };
    saveSession(updated);
    setSession(updated);
    setCurrentScreen('game');
  };

  // 5. Actualizar estado del juego durante la partida
  const handleUpdateSession = (updatedSession) => {
    saveSession(updatedSession);
    setSession(updatedSession);
  };

  // 6. Finalizar los 5 desafíos -> Sincronizar con Supabase y Celebración
  const handleFinishAllChallenges = async (completedChallenges, finalScore) => {
    if (!session) return;

    const isEligible = finalScore >= 350;
    const code = isEligible 
      ? `TI-${(session.id || Date.now().toString(36)).slice(-6).toUpperCase()}`
      : null;

    const updated = {
      ...session,
      totalScore: finalScore,
      completedChallenges,
      verificationCode: code,
      completedAt: Date.now()
    };

    // Guardado local inmediato
    saveSession(updated);
    setSession(updated);

    // Conexión con Supabase en segundo plano (Tolerante a Offline)
    try {
      await guardarParticipante({
        id: session.id,
        nombre: session.name,
        puntuacion: finalScore,
        codigo_verificacion: code
      });
      console.log('[GamePage] Partida sincronizada exitosamente con Supabase.');
    } catch (err) {
      console.warn('[GamePage] Partida preservada localmente (modo offline):', err);
    }

    setCurrentScreen('celebration');
  };

  // 7. Desde Celebración -> Vitrina de Áreas de TI
  const handleDiscoverAreas = () => {
    setCurrentScreen('areas');
  };

  // 8. Desde Áreas de TI -> Pantalla de Reclamar Sticker
  const handleClaimSticker = () => {
    setCurrentScreen('sticker');
  };

  // 9. Probar animación del escudo desde la pantalla de bienvenida
  const handleTestLoader = () => {
    setLoaderMessage('Probando encantamiento del Escudo de TI...');
    setIsLoaderActive(true);
    setTimeout(() => {
      setIsLoaderActive(false);
    }, 2000);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Loader de Escudo Mágico para transiciones */}
      <AnimatePresence>
        {isLoaderActive && (
          <ShieldLoader 
            message={loaderMessage} 
            size="md" 
            fullScreen={true} 
          />
        )}
      </AnimatePresence>

      {/* Máquina de estados de pantallas del juego */}
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <WelcomeScreen 
            key="welcome" 
            onStart={handleStartFromWelcome} 
            onTestLoader={handleTestLoader}
          />
        )}

        {currentScreen === 'register' && (
          <NameRegisterScreen 
            key="register" 
            onSubmitName={handleRegisterName}
            onBack={() => setCurrentScreen('welcome')}
          />
        )}

        {currentScreen === 'envelope' && session && (
          <MagicEnvelopeScreen
            key="envelope"
            participantName={session.name}
            wildcards={session.wildcards}
            onContinue={handleEnvelopeFinished}
          />
        )}

        {currentScreen === 'game' && session && (
          <ChallengeRunner
            key="game"
            session={session}
            onUpdateSession={handleUpdateSession}
            onFinishAllChallenges={handleFinishAllChallenges}
          />
        )}

        {currentScreen === 'celebration' && session && (
          <CelebrationScreen
            key="celebration"
            session={session}
            onDiscoverAreas={handleDiscoverAreas}
          />
        )}

        {currentScreen === 'areas' && (
          <AreasShowcaseScreen
            key="areas"
            onClaimSticker={handleClaimSticker}
          />
        )}

        {currentScreen === 'sticker' && session && (
          <StickerScreen
            key="sticker"
            session={session}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
