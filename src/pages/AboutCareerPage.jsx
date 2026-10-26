import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Sparkles, Code, Shield, Cpu, 
  Globe, Database, Network, ArrowRight, ExternalLink
} from 'lucide-react';

export default function AboutCareerPage() {
  const fields = [
    {
      title: 'Desarrollo de Software y Aplicaciones',
      desc: 'Construcción de sistemas web modernos, aplicaciones móviles y soluciones empresariales con metodologías ágiles y código limpio.',
      icon: Code,
      badge: 'Software'
    },
    {
      title: 'Inteligencia Artificial y Ciencia de Datos',
      desc: 'Entrenamiento de algoritmos inteligentes, modelos predictivos y análisis de grandes volúmenes de información para generar valor.',
      icon: Cpu,
      badge: 'IA & Datos'
    },
    {
      title: 'Ciberseguridad y Redes Defensivas',
      desc: 'Protección de datos sensibles, prevención de ciberataques, análisis de vulnerabilidades y blindaje de infraestructuras críticas.',
      icon: Shield,
      badge: 'Seguridad'
    },
    {
      title: 'Arquitectura Cloud & DevOps',
      desc: 'Despliegue y administración de plataformas escalables en la nube, automatización de procesos y entornos de alta disponibilidad.',
      icon: Globe,
      badge: 'Cloud'
    },
    {
      title: 'Redes e Internet de las Cosas (IoT)',
      desc: 'Diseño de redes de comunicación seguras, interconexión de dispositivos inteligentes y telecomunicaciones de nueva generación.',
      icon: Network,
      badge: 'Telecom'
    },
    {
      title: 'Bases de Datos & Gestión de Información',
      desc: 'Modelado relacional y NoSQL para garantizar integridad, rapidez en consultas y almacenamiento confiable de transacciones.',
      icon: Database,
      badge: 'Datos'
    }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* 1. Encabezado con Mensaje Introductorio */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
          marginBottom: '18px'
        }}>
          <GraduationCap size={16} />
          <span>CONOCE NUESTRA CARRERA</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-magic)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#FFF',
          marginBottom: '20px',
          letterSpacing: '0.5px'
        }}>
          Ingeniería en Tecnologías de la Información
        </h1>

        {/* Mensaje Introductorio Cálido e Inspirador */}
        <div style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '24px 28px',
          backgroundColor: 'rgba(22, 36, 56, 0.65)',
          borderRadius: '20px',
          border: '1px solid rgba(212, 168, 67, 0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          textAlign: 'left'
        }}>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-light)',
            lineHeight: '1.7',
            marginBottom: '14px'
          }}>
            En el mundo actual, la tecnología no es solo una herramienta: <strong>es el lenguaje con el que se construye el futuro</strong>. Desde la inteligencia artificial que revoluciona industrias hasta los sistemas que protegen la información más sensible de la sociedad, todo nace del pensamiento computacional y la creatividad de los ingenieros.
          </p>
          <p style={{
            fontSize: '0.96rem',
            color: 'var(--text-muted)',
            lineHeight: '1.65',
            margin: 0
          }}>
            En la <strong>UIDE Sede Loja</strong>, formamos profesionales capaces de convertir ideas en software funcional, diseñar redes robustas y liderar proyectos de innovación digital con impacto global.
          </p>
        </div>
      </div>

      {/* 2. Campos Profesionales (Informativo por encima) */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '1.8rem',
            color: '#FFF',
            marginBottom: '10px'
          }}>
            Campos Profesionales y Áreas de Desempeño
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
            Como Ingeniero en TI, tendrás la versatilidad de desempeñarte y emprender en los sectores de mayor demanda tecnológica:
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '24px'
        }}>
          {fields.map((f, i) => (
            <div
              key={i}
              style={{
                borderRadius: '18px',
                backgroundColor: 'rgba(22, 36, 56, 0.7)',
                border: '1px solid rgba(212, 168, 67, 0.2)',
                padding: '24px',
                display: 'flex',
                gap: '16px',
                transition: 'border-color 0.2s ease, transform 0.2s ease'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 168, 67, 0.1)',
                border: '1px solid rgba(212, 168, 67, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <f.icon size={22} color="var(--gold-light)" />
              </div>
              <div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  {f.badge}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-magic)',
                  fontSize: '1.1rem',
                  color: 'var(--text-light)',
                  marginBottom: '8px'
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Nota Informativa y Enlace a la Web Universitaria */}
      <div style={{
        maxWidth: '850px',
        margin: '0 auto 48px',
        padding: '20px 24px',
        borderRadius: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: '1px dashed rgba(212, 168, 67, 0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ maxWidth: '580px' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--gold-light)', fontWeight: '600', marginBottom: '4px' }}>
            ¿Deseas información detallada sobre admisiones y matrículas?
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Para consultar requisitos administrativos, procesos de admisión vigentes, becas y fechas de inicio de semestre, visita el portal oficial de la universidad.
          </div>
        </div>

        <a
          href="https://www.uide.edu.ec"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(212, 168, 67, 0.15)',
            border: '1px solid rgba(212, 168, 67, 0.4)',
            color: 'var(--gold-light)',
            fontSize: '0.85rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}
        >
          <span>Sitio Oficial UIDE</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* 4. CTA al Juego de la Feria */}
      <div style={{
        textAlign: 'center',
        padding: '36px 20px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(126, 18, 29, 0.3) 0%, rgba(22, 36, 56, 0.7) 100%)',
        border: '1px solid rgba(212, 168, 67, 0.35)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
      }}>
        <h3 style={{ fontFamily: 'var(--font-magic)', color: '#FFF', fontSize: '1.4rem', marginBottom: '8px' }}>
          ¿Quieres experimentar cómo piensa un Ingeniero en TI?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '22px', maxWidth: '600px', margin: '0 auto 22px' }}>
          Pon a prueba tu pensamiento algorítmico y deducción lógica en los acertijos interactivos de la feria.
        </p>
        <Link
          to="/juegos/desafio-magico"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 26px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D4A843 0%, #9A7725 100%)',
            color: '#1A1005',
            fontFamily: 'var(--font-magic)',
            fontSize: '0.92rem',
            fontWeight: '700',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(212, 168, 67, 0.35)'
          }}
        >
          <Sparkles size={16} />
          <span>Iniciar Desafío Mágico</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
