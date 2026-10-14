import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import { playSparkle, playClick } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export default function StickerScreen({ session, onResetGame }) {
  const code = (session.id || 'TI-QUEST').slice(-6).toUpperCase();

  const handleRestart = () => {
    playClick();
    triggerHaptic('light');
    onResetGame();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
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
      <div style={{ width: '100%' }}>
        <p style={{
          fontFamily: 'var(--font-magic)',
          color: 'var(--gold-light)',
          fontSize: '0.85rem',
          letterSpacing: '1px',
          marginBottom: '4px'
        }}>
          VALIDACIÓN PRESENCIAL
        </p>

        <h2 className="magic-title" style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
          ¡Reclama tu Sticker!
        </h2>

        {/* Certificado Pergamino para mostrar al Staff */}
        <div className="parchment-card" style={{
          padding: '26px 20px',
          marginBottom: '20px',
          border: '3px solid var(--gold)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5), inset 0 0 30px rgba(212, 168, 67, 0.2)'
        }}>
          {/* Sello Dorado Central */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #F7E396 0%, #D4A843 50%, #9A7725 100%)',
            border: '3px solid #FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 4px 15px rgba(212, 168, 67, 0.5)'
          }}>
            <Award size={36} color="#4A3405" />
          </div>

          <p style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '0.85rem',
            color: 'var(--crimson)',
            letterSpacing: '0.5px',
            marginBottom: '6px'
          }}>
            CERTIFICADO DE MÉRITO EN TI
          </p>

          <h3 style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '1.5rem',
            color: 'var(--text-parchment)',
            marginBottom: '8px',
            textDecoration: 'underline',
            textDecorationColor: 'var(--gold)'
          }}>
            {session.name}
          </h3>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-parchment-muted)',
            lineHeight: '1.4',
            marginBottom: '16px'
          }}>
            Ha superado con distinción las pruebas lógicas y mágicas de la carrera de Tecnologías de la Información.
          </p>

          {/* Código de Verificación para el Staff */}
          <div style={{
            backgroundColor: '#EDE0C4',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px dashed var(--crimson)',
            display: 'inline-flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)', fontWeight: '600' }}>
              CÓDIGO DE VALIDACIÓN
            </span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              fontWeight: '900',
              letterSpacing: '2px',
              color: 'var(--crimson)'
            }}>
              TI-{code}
            </span>
          </div>

          <div style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--emerald)',
            fontWeight: '700',
            fontSize: '0.85rem'
          }}>
            <CheckCircle size={18} />
            Misión Completada al 100%
          </div>
        </div>

        {/* Instrucción para el participante */}
        <div style={{
          backgroundColor: 'rgba(212, 168, 67, 0.12)',
          border: '1px solid rgba(212, 168, 67, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          color: 'var(--gold-light)',
          fontSize: '0.85rem',
          lineHeight: '1.4'
        }}>
          👉 <strong>Muestra esta pantalla al estudiante encargado del stand</strong> para que verifique tu código y te entregue el sticker oficial.
        </div>
      </div>

      {/* Botón de reiniciar para siguiente jugador */}
      <button
        onClick={handleRestart}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          marginTop: '20px',
          padding: '8px 12px'
        }}
      >
        <RotateCcw size={14} />
        Jugar otra partida (Nuevo Participante)
      </button>
    </motion.div>
  );
}
