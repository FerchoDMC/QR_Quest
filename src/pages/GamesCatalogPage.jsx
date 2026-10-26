import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Gamepad2, ArrowRight, CheckCircle2, Clock
} from 'lucide-react';
import escudoImg from '../assets/escudo2.jpg';

export default function GamesCatalogPage() {
  return (
    <div style={{ padding: '40px 20px 80px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* 1. Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(212, 168, 67, 0.12)',
          border: '1px solid rgba(212, 168, 67, 0.3)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          color: 'var(--gold-light)',
          fontFamily: 'var(--font-magic)',
          letterSpacing: '1px',
          marginBottom: '14px'
        }}>
          <Gamepad2 size={16} color="var(--gold)" />
          ZONA DE JUEGOS Y RETOS DE TI
        </div>

        <h1 style={{
          fontFamily: 'var(--font-magic)',
          fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
          color: 'var(--gold-light)',
          marginBottom: '14px',
          letterSpacing: '0.5px'
        }}>
          Catálogo de Experiencias Interactivas
        </h1>

        <p style={{
          maxWidth: '740px',
          margin: '0 auto',
          color: 'var(--text-muted)',
          fontSize: '1.05rem',
          lineHeight: '1.6'
        }}>
          Pon a prueba tu pensamiento lógico y computacional a través de experiencias interactivas creadas por la carrera de Tecnologías de la Información.
        </p>
      </div>

      {/* 2. Cuadrícula de Juegos: El juego activo + Tarjeta Próximamente */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '28px',
        maxWidth: '960px',
        margin: '0 auto'
      }}>
        {/* Tarjeta del Juego en Beta: El Desafío Mágico */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25 }}
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            background: 'linear-gradient(135deg, rgba(126, 18, 29, 0.45) 0%, rgba(22, 36, 56, 0.85) 100%)',
            border: '1px solid rgba(212, 168, 67, 0.45)',
            borderRadius: '20px',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            position: 'relative'
          }}
        >
          <div>
            {/* Cabecera de Tarjeta */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '2px solid rgba(212, 168, 67, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#080D14',
                boxShadow: '0 0 14px rgba(212, 168, 67, 0.35)'
              }}>
                <img
                  src={escudoImg}
                  alt="Escudo Departamento de Misterios de TI"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                fontFamily: 'var(--font-magic)',
                letterSpacing: '0.5px',
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 168, 67, 0.2)',
                color: 'var(--gold-light)',
                border: '1px solid rgba(212, 168, 67, 0.4)'
              }}>
                En desarrollo · Versión Beta
              </span>
            </div>

            <div style={{
              fontSize: '0.78rem',
              color: '#D4A843',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px'
            }}>
              Pensamiento Computacional & Algoritmia
            </div>

            <h3 style={{
              fontFamily: 'var(--font-magic)',
              fontSize: '1.35rem',
              color: 'var(--text-light)',
              marginBottom: '12px',
              lineHeight: '1.3'
            }}>
              El Desafío Mágico de TI
            </h3>

            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.55',
              color: 'var(--text-muted)',
              marginBottom: '20px'
            }}>
              Adéntrate en las bóvedas mágicas de la informática. Resuelve 5 desafíos aleatorios de lógica sin código, aprovecha tus comodines y demuestra tus habilidades para obtener tu recompensa.
            </p>

            {/* Características */}
            <div style={{
              backgroundColor: 'rgba(8, 13, 20, 0.5)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {[
                  '5 desafíos aleatorios de lógica y pensamiento computacional',
                  'Comodines de ayuda (Escudo, Giratiempo, Fénix y más)',
                  'Sistema de puntajes por intento (100 / 60 / 0 pts)',
                  'Pegatina Oficial para quienes alcancen ≥ 350 pts'
                ].map((feat, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '0.82rem',
                    color: 'var(--text-light)',
                    lineHeight: '1.4'
                  }}>
                    <CheckCircle2 size={13} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            to="/juegos/desafio-magico"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '14px',
              backgroundColor: 'var(--gold)',
              color: '#1A1005',
              fontFamily: 'var(--font-magic)',
              fontWeight: '700',
              fontSize: '0.95rem',
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(212, 168, 67, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚡ Jugar Ahora</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Tarjeta Próximamente */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          border: '1px dashed rgba(212, 168, 67, 0.25)',
          borderRadius: '20px',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '380px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'rgba(212, 168, 67, 0.08)',
            border: '1px solid rgba(212, 168, 67, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Clock size={28} color="var(--gold-light)" />
          </div>

          <div style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '1.25rem',
            color: 'var(--gold-light)',
            marginBottom: '10px'
          }}>
            Próximamente más juegos
          </div>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            maxWidth: '320px',
            marginBottom: '16px'
          }}>
            Actualmente nos encontramos ideando y desarrollando nuevas dinámicas y retos interactivos para los próximos eventos y ferias de la carrera.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--gold)',
            backgroundColor: 'rgba(212, 168, 67, 0.1)',
            padding: '6px 14px',
            borderRadius: '16px',
            border: '1px solid rgba(212, 168, 67, 0.2)'
          }}>
            <Sparkles size={14} />
            <span>Nuevas dinámicas en camino</span>
          </div>
        </div>
      </div>
    </div>
  );
}
