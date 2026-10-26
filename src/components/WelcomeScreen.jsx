import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Scroll } from 'lucide-react';
import { playSparkle } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import escudoImg from '../assets/escudo2.jpg';

export default function WelcomeScreen({ onStart, onTestLoader }) {
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
      {/* Escudo Oficial del Departamento de Misterios de TI */}
      <motion.div
        initial={{ scale: 0, rotate: -6 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, delay: 0.1 }}
        style={{ marginBottom: '16px' }}
      >
        <img
          src={escudoImg}
          alt="Escudo Departamento de Misterios de TI"
          style={{
            width: '135px',
            height: 'auto',
            borderRadius: '16px',
            border: '2px solid rgba(212, 168, 67, 0.5)',
            boxShadow: '0 0 30px rgba(212, 168, 67, 0.4), 0 8px 25px rgba(0,0,0,0.7)',
            objectFit: 'contain'
          }}
        />
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
        justifyContent: 'center',
        gap: '12px',
        marginTop: '16px',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="var(--gold)" />
          Duración estimada: 3 a 5 minutos
        </span>

        {onTestLoader && (
          <button
            onClick={onTestLoader}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-light)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.78rem',
              opacity: 0.8
            }}
          >
            🔮 Probar animación de carga
          </button>
        )}
      </div>
    </motion.div>
  );
}
