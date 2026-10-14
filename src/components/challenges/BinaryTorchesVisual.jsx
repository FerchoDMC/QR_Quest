import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { playTorchIgnite } from '../../utils/audio';

export default function BinaryTorchesVisual({ selectedOptionId }) {
  // Estado inicial: 8 (off), 4 (on), 2 (on), 1 (off) -> 0 1 1 0 (6)
  const [torches, setTorches] = useState([
    { id: '8', value: 8, isOn: false, label: 'Gema 8' },
    { id: '4', value: 4, isOn: true, label: 'Gema 4' },
    { id: '2', value: 2, isOn: true, label: 'Gema 2' },
    { id: '1', value: 1, isOn: false, label: 'Gema 1' }
  ]);

  const toggleTorch = (idx) => {
    playTorchIgnite();
    const updated = [...torches];
    updated[idx].isOn = !updated[idx].isOn;
    setTorches(updated);
  };

  const binaryString = torches.map(t => t.isOn ? '1' : '0').join(' ');

  return (
    <div style={{
      backgroundColor: '#0E1724',
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
        ANTORCHAS BINARIAS (POTENCIAS DE 2)
      </div>

      {/* 4 Antorchas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginBottom: '12px'
      }}>
        {torches.map((torch, idx) => (
          <motion.div
            key={torch.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleTorch(idx)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {/* Llama mágica */}
            <div style={{ height: '32px', display: 'flex', alignItems: 'center' }}>
              {torch.isOn ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 0.9, 1.15], y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{
                    color: '#E67E22',
                    filter: 'drop-shadow(0 0 10px #F39C12)'
                  }}
                >
                  <Flame size={28} fill="#F39C12" />
                </motion.div>
              ) : (
                <div style={{ width: '6px', height: '12px', backgroundColor: '#334155', borderRadius: '2px' }} />
              )}
            </div>

            {/* Soporte de la antorcha */}
            <div style={{
              width: '16px',
              height: '34px',
              backgroundColor: '#5C3814',
              borderRadius: '3px',
              border: '1px solid #8B5A2B',
              boxShadow: '0 4px 8px rgba(0,0,0,0.6)'
            }} />

            {/* Etiqueta de valor binario y valor de la posición */}
            <div style={{
              marginTop: '6px',
              backgroundColor: torch.isOn ? 'rgba(243, 156, 18, 0.2)' : '#1E293B',
              border: torch.isOn ? '1px solid #F39C12' : '1px solid #475569',
              borderRadius: '6px',
              padding: '2px 6px',
              textAlign: 'center',
              minWidth: '40px'
            }}>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: '900',
                color: torch.isOn ? '#F1C40F' : '#64748B'
              }}>
                {torch.isOn ? '1' : '0'}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#CBD5E1', display: 'block' }}>
                Peso: {torch.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visor de Estado Binario */}
      <div style={{
        backgroundColor: '#162335',
        borderRadius: '8px',
        padding: '8px',
        textAlign: 'center',
        border: '1px dashed var(--gold)',
        fontSize: '0.8rem'
      }}>
        <span style={{ color: '#94A3B8' }}>Código Binario Activo: </span>
        <strong style={{ color: 'var(--gold-light)', letterSpacing: '3px', fontSize: '0.95rem' }}>
          {binaryString}
        </strong>
      </div>
    </div>
  );
}
