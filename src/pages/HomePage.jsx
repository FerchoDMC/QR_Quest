import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Code2, Cpu, Shield, Cloud, 
  ArrowRight, CheckCircle2, ChevronRight 
} from 'lucide-react';
import escudoImg from '../assets/escudo2.jpg';

export default function HomePage() {
  const pillars = [
    {
      icon: Code2,
      title: 'Desarrollo & Arquitectura de Software',
      desc: 'Creación de aplicaciones web, móviles y empresariales con arquitecturas escalables y limpias.'
    },
    {
      icon: Cpu,
      title: 'Inteligencia Artificial & Datos',
      desc: 'Machine learning, visión por computadora y análisis masivo para la toma de decisiones estratégicas.'
    },
    {
      icon: Shield,
      title: 'Ciberseguridad & Redes',
      desc: 'Protección de infraestructura crítica, defensa digital y análisis forense de amenazas.'
    },
    {
      icon: Cloud,
      title: 'Cloud Computing & DevOps',
      desc: 'Automatización de pipelines CI/CD, microservicios y despliegue continuo en la nube.'
    }
  ];

  return (
    <div style={{ width: '100%', paddingBottom: '60px', overflowX: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: 'clamp(40px, 8vw, 70px) clamp(16px, 4vw, 24px) clamp(40px, 8vw, 80px)',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Badge Institucional */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '30px',
          backgroundColor: 'rgba(212, 168, 67, 0.12)',
          border: '1px solid rgba(212, 168, 67, 0.35)',
          color: 'var(--gold-light)',
          fontSize: 'clamp(0.72rem, 2.2vw, 0.85rem)',
          fontWeight: '600',
          marginBottom: '20px',
          maxWidth: '100%',
          boxShadow: '0 0 20px rgba(212, 168, 67, 0.2)',
          boxSizing: 'border-box'
        }}>
          <Sparkles size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
          <span>Facultad de Ingenierías · Carrera de Tecnologías de la Información</span>
        </div>

        {/* Título Principal */}
        <h1 style={{
          fontFamily: 'var(--font-magic)',
          fontSize: 'clamp(1.75rem, 5vw, 3.6rem)',
          lineHeight: '1.2',
          color: '#FFF',
          maxWidth: '900px',
          marginBottom: '20px',
          textShadow: '0 2px 20px rgba(0,0,0,0.8)'
        }}>
          Domina el Código. <br />
          <span style={{
            background: 'linear-gradient(135deg, #F7E396 0%, #D4A843 60%, #9A7725 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Lidera el Futuro Digital.
          </span>
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: 'clamp(0.92rem, 2vw, 1.15rem)',
          color: 'var(--text-muted)',
          maxWidth: '720px',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          Bienvenido al portal oficial de la carrera de <strong>Ingeniería en Tecnologías de la Información</strong> de la UIDE Sede Loja. Descubre nuestra oferta académica, equipo docente y pon a prueba tus habilidades de lógica con el juego interactivo oficial.
        </p>

        {/* Botones de Acción */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '520px'
        }}>
          <Link
            to="/juegos/desafio-magico"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px clamp(20px, 4vw, 32px)',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #E5BA55 0%, #B88926 100%)',
              color: '#1A1005',
              fontFamily: 'var(--font-magic)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 25px rgba(212, 168, 67, 0.4)',
              transition: 'transform 0.2s ease',
              flex: '1 1 220px',
              boxSizing: 'border-box',
              textAlign: 'center'
            }}
          >
            <Sparkles size={18} style={{ flexShrink: 0 }} />
            <span>Jugar Desafío Mágico</span>
            <ArrowRight size={18} style={{ flexShrink: 0 }} />
          </Link>

          <Link
            to="/carrera"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px clamp(18px, 3.5vw, 28px)',
              borderRadius: '14px',
              backgroundColor: 'rgba(22, 36, 56, 0.8)',
              border: '1px solid rgba(212, 168, 67, 0.3)',
              color: 'var(--text-light)',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
              flex: '1 1 200px',
              boxSizing: 'border-box',
              textAlign: 'center'
            }}
          >
            <span>Conoce la Carrera</span>
            <ChevronRight size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
          </Link>
        </div>
      </section>

      {/* 2. TARJETA DESTACADA: EL DESAFÍO MÁGICO DE TI (JUEGO DE LA FERIA) */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto 60px',
        padding: '0 clamp(16px, 4vw, 24px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          borderRadius: 'clamp(16px, 3vw, 24px)',
          background: 'linear-gradient(135deg, rgba(126, 18, 29, 0.35) 0%, rgba(22, 36, 56, 0.8) 100%)',
          border: '2px solid rgba(212, 168, 67, 0.4)',
          padding: 'clamp(20px, 4vw, 36px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(20px, 3vw, 30px)',
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{ minWidth: 0, width: '100%' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 168, 67, 0.2)',
              color: 'var(--gold-light)',
              fontSize: '0.78rem',
              fontWeight: '700',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              ACTIVIDAD DE FERIA UNIVERSITARIA
            </div>
            <h2 style={{
              fontFamily: 'var(--font-magic)',
              fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
              color: '#FFF',
              marginBottom: '14px',
              lineHeight: '1.25'
            }}>
              El Desafío Mágico de TI
            </h2>
            <p style={{ lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.92rem' }}>
              Una experiencia gamificada interactiva individual con temática de Harry Potter. Resuelve <strong>5 acertijos aleatorios</strong> de lógica, algoritmos y criptografía, activa estratégicamente tus <strong>comodines mágicos</strong> y acumula 350 puntos o más para reclamar tu pegatina presencial de la carrera.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-light)' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> 5 retos de un banco de 10
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-light)' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> Máximo 500 puntos
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-light)' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> Umbral de premio: 350 pts
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(18px, 4vw, 24px)',
            borderRadius: '18px',
            backgroundColor: 'rgba(8, 13, 20, 0.75)',
            border: '1px solid rgba(212, 168, 67, 0.25)',
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0
          }}>
            <div style={{
              width: '100px',
              height: 'auto',
              marginBottom: '14px',
              filter: 'drop-shadow(0 0 16px rgba(212, 168, 67, 0.45))'
            }}>
              <img
                src={escudoImg}
                alt="Escudo Departamento de Misterios de TI"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  border: '2px solid rgba(212, 168, 67, 0.4)',
                  objectFit: 'contain'
                }}
              />
            </div>
            <h3 style={{
              fontFamily: 'var(--font-magic)',
              color: 'var(--gold-light)',
              marginBottom: '6px',
              fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)'
            }}>
              ¿Aceptas la Convocatoria?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
              No requiere conocimientos previos de programación. Solo tu ingenio, deducción y espíritu explorador.
            </p>
            <Link
              to="/juegos/desafio-magico"
              style={{
                width: '100%',
                maxWidth: '260px',
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7E121D 0%, #A81C2B 100%)',
                color: '#FFF',
                fontFamily: 'var(--font-magic)',
                fontSize: '0.9rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(126, 18, 29, 0.5)',
                boxSizing: 'border-box',
                textAlign: 'center',
                display: 'block'
              }}
            >
              Comenzar Reto Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* 3. PILARES FORMATIVOS DE LA CARRERA */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto 60px',
        padding: '0 clamp(16px, 4vw, 24px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{
            fontFamily: 'var(--font-magic)',
            color: 'var(--gold)',
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            letterSpacing: '1px',
            marginBottom: '6px'
          }}>
            PLAN DE FORMACIÓN INTEGRAL
          </p>
          <h2 style={{
            fontFamily: 'var(--font-magic)',
            fontSize: 'clamp(1.35rem, 3vw, 2.2rem)',
            color: '#FFF',
            lineHeight: '1.25'
          }}>
            Especialidades Tecnológicas de Vanguardia
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '20px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {pillars.map((pillar, i) => (
            <div
              key={i}
              style={{
                borderRadius: '18px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(212, 168, 67, 0.2)',
                padding: 'clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 24px)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                boxSizing: 'border-box',
                minWidth: 0
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 168, 67, 0.1)',
                border: '1px solid rgba(212, 168, 67, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <pillar.icon size={26} color="var(--gold-light)" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-magic)',
                fontSize: '1.15rem',
                color: 'var(--text-light)',
                marginBottom: '10px'
              }}>
                {pillar.title}
              </h3>
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                lineHeight: '1.6'
              }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ENLACE DIRECTO AL CATÁLOGO DE JUEGOS */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 clamp(16px, 4vw, 24px)',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          borderRadius: '20px',
          border: '1px dashed rgba(212, 168, 67, 0.3)',
          padding: 'clamp(24px, 4vw, 32px) clamp(16px, 3vw, 24px)',
          backgroundColor: 'rgba(22, 36, 56, 0.4)',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-magic)',
            color: 'var(--gold-light)',
            marginBottom: '8px',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)'
          }}>
            Explora Nuestro Catálogo de Juegos Interactivos
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px', maxWidth: '600px', margin: '0 auto 18px' }}>
            Descubre nuevos minijuegos y simuladores diseñados por estudiantes y docentes de Tecnologías de la Información.
          </p>
          <Link
            to="/juegos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '20px',
              backgroundColor: 'rgba(212, 168, 67, 0.15)',
              border: '1px solid var(--gold)',
              color: 'var(--gold-light)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.88rem'
            }}
          >
            Ver Catálogo de Juegos
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
