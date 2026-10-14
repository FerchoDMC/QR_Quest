import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import NameRegisterScreen from './components/NameRegisterScreen';
import MagicEnvelopeScreen from './components/MagicEnvelopeScreen';
import ChallengeRunner from './components/ChallengeRunner';
import CelebrationScreen from './components/CelebrationScreen';
import AreasShowcaseScreen from './components/AreasShowcaseScreen';
import StickerScreen from './components/StickerScreen';
import { 
  getCurrentSession, 
  startNewSession, 
  saveSession, 
  clearSession 
} from './services/storageService';

export default function App() {
  const [session, setSession] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('welcome');

  // Recuperar sesión persistente de localStorage al cargar
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

  // 1. Desde Welcome -> Registro de Nombre
  const handleStartFromWelcome = () => {
    setCurrentScreen('register');
  };

  // 2. Desde Registro -> Iniciar sesión y pasar a Sobre Mágico
  const handleRegisterName = (name) => {
    const newSession = startNewSession(name);
    setSession(newSession);
    setCurrentScreen('envelope');
  };

  // 3. Desde Sobre Mágico -> Iniciar Desafíos
  const handleEnvelopeFinished = () => {
    const updated = {
      ...session,
      isEnvelopeOpened: true
    };
    saveSession(updated);
    setSession(updated);
    setCurrentScreen('game');
  };

  // 4. Actualizar estado del juego durante los retos
  const handleUpdateSession = (updatedSession) => {
    saveSession(updatedSession);
    setSession(updatedSession);
  };

  // 5. Finalizar todos los retos -> Celebración
  const handleFinishAllChallenges = (completedChallenges) => {
    const updated = {
      ...session,
      completedChallenges,
      completedAt: Date.now()
    };
    saveSession(updated);
    setSession(updated);
    setCurrentScreen('celebration');
  };

  // 6. Desde Celebración -> Vitrina de Áreas de TI
  const handleDiscoverAreas = () => {
    setCurrentScreen('areas');
  };

  // 7. Desde Áreas de TI -> Pantalla de Reclamar Sticker
  const handleClaimSticker = () => {
    setCurrentScreen('sticker');
  };

  // 8. Reiniciar partida para nuevo participante
  const handleResetGame = () => {
    clearSession();
    setSession(null);
    setCurrentScreen('welcome');
  };

  return (
    <main className="app-container">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={handleStartFromWelcome} />
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
            onResetGame={handleResetGame}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
