import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Scroll } from 'lucide-react';
import { playSparkle, playClick } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export default function WelcomeScreen({ onStart }) {
  const handleStart = () => {
    playSparkle();
    triggerHaptic('magic');
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        minHeight: '100%',
        textAlign: 'center'
      }}
    >
      {/* Sello de Hogwarts superior */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, delay: 0.1 }}
        style={{ marginBottom: '16px' }}
      >
        <div className="wax-seal glow-pulse">
          TI
        </div>
      </motion.div>

      {/* Título Épico */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="magic-title"
        style={{
          fontSize: '1.65rem',
          lineHeight: '1.25',
          marginBottom: '8px'
        }}
      >
        El Desafío Mágico de TI
      </motion.h1>

      <p style={{
        color: 'var(--gold-light)',
        fontFamily: 'var(--font-serif)',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        marginBottom: '20px'
      }}>
        Feria de Bienvenida Universitaria · Facultad de Ingeniería
      </p>

      {/* Carta de Aceptación en Pergamino */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="parchment-card"
        style={{
          padding: '22px 18px',
          marginBottom: '26px',
          textAlign: 'left',
          width: '100%',
          fontSize: '0.92rem',
          lineHeight: '1.55'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          color: 'var(--crimson)',
          fontWeight: '700',
          fontFamily: 'var(--font-magic)',
          fontSize: '0.85rem',
          letterSpacing: '0.5px'
        }}>
          <Scroll size={16} />
          CONVOCATORIA EXTRAORDINARIA
        </div>

        <p style={{ marginBottom: '10px' }}>
          Estimado/a aspirante:
        </p>
        <p style={{ marginBottom: '10px' }}>
          Has sido seleccionado/a para poner a prueba tu ingenio ante los <strong>3 misterios de la carrera de Tecnologías de la Información</strong>.
        </p>
        <p style={{ marginBottom: '10px' }}>
          Al registrarte, el Sombrero Seleccionador te otorgará <strong>recursos mágicos (comodines)</strong> para apoyarte en tu misión.
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--text-parchment-muted)', fontSize: '0.86rem' }}>
          No necesitas experiencia previa en computación. Solo observación, lógica y astucia.
        </p>
      </motion.div>

      {/* Botón de inicio */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleStart}
        className="btn-magic"
        style={{ width: '100%', padding: '16px 20px', fontSize: '1.05rem' }}
      >
        <Wand2 size={20} />
        Aceptar Convocatoria
      </motion.button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '16px',
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
      }}>
        <Sparkles size={14} color="var(--gold)" />
        Duración estimada: 3 a 5 minutos
      </div>
    </motion.div>
  );
}
