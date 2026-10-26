import React from 'react';
import { Award } from 'lucide-react';
import { COUNCIL_MEMBERS } from '../data/councilData';
import consejoImg from '../assets/consejo2.jpg';

export default function CouncilPage() {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* 1. Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
          <Award size={16} />
          <span>REPRESENTACIÓN ESTUDIANTIL · UIDE SEDE LOJA</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-magic)',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          color: '#FFF',
          marginBottom: '14px',
          letterSpacing: '0.5px'
        }}>
          Consejo Estudiantil de Tecnologías de la Información
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-muted)',
          maxWidth: '740px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          La voz, iniciativa y compromiso de la comunidad estudiantil de TI. Trabajamos por la excelencia académica, la integración y el crecimiento profesional de todos nuestros compañeros.
        </p>
      </div>

      {/* 2. Foto Oficial de la Directiva */}
      <div style={{
        maxWidth: '820px',
        margin: '0 auto 52px',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px solid rgba(212, 168, 67, 0.4)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 25px rgba(212, 168, 67, 0.2)',
        backgroundColor: '#080D14'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden'
        }}>
          <img
            src={consejoImg}
            alt="Directiva del Consejo Estudiantil de TI - UIDE Sede Loja"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '680px',
              objectFit: 'cover',
              objectPosition: 'center 50%',
              display: 'block'
            }}
          />
          {/* Degradado sutil inferior */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to top, rgba(8, 13, 20, 0.9) 0%, transparent 100%)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Pie de foto institucional */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: 'rgba(13, 22, 36, 0.95)',
          borderTop: '1px solid rgba(212, 168, 67, 0.25)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <div style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '0.92rem',
            color: 'var(--gold-light)',
            letterSpacing: '0.5px'
          }}>
            Directiva Oficial del Consejo Estudiantil · Periodo Actual
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ color: 'var(--emerald-light)' }}>●</span>
            <span>Campus UIDE Sede Loja</span>
          </div>
        </div>
      </div>

      {/* 3. Retícula de los 6 Miembros Oficiales */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '1.6rem',
            color: '#FFF',
            marginBottom: '8px'
          }}>
            Miembros de la Directiva Estudiantil
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Equipo comprometido con la gestión, apoyo académico e integración de los estudiantes de la carrera.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '24px'
        }}>
          {COUNCIL_MEMBERS.map((member) => (
            <div
              key={member.id}
              style={{
                borderRadius: '20px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(212, 168, 67, 0.25)',
                padding: '26px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                {/* Cabecera de la tarjeta con insignia */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(126, 18, 29, 0.3)',
                    border: '1px solid rgba(212, 168, 67, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Award size={24} color="var(--gold-light)" />
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: 'var(--gold)',
                    backgroundColor: 'rgba(212, 168, 67, 0.12)',
                    border: '1px solid rgba(212, 168, 67, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {member.badge}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--gold-light)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  {member.position}
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-magic)',
                  fontSize: '1.2rem',
                  color: '#FFF',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}>
                  {member.name}
                </h3>

                <p style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-light)',
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }}>
                  {member.scope}
                </p>

                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.45',
                  backgroundColor: 'rgba(8, 13, 20, 0.55)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <strong style={{ color: 'var(--gold-light)' }}>Enfoque:</strong> {member.focus}
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                color: 'var(--text-muted)'
              }}>
                <span>Carrera de TI</span>
                <span style={{ color: 'var(--emerald-light)', fontWeight: '600' }}>● Directiva Vigente</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
