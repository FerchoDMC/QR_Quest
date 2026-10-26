import React from 'react';
import { Users, GraduationCap, Sparkles } from 'lucide-react';
import { FACULTY_MEMBERS } from '../data/facultyData';

export default function FacultyPage() {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
          <Users size={16} />
          <span>CLAUSTRO DOCENTE · UIDE SEDE LOJA</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-magic)',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          color: '#FFF',
          marginBottom: '14px',
          letterSpacing: '0.5px'
        }}>
          Cuerpo Docente de la Carrera
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-muted)',
          maxWidth: '740px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Conoce al equipo de docentes y directivos encargados de liderar la formación académica, proyectos de innovación y especialización de los futuros ingenieros.
        </p>
      </div>

      {/* Retícula de Perfiles Docentes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '26px'
      }}>
        {FACULTY_MEMBERS.map((prof) => (
          <div
            key={prof.id}
            style={{
              borderRadius: '20px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid rgba(212, 168, 67, 0.28)',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              position: 'relative'
            }}
          >
            <div>
              {/* Avatar Icon y Badge de Especialidad */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px'
              }}>
                <div style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(212, 168, 67, 0.12)',
                  border: '2px solid var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(212, 168, 67, 0.2)'
                }}>
                  <GraduationCap size={28} color="var(--gold-light)" />
                </div>

                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  color: 'var(--gold-light)',
                  backgroundColor: 'rgba(212, 168, 67, 0.15)',
                  border: '1px solid rgba(212, 168, 67, 0.35)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  letterSpacing: '0.4px'
                }}>
                  {prof.badge}
                </span>
              </div>

              {/* Nombre Docente */}
              <h2 style={{
                fontFamily: 'var(--font-magic)',
                fontSize: '1.25rem',
                color: '#FFF',
                marginBottom: '4px',
                lineHeight: '1.3'
              }}>
                {prof.name}
              </h2>

              {/* Cargo Institucional */}
              <p style={{
                fontSize: '0.84rem',
                color: 'var(--gold-light)',
                fontWeight: '600',
                lineHeight: '1.4',
                marginBottom: '10px'
              }}>
                {prof.institutionalRole}
              </p>

              {/* Especialidad Destacada */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: '#FFF',
                backgroundColor: 'rgba(126, 18, 29, 0.3)',
                border: '1px solid rgba(212, 168, 67, 0.3)',
                padding: '4px 10px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <Sparkles size={13} color="var(--gold)" />
                <span>Especialidad: <strong>{prof.specialty}</strong></span>
              </div>

              {/* Descripción / Bio */}
              <p style={{
                fontSize: '0.86rem',
                color: 'var(--text-muted)',
                lineHeight: '1.55',
                marginBottom: '18px'
              }}>
                {prof.bio}
              </p>
            </div>

            {/* Pie de Tarjeta */}
            <div style={{
              marginTop: '20px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              color: 'var(--text-muted)'
            }}>
              <span>UIDE Sede Loja</span>
              <span style={{ color: 'var(--emerald-light)', fontWeight: '600' }}>● Docente Oficial</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
