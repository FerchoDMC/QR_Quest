import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import escudoImg from '../assets/escudo2.jpg';

const DEFAULT_MESSAGES = [
  'Canalizando sabiduría ancestral de TI...',
  'Invocando los secretos del Departamento de Misterios...',
  'Descifrando pergaminos binarios y algoritmos...',
  'Preparando las runas del conocimiento...'
];

export default function ShieldLoader({
  message,
  subtitle = 'Departamento de Misterios · Carrera de TI',
  size = 'md',
  fullScreen = true,
  onComplete = null,
  duration = null // si se especifica en ms, se auto-completa
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotar mensajes mágicos cada 2.2 segundos
  useEffect(() => {
    if (message) return; // Si hay mensaje fijo, no rotar
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [message]);

  // Si tiene duración predefinida, disparar callback
  useEffect(() => {
    if (!duration || !onComplete) return;
    const timer = setTimeout(() => {
      onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // Tamaños del escudo
  const dimensions = {
    sm: { shield: 80, ring: 130, font: '0.9rem' },
    md: { shield: 110, ring: 175, font: '1.05rem' },
    lg: { shield: 140, ring: 220, font: '1.2rem' }
  }[size] || { shield: 110, ring: 175, font: '1.05rem' };

  const currentText = message || DEFAULT_MESSAGES[messageIndex];

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '28px 20px',
      maxWidth: '460px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Contenedor del Escudo con Anillos Mágicos Concéntricos */}
      <div style={{
        position: 'relative',
        width: `${dimensions.ring}px`,
        height: `${dimensions.ring}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '28px'
      }}>
        {/* Halo de luz mística pulsante */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.75, 0.35]
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            width: `${dimensions.ring * 1.1}px`,
            height: `${dimensions.ring * 1.1}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 168, 67, 0.45) 0%, rgba(126, 18, 29, 0.25) 45%, transparent 70%)',
            filter: 'blur(16px)',
            pointerEvents: 'none'
          }}
        />

        {/* Anillo exterior que gira en sentido horario con marcas rúnicas */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
          viewBox="0 0 200 200"
        >
          {/* Círculo guía exterior */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="rgba(212, 168, 67, 0.2)"
            strokeWidth="1.5"
          />
          {/* Segmentos de runas doradas */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="var(--gold-light)"
            strokeWidth="2.5"
            strokeDasharray="14 18 6 18 22 14"
            strokeLinecap="round"
            filter="drop-shadow(0 0 4px rgba(212, 168, 67, 0.8))"
          />
          {/* 4 Glifos cardinales */}
          <circle cx="100" cy="8" r="3.5" fill="var(--gold-light)" />
          <circle cx="192" cy="100" r="3.5" fill="var(--gold-light)" />
          <circle cx="100" cy="192" r="3.5" fill="var(--gold-light)" />
          <circle cx="8" cy="100" r="3.5" fill="var(--gold-light)" />
        </motion.svg>

        {/* Anillo interior que gira en sentido antihorario */}
        <motion.svg
          animate={{ rotate: -360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: `${dimensions.ring * 0.82}px`,
            height: `${dimensions.ring * 0.82}px`,
            pointerEvents: 'none'
          }}
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="rgba(212, 168, 67, 0.3)"
            strokeWidth="1.5"
            strokeDasharray="8 10"
          />
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke="rgba(255, 215, 0, 0.5)"
            strokeWidth="1"
            strokeDasharray="2 14"
          />
        </motion.svg>

        {/* Escudo central con respiración mística */}
        <motion.div
          animate={{
            scale: [0.97, 1.04, 0.97],
            y: [-3, 3, -3]
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            position: 'relative',
            width: `${dimensions.shield}px`,
            height: `${dimensions.shield}px`,
            borderRadius: '20px',
            overflow: 'hidden',
            border: '2px solid var(--gold)',
            boxShadow: '0 0 25px rgba(212, 168, 67, 0.55), 0 8px 30px rgba(0,0,0,0.8)',
            backgroundColor: '#080D14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          <img
            src={escudoImg}
            alt="Escudo Departamento de Misterios TI"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Destello de luz sobre el escudo */}
          <motion.div
            animate={{
              x: ['-120%', '150%']
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '40%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none'
            }}
          />
        </motion.div>
      </div>

      {/* Subtítulo Institucional */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.76rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--gold)',
        marginBottom: '10px'
      }}>
        <Sparkles size={13} color="var(--gold-light)" />
        <span>{subtitle}</span>
      </div>

      {/* Mensaje de Carga Dinámico */}
      <div style={{ minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            style={{
              fontFamily: 'var(--font-magic)',
              fontSize: dimensions.font,
              color: '#FFF',
              margin: 0,
              lineHeight: '1.4',
              textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(212, 168, 67, 0.4)'
            }}
          >
            {currentText}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Barra de progreso mágico animada */}
      <div style={{
        width: '180px',
        height: '4px',
        borderRadius: '3px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginTop: '18px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <motion.div
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            width: '60%',
            height: '100%',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, transparent 0%, var(--gold) 50%, var(--gold-light) 75%, transparent 100%)',
            boxShadow: '0 0 10px var(--gold)'
          }}
        />
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(8, 13, 20, 0.94)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh'
      }}
    >
      {content}
    </motion.div>
  );
}
