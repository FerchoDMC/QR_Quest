import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Feather, Sparkles, ArrowLeft } from 'lucide-react';
import { playSparkle, playClick } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export default function NameRegisterScreen({ onSubmitName, onBack }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Por favor dinos tu nombre para inscribirte en el libro mágico.');
      triggerHaptic('error');
      return;
    }
    if (cleanName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      triggerHaptic('error');
      return;
    }

    playSparkle();
    triggerHaptic('magic');
    onSubmitName(cleanName);
  };

  const handleBack = () => {
    playClick();
    triggerHaptic('light');
    if (onBack) onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px 20px',
        minHeight: '100%',
        position: 'relative'
      }}
    >
      {onBack && (
        <button
          onClick={handleBack}
          style={{
            position: 'absolute',
            top: '12px',
            left: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--gold-light)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: 'rgba(22, 36, 56, 0.6)'
          }}
        >
          <ArrowLeft size={14} />
          <span>Volver</span>
        </button>
      )}

      <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '16px' }}>
        <motion.div
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{ display: 'inline-block', marginBottom: '12px' }}
        >
          <div className="wax-seal">
            <Feather size={24} color="var(--gold-light)" />
          </div>
        </motion.div>

        <h2 className="magic-title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
          El Gran Libro de TI
        </h2>
        <p style={{ color: 'var(--gold-light)', fontSize: '0.92rem', fontFamily: 'var(--font-serif)' }}>
          Inscribe tu nombre para recibir tu asignación de desafíos y recursos mágicos.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="parchment-card" style={{ padding: '24px 20px', marginBottom: '24px' }}>
          <label
            htmlFor="wizard-name"
            style={{
              display: 'block',
              fontFamily: 'var(--font-magic)',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--crimson)',
              marginBottom: '10px'
            }}
          >
            ¿CÓMO TE LLAMAS, MAGO?
          </label>

          <input
            id="wizard-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Escribe tu nombre aquí..."
            autoFocus
            maxLength={35}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '1.1rem',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-parchment)',
              backgroundColor: '#FFFBF2',
              border: '2px solid var(--border-parchment)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
            }}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: 'var(--crimson)',
                fontSize: '0.82rem',
                marginTop: '10px',
                fontWeight: '600'
              }}
            >
              ⚠️ {error}
            </motion.p>
          )}

          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-parchment-muted)',
            marginTop: '12px',
            fontStyle: 'italic'
          }}>
            * No solicitamos contraseña, correo ni carnet. Solo tu nombre para la pantalla del sticker.
          </p>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-magic"
          style={{ width: '100%', padding: '16px 20px' }}
        >
          <Sparkles size={18} />
          Sellar Inscripción
        </motion.button>
      </form>
    </motion.div>
  );
}
