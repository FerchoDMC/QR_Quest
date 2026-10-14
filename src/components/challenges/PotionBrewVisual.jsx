import React from 'react';
import { motion } from 'framer-motion';
import { playPotionPour } from '../../utils/audio';

export default function PotionBrewVisual({ selectedOptionId, onSelectPotion }) {
  const potions = [
    {
      id: 'opt_a',
      name: 'Verde',
      color: '#2ECC71',
      glow: 'rgba(46, 204, 113, 0.4)',
      hasSteam: false,
      bubbles: true,
      tag: 'Burbujas doradas'
    },
    {
      id: 'opt_b',
      name: 'Azul',
      color: '#3498DB',
      glow: 'rgba(52, 152, 219, 0.4)',
      hasSteam: true,
      bubbles: true,
      tag: 'Veneno basilisco'
    },
    {
      id: 'opt_c',
      name: 'Púrpura',
      color: '#9B59B6',
      glow: 'rgba(155, 89, 182, 0.6)',
      hasSteam: true, // Vapor plateado
      bubbles: true,
      tag: '✨ Vapor plateado'
    },
    {
      id: 'opt_d',
      name: 'Ámbar',
      color: '#E67E22',
      glow: 'rgba(230, 126, 34, 0.3)',
      hasSteam: false,
      bubbles: false,
      tag: 'Sin vapor'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#0F1A2A',
      borderRadius: 'var(--radius-md)',
      padding: '16px 10px',
      border: '1px solid rgba(212, 168, 67, 0.3)',
      boxShadow: 'inset 0 0 25px rgba(0,0,0,0.7)',
      marginBottom: '14px',
      position: 'relative'
    }}>
      <div style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--gold-light)',
        fontFamily: 'var(--font-magic)',
        marginBottom: '12px',
        letterSpacing: '1px'
      }}>
        MESA ALQUÍMICA & CALDERO
      </div>

      {/* 4 Frascos de Pociones */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginBottom: '16px',
        gap: '6px'
      }}>
        {potions.map((potion) => {
          const isSelected = selectedOptionId === potion.id;

          return (
            <motion.div
              key={potion.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                playPotionPour();
                if (onSelectPotion) onSelectPotion(potion.id);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              {/* Animación de Vapor Plateado si tiene steam */}
              <div style={{ height: '22px', display: 'flex', justifyContent: 'center' }}>
                {potion.hasSteam && (
                  <motion.div
                    animate={{
                      y: [0, -10, -16],
                      opacity: [0.2, 0.8, 0],
                      scale: [0.8, 1.2, 1.5]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: 'easeOut'
                    }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: potion.id === 'opt_c' ? '#E0E6ED' : potion.color,
                      boxShadow: '0 0 8px #FFF'
                    }}
                  />
                )}
              </div>

              {/* Botella de cristal con líquido */}
              <motion.div
                animate={isSelected ? { y: -6, rotate: [0, -10, 10, 0] } : {}}
                style={{
                  width: '38px',
                  height: '52px',
                  borderRadius: '10px 10px 6px 6px',
                  border: isSelected ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  boxShadow: isSelected ? `0 0 15px ${potion.glow}` : '0 4px 8px rgba(0,0,0,0.5)'
                }}
              >
                {/* Cuello del frasco con tapón de corcho */}
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '11px',
                  width: '14px',
                  height: '8px',
                  backgroundColor: '#8B5A2B',
                  borderRadius: '2px'
                }} />

                {/* Líquido mágico interior */}
                <motion.div
                  animate={{ height: ['65%', '70%', '65%'] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  style={{
                    width: '100%',
                    backgroundColor: potion.color,
                    opacity: 0.85,
                    boxShadow: `inset 0 0 10px rgba(0,0,0,0.4), 0 0 8px ${potion.glow}`
                  }}
                />
              </motion.div>

              <span style={{
                fontSize: '0.65rem',
                color: isSelected ? 'var(--gold-light)' : '#A0B2C6',
                fontWeight: isSelected ? '700' : '400',
                marginTop: '6px',
                textAlign: 'center',
                lineHeight: '1.1'
              }}>
                {potion.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Caldero Central de Alquimia */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: '1px dashed rgba(212,168,67,0.2)',
        paddingTop: '8px'
      }}>
        <div style={{
          width: '74px',
          height: '42px',
          backgroundColor: '#1B2430',
          borderRadius: '0 0 35px 35px',
          border: '2px solid #334155',
          boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.5)',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Fuego bajo el caldero */}
          <motion.div
            animate={{ scaleY: [1, 1.25, 0.95, 1.15] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{
              position: 'absolute',
              bottom: '-10px',
              width: '40px',
              height: '10px',
              background: 'radial-gradient(circle, #E74C3C 0%, #F39C12 70%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />

          {/* Vapor o líquido del caldero */}
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              width: '54px',
              height: '14px',
              backgroundColor: selectedOptionId === 'opt_c' ? '#D4A843' : 'rgba(212,168,67,0.3)',
              borderRadius: '50%',
              boxShadow: '0 0 10px var(--gold)'
            }}
          />
        </div>
        <span style={{ fontSize: '0.65rem', color: '#8899A6', marginTop: '4px' }}>
          Caldero encantado de Hogwarts
        </span>
      </div>
    </div>
  );
}
