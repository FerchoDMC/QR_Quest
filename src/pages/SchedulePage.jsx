import React from 'react';
import { Calendar, Sparkles, Bell } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '50px 24px 80px' }}>
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          backgroundColor: 'rgba(212, 168, 67, 0.1)',
          border: '1px solid rgba(212, 168, 67, 0.3)',
          color: 'var(--gold-light)',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          <Calendar size={16} />
          <span>AGENDA ACADÉMICA · CICLO 2026</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-magic)',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          color: '#FFF',
          marginBottom: '14px'
        }}>
          Cronograma de Actividades de TI
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-muted)',
          maxWidth: '740px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Espacio oficial para la publicación de conferencias, talleres y actividades de la carrera de Ingeniería en Tecnologías de la Información.
        </p>
      </div>

      {/* ESTADO VACÍO ELEGANTE (SIN ESPECULACIONES) */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        borderRadius: '24px',
        backgroundColor: 'var(--bg-card)',
        border: '2px solid rgba(212, 168, 67, 0.3)',
        padding: '52px 32px',
        textAlign: 'center',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Brillo mágico de fondo */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 168, 67, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Icono Central */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          backgroundColor: 'rgba(212, 168, 67, 0.12)',
          border: '2px solid var(--gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 0 25px rgba(212, 168, 67, 0.3)'
        }}>
          <Sparkles size={38} color="var(--gold-light)" />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-magic)',
          fontSize: '1.5rem',
          color: '#FFF',
          marginBottom: '14px'
        }}>
          El Cronograma de Actividades está en Preparación
        </h2>

        <p style={{
          fontSize: '0.96rem',
          color: 'var(--text-muted)',
          lineHeight: '1.65',
          marginBottom: '28px',
          maxWidth: '560px',
          margin: '0 auto 28px'
        }}>
          El calendario oficial de actividades académicas se encuentra en proceso de coordinación. Tan pronto como las fechas y detalles sean aprobados formalmente, se publicarán directamente en esta sección.
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.84rem',
          color: 'var(--gold-light)'
        }}>
          <Bell size={15} color="var(--gold)" />
          <span>Información sujeta a confirmación en los canales oficiales de la carrera</span>
        </div>
      </div>
    </div>
  );
}
