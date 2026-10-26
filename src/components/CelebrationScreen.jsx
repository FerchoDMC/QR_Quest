import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { playSuccess, playClick } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export default function CelebrationScreen({ session, onDiscoverAreas }) {
  useEffect(() => {
    playSuccess();
    triggerHaptic('success');

    // Lluvia mágica de confeti dorado y granate
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 30,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#D4A843', '#F7E396', '#7E121D', '#FFFFFF']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    playClick();
    triggerHaptic('light');
    onDiscoverAreas();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 20px',
        minHeight: '100%',
        textAlign: 'center'
      }}
    >
      <div>
        {/* Trofeo / Copa mágica */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ marginBottom: '14px' }}
        >
          <div className="wax-seal glow-pulse" style={{ width: '64px', height: '64px', margin: '0 auto' }}>
            <Trophy size={30} color="var(--gold-light)" />
          </div>
        </motion.div>

        <h2 className="magic-title" style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
          ¡Misión Cumplida, {session.name}!
        </h2>

        <div style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(212, 168, 67, 0.15)',
          border: '1px solid var(--gold)',
          borderRadius: '16px',
          padding: '10px 22px',
          marginBottom: '14px'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            PUNTUACIÓN OBTENIDA
          </span>
          <span style={{
            fontSize: '1.6rem',
            fontFamily: 'var(--font-magic)',
            fontWeight: '900',
            color: 'var(--gold-light)'
          }}>
            {session.totalScore || 0} / 500 pts
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: (session.totalScore || 0) >= 350 ? 'var(--success)' : 'var(--amber)'
          }}>
            {(session.totalScore || 0) >= 350 
              ? '✨ ¡Apto para Pegatina Oficial (≥ 350 pts)!' 
              : '📖 Entrenamiento Formativo (< 350 pts)'}
          </span>
        </div>

        <p style={{
          color: 'var(--gold-light)',
          fontFamily: 'var(--font-serif)',
          fontSize: '0.92rem',
          fontStyle: 'italic',
          marginBottom: '16px'
        }}>
          Has completado los 5 desafíos del Grimorio de Tecnologías de la Información.
        </p>

        {/* Mensaje de revelación pedagógica */}
        <div className="parchment-card" style={{ padding: '22px 18px', textAlign: 'left', marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--crimson)',
            fontFamily: 'var(--font-magic)',
            fontSize: '0.95rem',
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            <Sparkles size={18} />
            LA GRAN REVELACIÓN
          </div>

          <p style={{
            fontSize: '1.05rem',
            fontWeight: '700',
            color: 'var(--text-parchment)',
            marginBottom: '10px',
            fontFamily: 'var(--font-serif)',
            lineHeight: '1.4'
          }}>
            "Acabas de programar sin darte cuenta."
          </p>

          <p style={{
            fontSize: '0.88rem',
            lineHeight: '1.5',
            color: 'var(--text-parchment-muted)',
            marginBottom: '10px'
          }}>
            Cada desafío que resolviste no fue magia ordinaria: fue <strong>pensamiento computacional</strong>.
          </p>

          <ul style={{
            fontSize: '0.84rem',
            color: 'var(--text-parchment)',
            paddingLeft: '18px',
            lineHeight: '1.45',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <li>Descifraste <strong>patrones</strong> como lo hace la Inteligencia Artificial.</li>
            <li>Aplicaste <strong>reglas condicionales</strong> como cualquier software moderno.</li>
            <li>Estructuraste <strong>algoritmos y datos</strong> como un ingeniero de TI.</li>
          </ul>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleNext}
        className="btn-magic"
        style={{ width: '100%', padding: '16px' }}
      >
        <Sparkles size={18} />
        Descubre las Áreas de TI
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}
