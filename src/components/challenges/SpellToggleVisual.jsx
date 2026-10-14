import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Lock, Unlock } from 'lucide-react';
import { playClick } from '../../utils/audio';

export default function SpellToggleVisual({ solActive = true, lunaActive = false, onToggle }) {
  const isUnlocked = solActive && !lunaActive;

  return (
    <div style={{
      backgroundColor: '#0E1726',
      borderRadius: 'var(--radius-md)',
      padding: '16px 12px',
      border: '1px solid rgba(212, 168, 67, 0.3)',
      boxShadow: 'inset 0 0 25px rgba(0,0,0,0.7)',
      marginBottom: '14px'
    }}>
      <div style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--gold-light)',
        fontFamily: 'var(--font-magic)',
        marginBottom: '12px',
        letterSpacing: '1px'
      }}>
        CERRADURA ELEMENTAL DE LAS SOMBRAS
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '8px'
      }}>
        {/* Interruptor Runa SOL */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick();
            if (onToggle) onToggle('sol');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: solActive
              ? 'radial-gradient(circle, #F39C12 0%, #D35400 100%)'
              : '#1E293B',
            border: solActive ? '2px solid #F1C40F' : '1px solid #475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: solActive ? '#FFF' : '#64748B',
            boxShadow: solActive ? '0 0 16px rgba(243, 156, 18, 0.6)' : 'none',
            transition: 'all 0.25s ease'
          }}>
            <Sun size={26} className={solActive ? 'glow-pulse' : ''} />
          </div>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: solActive ? '#F1C40F' : '#64748B'
          }}>
            Runa Sol: {solActive ? 'Activa' : 'Inactiva'}
          </span>
        </motion.div>

        {/* Cerradura Central */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <motion.div
            animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: isUnlocked ? 'var(--emerald)' : '#1E293B',
              border: isUnlocked ? '2px solid var(--success)' : '2px solid var(--crimson)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isUnlocked ? '#FFF' : 'var(--crimson)',
              boxShadow: isUnlocked ? '0 0 15px rgba(46,204,113,0.5)' : 'none'
            }}
          >
            {isUnlocked ? <Unlock size={22} /> : <Lock size={22} />}
          </motion.div>
          <span style={{
            fontSize: '0.62rem',
            color: isUnlocked ? 'var(--success)' : 'var(--crimson)',
            fontWeight: '700'
          }}>
            {isUnlocked ? 'ABIERTA' : 'BLOQUEADA'}
          </span>
        </div>

        {/* Interruptor Runa LUNA */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick();
            if (onToggle) onToggle('luna');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: lunaActive
              ? 'radial-gradient(circle, #34495E 0%, #1A252F 100%)'
              : '#1E293B',
            border: lunaActive ? '2px solid #5DADE2' : '1px solid #475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: lunaActive ? '#5DADE2' : '#64748B',
            boxShadow: lunaActive ? '0 0 12px rgba(93, 173, 226, 0.4)' : 'none',
            transition: 'all 0.25s ease'
          }}>
            <Moon size={24} />
          </div>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: lunaActive ? '#5DADE2' : '#64748B'
          }}>
            Runa Luna: {lunaActive ? 'Activa' : 'Inactiva'}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
