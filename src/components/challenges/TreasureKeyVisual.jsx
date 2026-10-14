import React from 'react';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';
import { playKeyTurn } from '../../utils/audio';

export default function TreasureKeyVisual({ selectedOptionId, onSelectKey }) {
  const keys = [
    {
      id: 'opt_a',
      name: 'Hierro',
      desc: 'Forja rústica',
      color: '#95A5A6',
      icon: '🗝️',
      glow: 'rgba(149, 165, 166, 0.4)'
    },
    {
      id: 'opt_b',
      name: 'Silicio',
      desc: 'Pulsos digitales',
      color: '#00D2D3',
      icon: '⚡',
      glow: 'rgba(0, 210, 211, 0.6)',
      isCorrect: true
    },
    {
      id: 'opt_c',
      name: 'Cristal',
      desc: 'Prisma de cuarzo',
      color: '#E056FD',
      icon: '💎',
      glow: 'rgba(224, 86, 253, 0.4)'
    },
    {
      id: 'opt_d',
      name: 'Roble',
      desc: 'Madera vetusta',
      color: '#F0932B',
      icon: '🌿',
      glow: 'rgba(240, 147, 43, 0.4)'
    }
  ];

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
        EL COFRE DE LOS SECRETOS
      </div>

      {/* Cofre Mágico Central */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <motion.div
          animate={selectedOptionId === 'opt_b' ? { scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] } : {}}
          transition={{ duration: 0.6 }}
          style={{
            width: '64px',
            height: '46px',
            background: 'linear-gradient(135deg, #7A5318 0%, #462F0D 100%)',
            border: '2px solid var(--gold)',
            borderRadius: '10px 10px 6px 6px',
            boxShadow: '0 6px 14px rgba(0,0,0,0.6)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Cerradura */}
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: selectedOptionId === 'opt_b' ? '#00D2D3' : '#1A1207',
            border: '2px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: selectedOptionId === 'opt_b' ? '0 0 10px #00D2D3' : 'none'
          }}>
            <Key size={10} color={selectedOptionId === 'opt_b' ? '#08141F' : 'var(--gold)'} />
          </div>
        </motion.div>
      </div>

      {/* 4 Llaves Suspendidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px'
      }}>
        {keys.map((k) => {
          const isSelected = selectedOptionId === k.id;

          return (
            <motion.div
              key={k.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playKeyTurn();
                if (onSelectKey) onSelectKey(k.id);
              }}
              style={{
                backgroundColor: isSelected ? 'rgba(212,168,67,0.18)' : '#182538',
                border: isSelected ? `2px solid ${k.color}` : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: isSelected ? `0 0 12px ${k.glow}` : 'none'
              }}
            >
              <motion.div
                animate={isSelected ? { rotate: [0, 360] } : { y: [0, -2, 0] }}
                transition={isSelected ? { duration: 0.5 } : { repeat: Infinity, duration: 2.5 }}
                style={{ fontSize: '1.2rem', marginBottom: '2px' }}
              >
                {k.icon}
              </motion.div>

              <span style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                color: k.color,
                textAlign: 'center',
                lineHeight: '1.1'
              }}>
                {k.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
