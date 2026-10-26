import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { playEnvelopeOpen, playSparkle, playClick } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export default function MagicEnvelopeScreen({ participantName, wildcards, onContinue }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    playEnvelopeOpen();
    triggerHaptic('magic');
    setIsOpen(true);

    // Reproducir destellos a medida que salen las cartas
    setTimeout(() => {
      playSparkle();
    }, 600);
  };

  const handleNext = () => {
    playClick();
    triggerHaptic('light');
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 20px',
        minHeight: '100%',
        justifyContent: 'space-between'
      }}
    >
      {/* Encabezado */}
      <div style={{ textAlign: 'center', width: '100%', marginTop: '10px' }}>
        <p style={{
          fontFamily: 'var(--font-magic)',
          color: 'var(--gold-light)',
          fontSize: '0.85rem',
          letterSpacing: '1px'
        }}>
          CORRESPONDENCIA OFICIAL
        </p>
        <h2 className="magic-title" style={{ fontSize: '1.45rem', marginTop: '4px' }}>
          {isOpen ? 'Tus Recursos Mágicos' : 'Sobre de la Suerte'}
        </h2>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          marginTop: '4px',
          fontFamily: 'var(--font-serif)'
        }}>
          {isOpen 
            ? `¡Felicidades, ${participantName}! Tienes ${wildcards.length} comodín(es) para tu aventura:`
            : `Toca el sobre para descubrir tus comodines asignados, ${participantName}.`}
        </p>
      </div>

      {/* Área del Sobre y Cartas */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '320px',
        height: isOpen ? 'auto' : '260px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px 0'
      }}>
        {!isOpen ? (
          /* Sobre Cerrado 3D */
          <motion.div
            onClick={handleOpenEnvelope}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '280px',
              height: '190px',
              backgroundColor: 'var(--bg-parchment)',
              borderRadius: '12px',
              position: 'relative',
              boxShadow: '0 15px 35px rgba(0,0,0,0.5), inset 0 0 30px rgba(181, 150, 107, 0.4)',
              border: '2px solid var(--border-parchment)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '800px'
            }}
          >
            {/* Pliegues del sobre */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderTop: '95px solid #E4D1B0',
              borderLeft: '140px solid transparent',
              borderRight: '140px solid transparent',
              pointerEvents: 'none'
            }} />

            {/* Sello de Cera Rojo Interactivo */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              style={{
                position: 'relative',
                zIndex: 10,
                cursor: 'pointer'
              }}
            >
              <div className="wax-seal" style={{ width: '58px', height: '58px', fontSize: '1.5rem' }}>
                ⚡
              </div>
            </motion.div>

            <div style={{
              position: 'absolute',
              bottom: '12px',
              color: 'var(--text-parchment-muted)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-magic)',
              zIndex: 5
            }}>
              TOCA PARA ABRIR
            </div>
          </motion.div>
        ) : (
          /* Cartas Reveladas de los Comodines */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AnimatePresence>
              {wildcards.map((wc, index) => {
                return (
                  <motion.div
                    key={wc.slug}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: 'spring',
                      damping: 14,
                      delay: index * 0.25
                    }}
                    className="parchment-card"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      border: '2px solid var(--gold)',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '2px solid var(--gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      flexShrink: 0
                    }}>
                      {wc.emoji}
                    </div>

                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <h4 style={{
                          fontFamily: 'var(--font-magic)',
                          fontSize: '0.95rem',
                          color: 'var(--crimson)',
                          margin: 0
                        }}>
                          {wc.name}
                        </h4>
                        <span style={{
                          fontSize: '0.72rem',
                          backgroundColor: 'rgba(212, 168, 67, 0.25)',
                          color: '#5C3800',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: '700'
                        }}>
                          1 USO
                        </span>
                      </div>

                      <p style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-parchment)',
                        marginTop: '4px',
                        lineHeight: '1.3'
                      }}>
                        {wc.description}
                      </p>

                      {wc.socialTarget && (
                        <p style={{
                          fontSize: '0.78rem',
                          color: 'var(--crimson)',
                          fontWeight: '600',
                          marginTop: '4px',
                          fontStyle: 'italic'
                        }}>
                          🎯 Objetivo: Persona que {wc.socialTarget}.
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Botón inferior para continuar */}
      <div style={{ width: '100%', marginBottom: '10px' }}>
        {isOpen ? (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="btn-magic"
            style={{ width: '100%', padding: '16px' }}
          >
            <Sparkles size={18} />
            Comenzar los Desafíos
            <ArrowRight size={18} />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleOpenEnvelope}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            Abrir Sobre Mágico
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
