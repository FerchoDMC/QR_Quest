import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, RefreshCw } from 'lucide-react';
import { playCardFlip } from '../../utils/audio';

export default function MemoryMirrorVisual({ selectedOptionId, onSelectCard }) {
  const cards = [
    { id: 'pos_1', name: 'Rayo', icon: '⚡', color: '#F1C40F', pos: '1º' },
    { id: 'pos_2', name: 'Escudo', icon: '🛡️', color: '#D4A843', pos: '2º', isTarget: true },
    { id: 'pos_3', name: 'Poción', icon: '🧪', color: '#9B59B6', pos: '3º' }
  ];

  const [isRevealed, setIsRevealed] = useState(true);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer;
    if (countdown > 0 && isRevealed) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isRevealed) {
      setIsRevealed(false);
      playCardFlip();
    }
    return () => clearTimeout(timer);
  }, [countdown, isRevealed]);

  const restartMemory = () => {
    setIsRevealed(true);
    setCountdown(3);
    playCardFlip();
  };

  return (
    <div style={{
      backgroundColor: '#0F1A2A',
      borderRadius: 'var(--radius-md)',
      padding: '14px 12px',
      border: '1px solid rgba(212, 168, 67, 0.3)',
      boxShadow: 'inset 0 0 25px rgba(0,0,0,0.7)',
      marginBottom: '14px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <span style={{
          fontSize: '0.72rem',
          color: 'var(--gold-light)',
          fontFamily: 'var(--font-magic)',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Eye size={13} />
          ESPEJO DE LA MEMORIA {isRevealed && `(${countdown}s)`}
        </span>

        {!isRevealed && (
          <button
            onClick={restartMemory}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold)',
              fontSize: '0.68rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={11} />
            Ver de nuevo
          </button>
        )}
      </div>

      {/* 3 Cartas Mágicas con Flip 3D */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        perspective: '600px'
      }}>
        {cards.map((c) => {
          const showFace = isRevealed || (c.isTarget && selectedOptionId === 'opt_b');

          return (
            <motion.div
              key={c.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isRevealed) {
                  playCardFlip();
                  if (onSelectCard) onSelectCard(c.id);
                }
              }}
              style={{
                width: '64px',
                height: '84px',
                borderRadius: '10px',
                border: showFace ? `2px solid ${c.color}` : '2px dashed var(--gold)',
                background: showFace
                  ? 'linear-gradient(135deg, #1C2D44 0%, #111D2D 100%)'
                  : 'radial-gradient(circle, #2C3E50 0%, #17202A 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: showFace ? `0 0 12px ${c.color}40` : '0 4px 10px rgba(0,0,0,0.5)',
                transition: 'transform 0.4s ease'
              }}
            >
              {showFace ? (
                <>
                  <span style={{ fontSize: '1.6rem' }}>{c.icon}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    color: c.color,
                    fontWeight: '700',
                    marginTop: '4px'
                  }}>
                    {c.pos}: {c.name}
                  </span>
                </>
              ) : (
                <>
                  <span style={{
                    fontSize: '1.4rem',
                    color: 'var(--gold-light)',
                    fontFamily: 'var(--font-magic)'
                  }}>
                    ?
                  </span>
                  <span style={{ fontSize: '0.6rem', color: '#64748B' }}>
                    {c.pos} posición
                  </span>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: '0.68rem',
        color: '#94A3B8',
        marginTop: '8px'
      }}>
        {isRevealed ? '¡Memoriza el orden antes de que se oculten!' : '¿Qué artefacto estaba en la 2ª posición?'}
      </div>
    </div>
  );
}
