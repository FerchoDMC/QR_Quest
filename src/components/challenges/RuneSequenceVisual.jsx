import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function RuneSequenceVisual({ selectedOptionId }) {
  const runes = [
    { glyph: '▲', color: '#E5A93C' },
    { glyph: '■', color: '#D4A843' },
    { glyph: '⬟', color: '#F7E396' },
    { glyph: '⬡', color: '#D4A843' },
  ];

  return (
    <div style={{
      backgroundColor: '#121F33',
      borderRadius: 'var(--radius-md)',
      padding: '16px 12px',
      border: '1px solid rgba(212, 168, 67, 0.3)',
      boxShadow: 'inset 0 0 25px rgba(0,0,0,0.6)',
      marginBottom: '14px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--gold-light)',
        fontFamily: 'var(--font-magic)',
        marginBottom: '10px',
        letterSpacing: '1px'
      }}>
        ALTAR RÚNICO DE PATRONES
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '6px'
      }}>
        {runes.map((rune, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 + idx * 0.3, ease: 'easeInOut' }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1C2D44 0%, #0F1A2A 100%)',
                border: '1px solid var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                color: rune.color,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 10px rgba(212,168,67,0.2)',
                textShadow: '0 0 8px rgba(212,168,67,0.6)'
              }}
            >
              {rune.glyph}
            </motion.div>
          </motion.div>
        ))}

        {/* Flecha de progresión */}
        <div style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: 'bold' }}>➔</div>

        {/* 5º Pedestal (Faltante con vórtice) */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              border: '2px dashed var(--gold)',
              background: selectedOptionId 
                ? 'radial-gradient(circle, rgba(212,168,67,0.3) 0%, rgba(18,31,51,0.8) 100%)'
                : 'radial-gradient(circle, rgba(212,168,67,0.15) 0%, rgba(18,31,51,0.5) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-light)',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              boxShadow: '0 0 15px rgba(212,168,67,0.35)',
              position: 'relative'
            }}
          >
            {selectedOptionId === 'opt_b' ? (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring' }}
              >
                ⭐
              </motion.span>
            ) : (
              <Sparkles size={20} className="glow-pulse" />
            )}
          </div>
        </motion.div>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '10px',
        fontSize: '0.68rem',
        color: '#94A3B8'
      }}>
        Identifica la regla oculta entre las figuras para deducir la siguiente
      </div>
    </div>
  );
}
