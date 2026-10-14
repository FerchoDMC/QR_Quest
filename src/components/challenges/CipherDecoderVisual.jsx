import React from 'react';
import { motion } from 'framer-motion';

export default function CipherDecoderVisual({ selectedOptionId }) {
  // Tabla criptográfica con orden variado para exigir correlación mental
  const cipherTable = [
    { rune: '◆', letter: 'S' },
    { rune: '▲', letter: 'A' },
    { rune: '●', letter: 'O' },
    { rune: '★', letter: 'D' },
    { rune: '■', letter: 'T' }
  ];

  // El mensaje interceptado a descifrar
  const messageRunes = [
    { rune: '★', letter: 'D' },
    { rune: '▲', letter: 'A' },
    { rune: '■', letter: 'T' },
    { rune: '●', letter: 'O' },
    { rune: '◆', letter: 'S' }
  ];

  const isDecrypted = selectedOptionId === 'opt_a';

  return (
    <div style={{
      backgroundColor: '#0F1826',
      borderRadius: 'var(--radius-md)',
      padding: '14px 10px',
      border: '1px solid rgba(212, 168, 67, 0.3)',
      boxShadow: 'inset 0 0 25px rgba(0,0,0,0.7)',
      marginBottom: '14px'
    }}>
      <div style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--gold-light)',
        fontFamily: 'var(--font-magic)',
        marginBottom: '10px',
        letterSpacing: '1px'
      }}>
        TABLA DE CORRESPONDENCIA CRIPTOGRÁFICA
      </div>

      {/* Clave de Correspondencia */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: '#162234',
        borderRadius: '8px',
        padding: '6px 8px',
        marginBottom: '12px',
        border: '1px dashed rgba(212,168,67,0.3)',
        fontSize: '0.78rem'
      }}>
        {cipherTable.map((item, idx) => (
          <span key={idx} style={{ color: '#E2E8F0' }}>
            <strong style={{ color: 'var(--gold)' }}>{item.rune}</strong> = {item.letter}
          </span>
        ))}
      </div>

      {/* Ranuras del Conjuro Interceptado */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '6px',
        alignItems: 'center'
      }}>
        {messageRunes.map((item, idx) => (
          <motion.div
            key={idx}
            animate={isDecrypted ? { rotateY: [0, 180, 360] } : {}}
            transition={{ delay: idx * 0.12, duration: 0.5 }}
            style={{
              width: '40px',
              height: '46px',
              borderRadius: '8px',
              backgroundColor: isDecrypted ? 'rgba(46, 204, 113, 0.2)' : '#1A293D',
              border: isDecrypted ? '2px solid var(--success)' : '1px solid var(--gold)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDecrypted ? '0 0 10px rgba(46,204,113,0.5)' : 'none'
            }}
          >
            <span style={{
              fontSize: '1.15rem',
              color: isDecrypted ? 'var(--success)' : 'var(--gold-light)',
              fontWeight: 'bold'
            }}>
              {isDecrypted ? item.letter : item.rune}
            </span>
            <span style={{ fontSize: '0.55rem', color: '#64748B' }}>
              {isDecrypted ? item.rune : `Runa ${idx + 1}`}
            </span>
          </motion.div>
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: '0.68rem',
        color: isDecrypted ? 'var(--success)' : '#94A3B8',
        marginTop: '8px',
        fontWeight: isDecrypted ? '700' : '400'
      }}>
        {isDecrypted ? '✨ ¡Mensaje descifrado: D-A-T-O-S!' : 'Cruza los símbolos de la clave para formar la palabra secreta'}
      </div>
    </div>
  );
}
