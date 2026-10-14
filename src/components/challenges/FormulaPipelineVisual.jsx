import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function FormulaPipelineVisual({ selectedOptionId }) {
  const steps = [
    { num: 1, title: 'Pesar', icon: '⚖️', color: '#2ECC71' },
    { num: 2, title: 'Disolver', icon: '🥣', color: '#3498DB' },
    { num: 3, title: 'Hervir', icon: '🔥', color: '#E67E22' },
    { num: 4, title: 'Decantar', icon: '🏆', color: '#F1C40F' }
  ];

  const isSuccess = selectedOptionId === 'opt_a';

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
        PIPELINE DE TRANSMUTACIÓN (DEPENDENCIAS)
      </div>

      {/* 4 Pasos del Flujo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4px'
      }}>
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <motion.div
              animate={isSuccess ? { scale: [1, 1.1, 1] } : {}}
              transition={{ delay: idx * 0.15 }}
              style={{
                flex: 1,
                backgroundColor: isSuccess ? 'rgba(46, 204, 113, 0.15)' : '#182436',
                border: isSuccess ? '1px solid var(--success)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '6px 2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{step.icon}</span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: '700',
                color: isSuccess ? 'var(--success)' : '#CBD5E1',
                textAlign: 'center'
              }}>
                {step.title}
              </span>
            </motion.div>

            {idx < steps.length - 1 && (
              <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>➔</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{
        marginTop: '10px',
        backgroundColor: '#162335',
        borderRadius: '6px',
        padding: '6px 8px',
        textAlign: 'center',
        fontSize: '0.68rem',
        color: isSuccess ? 'var(--success)' : '#94A3B8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
      }}>
        {isSuccess ? (
          <>
            <CheckCircle2 size={13} color="var(--success)" />
            ¡Secuencia válida! Todas las dependencias han sido resueltas en orden.
          </>
        ) : (
          'Evalúa qué tarea es la única que no depende de ninguna otra'
        )}
      </div>
    </div>
  );
}
