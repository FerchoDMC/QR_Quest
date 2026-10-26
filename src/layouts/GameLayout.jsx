import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function GameLayout() {
  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-deep)',
      background: 'radial-gradient(circle at 50% 20%, #15253B 0%, #080D14 100%)',
      padding: '12px 0',
      position: 'relative'
    }}>
      {/* Botón flotante para regresar al portal institucional */}
      <header style={{
        width: '100%',
        maxWidth: '440px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50
      }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--gold-light)',
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'rgba(22, 36, 56, 0.7)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(212, 168, 67, 0.3)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={14} />
          <span>Portal UIDE</span>
        </Link>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <Sparkles size={13} color="var(--gold)" />
          <span>Feria de TI 2026</span>
        </div>
      </header>

      {/* Contenedor Mágico del Juego */}
      <div className="app-container" style={{ margin: '0 auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
