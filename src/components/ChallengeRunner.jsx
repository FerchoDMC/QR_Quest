import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Shield, Hourglass, HelpCircle, CheckCircle2, 
  XCircle, ArrowRight, Zap 
} from 'lucide-react';
import { CHALLENGES } from '../data/challenges';
import { playSuccess, playError, playSparkle, playClick } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

// Widgets interactivos dedicados para cada minijuego
import RuneSequenceVisual from './challenges/RuneSequenceVisual';
import PotionBrewVisual from './challenges/PotionBrewVisual';
import SpellToggleVisual from './challenges/SpellToggleVisual';
import EnchantedBoardVisual from './challenges/EnchantedBoardVisual';
import TreasureKeyVisual from './challenges/TreasureKeyVisual';
import MemoryMirrorVisual from './challenges/MemoryMirrorVisual';
import CipherDecoderVisual from './challenges/CipherDecoderVisual';
import MazePathVisual from './challenges/MazePathVisual';
import BinaryTorchesVisual from './challenges/BinaryTorchesVisual';
import FormulaPipelineVisual from './challenges/FormulaPipelineVisual';

export default function ChallengeRunner({
  session,
  onUpdateSession,
  onFinishAllChallenges
}) {
  const currentChallengeId = session.assignedChallengeIds[session.currentStepIndex];
  const challenge = CHALLENGES.find(c => c.id === currentChallengeId) || CHALLENGES[0];

  const [selectedOption, setSelectedOption] = useState(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [activeWildcardModal, setActiveWildcardModal] = useState(null); // comodín abierto en modal
  const [feedbackState, setFeedbackState] = useState(null); // { type: 'success' | 'error', message: '', explanation: '' }
  const [discardedOptions, setDiscardedOptions] = useState([]); // opciones eliminadas por poción
  const [isShieldActive, setIsShieldActive] = useState(session.isShieldActive || false);
  const [attemptsLeft, setAttemptsLeft] = useState(session.attemptsLeft ?? 2);
  const [isPhoenixRescue, setIsPhoenixRescue] = useState(false);

  // Temporizador activo por desafío
  const [timeLeft, setTimeLeft] = useState(challenge.durationSecs || 45);

  // Reiniciar estado local al cambiar de desafío
  useEffect(() => {
    setSelectedOption(null);
    setFeedbackState(null);
    setDiscardedOptions([]);
    setAttemptsLeft(2);
    setIsPhoenixRescue(false);
    setTimeLeft(challenge.durationSecs || 45);
  }, [session.currentStepIndex, challenge.durationSecs]);

  // Cuenta regresiva del reloj
  useEffect(() => {
    if (feedbackState?.type === 'success' || attemptsLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [feedbackState, attemptsLeft]);

  // Manejo de selección de respuesta
  const handleSelectOption = (option) => {
    if (feedbackState?.type === 'success' || attemptsLeft <= 0) return;
    if (discardedOptions.includes(option.id)) return;

    setSelectedOption(option.id);

    if (option.isCorrect) {
      // RESPUESTA CORRECTA: 100 pts (1er intento), 60 pts (2do intento o Fénix)
      playSuccess();
      triggerHaptic('success');
      const points = isPhoenixRescue ? 60 : (attemptsLeft === 2 ? 100 : 60);
      setFeedbackState({
        type: 'success',
        title: '¡Encantamiento Acertado!',
        message: `Has resuelto este misterio con precisión mágica. (+${points} pts)`,
        explanation: challenge.explanation,
        pointsEarned: points
      });
    } else {
      // RESPUESTA INCORRECTA
      if (isShieldActive) {
        // Escudo absorbe el error
        playSparkle();
        triggerHaptic('medium');
        setIsShieldActive(false);
        setFeedbackState({
          type: 'shield_absorbed',
          title: '🛡️ ¡Escudo de Protección Activado!',
          message: 'Tu escudo mágico absorbió el error. No has perdido ningún intento.',
          explanation: 'Revisa bien la pregunta y vuelve a intentarlo.'
        });
      } else {
        playError();
        triggerHaptic('error');
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);

        if (nextAttempts > 0) {
          setFeedbackState({
            type: 'error',
            title: 'Respuesta Incorrecta',
            message: `El hechizo no surtió efecto. Te queda ${nextAttempts} intento (vale 60 pts).`,
            explanation: 'Puedes solicitar una pista mágica o usar tus comodines.'
          });
        } else {
          // Se agotaron los intentos
          const hasPhoenix = session.wildcards.some(w => w.slug === 'fenix' && !w.isUsed);
          setFeedbackState({
            type: 'exhausted',
            title: 'Intentos Agotados',
            message: hasPhoenix 
              ? 'Has agotado tus intentos, ¡pero tienes el Fénix Salvador disponible para 1 rescate por 60 pts!'
              : 'Has agotado tus intentos (0 pts). La magia revela el misterio para que sigas aprendiendo.',
            explanation: challenge.explanation,
            allowPhoenix: hasPhoenix
          });
        }
      }
    }
  };

  // Avanzar al siguiente reto
  const handleAdvance = (isSuccess) => {
    playClick();
    triggerHaptic('light');

    const nextIndex = session.currentStepIndex + 1;
    const earnedPoints = isSuccess 
      ? (feedbackState?.pointsEarned ?? (isPhoenixRescue ? 60 : (attemptsLeft === 2 ? 100 : 60))) 
      : 0;
    const nextTotalScore = (session.totalScore || 0) + earnedPoints;

    const completedRecord = {
      challengeId: challenge.id,
      isSuccess,
      attemptsUsed: 2 - attemptsLeft,
      scoreEarned: earnedPoints
    };

    const updatedCompleted = [...session.completedChallenges, completedRecord];

    if (nextIndex >= session.assignedChallengeIds.length) {
      // Completó los 5 desafíos
      onFinishAllChallenges(updatedCompleted, nextTotalScore);
    } else {
      // Siguiente reto
      onUpdateSession({
        ...session,
        currentStepIndex: nextIndex,
        totalScore: nextTotalScore,
        attemptsLeft: 2,
        isShieldActive: false,
        completedChallenges: updatedCompleted
      });
    }
  };

  // Activar un comodín
  const handleUseWildcard = (wildcard) => {
    playSparkle();
    triggerHaptic('magic');

    // Marcar como usado en sesión
    const updatedWildcards = session.wildcards.map(w => 
      w.slug === wildcard.slug ? { ...w, isUsed: true, usedAt: Date.now() } : w
    );

    switch (wildcard.slug) {
      case 'escudo':
        setIsShieldActive(true);
        setActiveWildcardModal({
          title: '🛡️ Escudo Activado',
          message: 'Tu próximo error será completamente anulado.'
        });
        break;

      case 'sabiduria': {
        // Eliminar 2 opciones incorrectas
        const wrongOptions = challenge.options.filter(o => !o.isCorrect).map(o => o.id);
        const toDiscard = wrongOptions.slice(0, 2);
        setDiscardedOptions(toDiscard);
        setActiveWildcardModal({
          title: '🧪 Poción de la Sabiduría',
          message: 'El caldero ha disuelto 2 opciones incorrectas de tu vista.'
        });
        break;
      }

      case 'fenix':
        setIsPhoenixRescue(true);
        setAttemptsLeft(1);
        setFeedbackState(null);
        setSelectedOption(null);
        setTimeLeft(challenge.durationSecs || 45); // Reinicio de reloj
        setActiveWildcardModal({
          title: '🔥 Fénix Salvador',
          message: '¡Has renacido de las cenizas! Reloj reiniciado con 1 intento de rescate por 60 pts.'
        });
        break;

      case 'ayuda_mago':
        setActiveWildcardModal({
          title: '🧙 Ayuda del Mago (Misión Social)',
          isSocial: true,
          target: wildcard.socialTarget || 'tenga gafas puestas'
        });
        break;

      case 'felix':
        // Ofrecer super pista o revivir comodín
        setShowHintModal(true);
        setActiveWildcardModal({
          title: '✨ Felix Felicis',
          message: 'La suerte líquida te revela la pista oculta del acertijo.'
        });
        break;

      case 'giratiempo':
        setTimeLeft((prev) => prev + 20);
        setActiveWildcardModal({
          title: '⏳ Giratiempo',
          message: '¡El artefacto ha retrocedido el tiempo! +20 segundos añadidos al reloj.'
        });
        break;

      default:
        break;
    }

    onUpdateSession({
      ...session,
      wildcards: updatedWildcards,
      isShieldActive: wildcard.slug === 'escudo' ? true : isShieldActive
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100%',
      padding: '16px 18px',
      position: 'relative'
    }}>
      {/* 1. Cabecera con Progreso, Reloj y Vidas */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <div>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--gold-light)',
              fontFamily: 'var(--font-magic)'
            }}>
              DESAFÍO {session.currentStepIndex + 1} DE {session.assignedChallengeIds?.length || 5}
            </span>
            <span style={{
              marginLeft: '8px',
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: 'rgba(212, 168, 67, 0.22)',
              color: 'var(--gold-light)',
              fontWeight: '700',
              border: '1px solid rgba(212, 168, 67, 0.35)'
            }}>
              {session.totalScore || 0} / 500 pts
            </span>
            <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
              {(session.assignedChallengeIds || [0, 1, 2, 3, 4]).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '18px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: idx < session.currentStepIndex
                      ? 'var(--success)'
                      : idx === session.currentStepIndex
                      ? 'var(--gold)'
                      : 'rgba(255, 255, 255, 0.15)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Temporizador Activo y Vidas / Escudo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: timeLeft <= 10 ? 'rgba(126, 18, 29, 0.75)' : 'rgba(22, 36, 56, 0.7)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${timeLeft <= 10 ? 'var(--crimson-light)' : 'rgba(212, 168, 67, 0.3)'}`,
              fontSize: '0.78rem',
              fontWeight: '700',
              color: timeLeft <= 10 ? '#FF7675' : 'var(--gold-light)'
            }}>
              <Hourglass size={13} />
              <span>{timeLeft}s</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(22, 36, 56, 0.7)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(212, 168, 67, 0.3)'
            }}>
              {isShieldActive && (
                <span title="Escudo Activo" style={{ display: 'flex', alignItems: 'center' }}>
                  <Shield size={16} color="var(--gold-light)" className="glow-pulse" />
                </span>
              )}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(2)].map((_, i) => (
                  <Zap
                    key={i}
                    size={16}
                    color={i < attemptsLeft ? 'var(--gold)' : 'rgba(255, 255, 255, 0.2)'}
                    fill={i < attemptsLeft ? 'var(--gold)' : 'none'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badge de Habilidad de TI */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(212, 168, 67, 0.12)',
          border: '1px solid rgba(212, 168, 67, 0.3)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
          color: 'var(--gold-light)',
          marginBottom: '12px'
        }}>
          <Sparkles size={13} color="var(--gold)" />
          {challenge.tiSkill}
        </div>

        {/* Tarjeta del Desafío */}
        <div className="parchment-card" style={{ padding: '18px 16px', marginBottom: '16px' }}>
          <h3 style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '1.15rem',
            color: 'var(--crimson)',
            marginBottom: '8px'
          }}>
            {challenge.title}
          </h3>

          <p style={{
            fontSize: '0.9rem',
            lineHeight: '1.45',
            color: 'var(--text-parchment)',
            marginBottom: '12px'
          }}>
            {challenge.question}
          </p>

          {/* Widgets Visuales Interactivos Específicos por Minijuego */}
          {challenge.slug === 'runas' && (
            <RuneSequenceVisual selectedOptionId={selectedOption} />
          )}

          {challenge.slug === 'pocion' && (
            <PotionBrewVisual
              selectedOptionId={selectedOption}
              onSelectPotion={(optId) => {
                const opt = challenge.options.find(o => o.id === optId);
                if (opt) handleSelectOption(opt);
              }}
            />
          )}

          {challenge.slug === 'hechizo' && (
            <SpellToggleVisual
              solActive={selectedOption === 'opt_c' || selectedOption === 'opt_b' || selectedOption === null}
              lunaActive={selectedOption === 'opt_b' || selectedOption === 'opt_d'}
            />
          )}

          {challenge.slug === 'tablero' && (
            <EnchantedBoardVisual
              selectedOptionId={selectedOption}
              onSelectCell={(r, c) => {
                if (r === 3 && c === 2) {
                  const opt = challenge.options.find(o => o.id === 'opt_a');
                  if (opt) handleSelectOption(opt);
                }
              }}
            />
          )}

          {challenge.slug === 'tesoro' && (
            <TreasureKeyVisual
              selectedOptionId={selectedOption}
              onSelectKey={(optId) => {
                const opt = challenge.options.find(o => o.id === optId);
                if (opt) handleSelectOption(opt);
              }}
            />
          )}

          {challenge.slug === 'memoria' && (
            <MemoryMirrorVisual
              selectedOptionId={selectedOption}
              onSelectCard={(cardId) => {
                if (cardId === 'pos_2') {
                  const opt = challenge.options.find(o => o.id === 'opt_b');
                  if (opt) handleSelectOption(opt);
                }
              }}
            />
          )}

          {challenge.slug === 'alfabeto' && (
            <CipherDecoderVisual selectedOptionId={selectedOption} />
          )}

          {challenge.slug === 'laberinto' && (
            <MazePathVisual selectedOptionId={selectedOption} />
          )}

          {challenge.slug === 'codigo' && (
            <BinaryTorchesVisual selectedOptionId={selectedOption} />
          )}

          {challenge.slug === 'formula' && (
            <FormulaPipelineVisual selectedOptionId={selectedOption} />
          )}

          {/* Opciones Interactivas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {challenge.options.map((opt) => {
              const isDiscarded = discardedOptions.includes(opt.id);
              const isSelected = selectedOption === opt.id;

              return (
                <button
                  key={opt.id}
                  disabled={isDiscarded || feedbackState?.type === 'success'}
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected 
                      ? '2px solid var(--crimson)'
                      : isDiscarded
                      ? '1px dashed rgba(181, 150, 107, 0.4)'
                      : '1px solid var(--border-parchment)',
                    backgroundColor: isDiscarded
                      ? '#EAE0CB'
                      : isSelected
                      ? '#FFF5E0'
                      : '#FFFDF7',
                    color: isDiscarded ? '#A08E77' : 'var(--text-parchment)',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: isDiscarded ? 'not-allowed' : 'pointer',
                    textDecoration: isDiscarded ? 'line-through' : 'none',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{opt.label}</span>
                  {isDiscarded && <span style={{ fontSize: '0.72rem', fontStyle: 'italic' }}>Descartada</span>}
                </button>
              );
            })}
          </div>

          {/* Botón de Pista Rápida */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              onClick={() => setShowHintModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--crimson)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-magic)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              <HelpCircle size={15} />
              Consultar Pista
            </button>
          </div>
        </div>
      </div>

      {/* 2. Barra Flotante de Comodines (Abajo) */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px'
        }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--gold-light)',
            fontFamily: 'var(--font-magic)'
          }}>
            TUS COMODINES MÁGICOS
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Toca uno para usarlo
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {session.wildcards.map((wc) => (
            <button
              key={wc.slug}
              disabled={wc.isUsed}
              onClick={() => handleUseWildcard(wc)}
              style={{
                flex: '1',
                minWidth: '85px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: wc.isUsed ? 'rgba(255,255,255,0.05)' : 'rgba(22, 36, 56, 0.9)',
                border: wc.isUsed 
                  ? '1px solid rgba(255,255,255,0.1)' 
                  : '1px solid var(--gold)',
                color: wc.isUsed ? 'var(--text-muted)' : 'var(--text-light)',
                cursor: wc.isUsed ? 'not-allowed' : 'pointer',
                opacity: wc.isUsed ? 0.45 : 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{wc.emoji}</span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '600',
                textAlign: 'center',
                lineHeight: '1.1'
              }}>
                {wc.name}
              </span>
              <span style={{
                fontSize: '0.65rem',
                color: wc.isUsed ? 'var(--text-muted)' : 'var(--gold-light)'
              }}>
                {wc.isUsed ? 'Gastado' : 'Disponible'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL DE FEEDBACK (Acierto, Error, Fénix) */}
      <AnimatePresence>
        {feedbackState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(8, 13, 20, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 50
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="parchment-card"
              style={{
                width: '100%',
                maxWidth: '360px',
                padding: '24px 20px',
                textAlign: 'center'
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                {feedbackState.type === 'success' ? (
                  <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto' }} />
                ) : feedbackState.type === 'shield_absorbed' ? (
                  <Shield size={48} color="var(--gold)" style={{ margin: '0 auto' }} />
                ) : (
                  <XCircle size={48} color="var(--crimson)" style={{ margin: '0 auto' }} />
                )}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-magic)',
                color: feedbackState.type === 'success' ? 'var(--emerald)' : 'var(--crimson)',
                fontSize: '1.2rem',
                marginBottom: '8px'
              }}>
                {feedbackState.title}
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-parchment)',
                marginBottom: '14px',
                lineHeight: '1.4'
              }}>
                {feedbackState.message}
              </p>

              {feedbackState.explanation && (
                <div style={{
                  backgroundColor: '#EBE0C7',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-parchment-muted)',
                  textAlign: 'left',
                  marginBottom: '16px',
                  borderLeft: '4px solid var(--gold)'
                }}>
                  <strong>💡 Conexión con TI:</strong> {feedbackState.explanation}
                </div>
              )}

              {feedbackState.type === 'success' ? (
                <button
                  onClick={() => handleAdvance(true)}
                  className="btn-magic"
                  style={{ width: '100%', padding: '14px' }}
                >
                  Continuar Misión <ArrowRight size={16} />
                </button>
              ) : feedbackState.type === 'exhausted' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {feedbackState.allowPhoenix && (
                    <button
                      onClick={() => {
                        const phoenix = session.wildcards.find(w => w.slug === 'fenix');
                        if (phoenix) handleUseWildcard(phoenix);
                      }}
                      className="btn-magic"
                      style={{ width: '100%', padding: '12px' }}
                    >
                      🔥 Usar Fénix Salvador
                    </button>
                  )}
                  <button
                    onClick={() => handleAdvance(false)}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    Avanzar al Siguiente Reto
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setFeedbackState(null)}
                  className="btn-magic"
                  style={{ width: '100%', padding: '12px' }}
                >
                  Volver a Intentar
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE PISTA */}
      <AnimatePresence>
        {showHintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(8, 13, 20, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 50
            }}
          >
            <div className="parchment-card" style={{ width: '100%', maxWidth: '340px', padding: '22px' }}>
              <h4 style={{
                fontFamily: 'var(--font-magic)',
                color: 'var(--crimson)',
                fontSize: '1.1rem',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <HelpCircle size={20} /> Pista del Grimorio
              </h4>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-parchment)',
                lineHeight: '1.45',
                marginBottom: '16px'
              }}>
                {challenge.hint}
              </p>
              <button
                onClick={() => setShowHintModal(false)}
                className="btn-magic"
                style={{ width: '100%', padding: '12px' }}
              >
                Entendido
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE ACTIVACIÓN DE COMODÍN (Especialmente Social) */}
      <AnimatePresence>
        {activeWildcardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(8, 13, 20, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 50
            }}
          >
            <div className="parchment-card" style={{ width: '100%', maxWidth: '340px', padding: '24px 20px', textAlign: 'center' }}>
              <h4 style={{
                fontFamily: 'var(--font-magic)',
                color: 'var(--crimson)',
                fontSize: '1.2rem',
                marginBottom: '10px'
              }}>
                {activeWildcardModal.title}
              </h4>

              {activeWildcardModal.isSocial ? (
                <div>
                  <div style={{
                    backgroundColor: '#EDE0C4',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '2px dashed var(--crimson)',
                    marginBottom: '14px',
                    fontSize: '0.92rem',
                    color: 'var(--text-parchment)'
                  }}>
                    ¡Busca a una persona en el campus o en el stand que <strong>{activeWildcardModal.target}</strong>!
                    <br /><br />
                    <em>Preséntate y pídele que te dé su opinión para resolver este desafío de TI.</em>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-parchment-muted)', marginBottom: '14px' }}>
                    Cuando recibas su consejo, pulsa el botón para continuar.
                  </p>
                </div>
              ) : (
                <p style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-parchment)',
                  lineHeight: '1.45',
                  marginBottom: '16px'
                }}>
                  {activeWildcardModal.message}
                </p>
              )}

              <button
                onClick={() => setActiveWildcardModal(null)}
                className="btn-magic"
                style={{ width: '100%', padding: '12px' }}
              >
                ¡Listo para Resolver!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
