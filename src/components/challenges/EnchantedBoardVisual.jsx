import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { playStoneSlide } from '../../utils/audio';

export default function EnchantedBoardVisual({ selectedOptionId, onSelectCell }) {
  // Posiciones en matriz 3x3: [row, col] de 1 a 3
  const [piecePos, setPiecePos] = useState({ r: 1, c: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  const runAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPiecePos({ r: 1, c: 1 });
    playStoneSlide();

    // Paso 1: Mover 2 casillas al Sur -> (3, 1)
    setTimeout(() => {
      setPiecePos({ r: 3, c: 1 });
      playStoneSlide();
    }, 700);

    // Paso 2: Mover 1 casilla al Este -> (3, 2)
    setTimeout(() => {
      setPiecePos({ r: 3, c: 2 });
      playStoneSlide();
      setIsAnimating(false);
    }, 1500);
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
          letterSpacing: '1px'
        }}>
          TABLERO MATRICIAL 3x3
        </span>

        <button
          onClick={runAnimation}
          disabled={isAnimating}
          style={{
            background: 'linear-gradient(135deg, #D4A843 0%, #9A7725 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#120B02',
            fontSize: '0.7rem',
            fontWeight: '700',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <Play size={12} fill="#120B02" />
          {isAnimating ? 'Moviendo...' : 'Simular Rutina'}
        </button>
      </div>

      {/* Cuadrícula 3x3 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        maxWidth: '220px',
        margin: '0 auto'
      }}>
        {[1, 2, 3].map((r) =>
          [1, 2, 3].map((c) => {
            const isPieceHere = piecePos.r === r && piecePos.c === c;
            const isTargetCell = r === 3 && c === 2;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => {
                  if (onSelectCell) onSelectCell(r, c);
                }}
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: isTargetCell && selectedOptionId === 'opt_a'
                    ? 'rgba(46, 204, 113, 0.25)'
                    : (r + c) % 2 === 0
                    ? '#1A293D'
                    : '#132030',
                  border: isTargetCell
                    ? '2px dashed var(--gold)'
                    : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  left: '4px',
                  fontSize: '0.55rem',
                  color: '#64748B'
                }}>
                  {r},{c}
                </span>

                {isPieceHere && (
                  <motion.div
                    layoutId="boardPiece"
                    transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #F7E396 0%, #D4A843 70%, #876211 100%)',
                      border: '2px solid #FFF',
                      boxShadow: '0 0 12px rgba(212,168,67,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    ♟️
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '8px',
        fontSize: '0.68rem',
        color: '#94A3B8'
      }}>
        Inicio: (1,1) ➔ +2 Filas al Sur ➔ +1 Columna al Este
      </div>
    </div>
  );
}
