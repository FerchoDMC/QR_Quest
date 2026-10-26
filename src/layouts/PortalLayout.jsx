import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, Menu, X, BookOpen, GraduationCap, Users, 
  Calendar, Gamepad2, Award, ChevronRight
} from 'lucide-react';
import escudoImg from '../assets/escudo2.jpg';

export default function PortalLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Inicio', icon: BookOpen },
    { to: '/carrera', label: 'Conoce la Carrera', icon: GraduationCap },
    { to: '/docentes', label: 'Docentes', icon: Users },
    { to: '/consejo-estudiantil', label: 'Consejo Estudiantil', icon: Award },
    { to: '/cronograma', label: 'Cronograma', icon: Calendar },
    { to: '/juegos', label: 'Juegos en Línea', icon: Gamepad2 }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-deep)',
      color: 'var(--text-light)',
      fontFamily: 'var(--font-sans)',
      width: '100%'
    }}>
      {/* 1. Header / Navbar Institucional */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(8, 13, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212, 168, 67, 0.25)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '12px clamp(12px, 3.5vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          boxSizing: 'border-box'
        }}>
          {/* Logo y Marca UIDE */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(212, 168, 67, 0.4)',
              backgroundColor: '#080D14',
              flexShrink: 0
            }}>
              {escudoImg ? (
                <img
                  src={escudoImg}
                  alt="Escudo Tecnologías de la Información"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Sparkles size={24} color="var(--gold-light)" />
              )}
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-magic)',
                fontSize: 'clamp(0.85rem, 1.8vw, 1.02rem)',
                fontWeight: '700',
                color: 'var(--gold-light)',
                letterSpacing: '0.4px',
                lineHeight: '1.25'
              }}>
                Ingeniería en Tecnologías de la Información
              </div>
              <div style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.4px',
                fontWeight: '500'
              }}>
                UIDE · Sede Loja
              </div>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px'
          }} className="portal-desktop-nav">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: active ? '600' : '500',
                    color: active ? 'var(--gold-light)' : 'var(--text-muted)',
                    backgroundColor: active ? 'rgba(212, 168, 67, 0.12)' : 'transparent',
                    border: active ? '1px solid rgba(212, 168, 67, 0.3)' : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <link.icon size={15} color={active ? 'var(--gold)' : 'currentColor'} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Botón CTA Desafío Mágico & Menú Móvil */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/juegos/desafio-magico"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #D4A843 0%, #9A7725 100%)',
                color: '#1A1005',
                fontFamily: 'var(--font-magic)',
                fontSize: '0.82rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(212, 168, 67, 0.3)',
                letterSpacing: '0.5px'
              }}
            >
              <Sparkles size={14} />
              <span>Jugar Desafío</span>
            </Link>

            {/* Hamburguesa Móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-light)',
                cursor: 'pointer',
                padding: '6px'
              }}
              className="portal-mobile-toggle"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {mobileMenuOpen && (
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(13, 22, 36, 0.98)',
            borderTop: '1px solid rgba(212, 168, 67, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: active ? 'var(--gold-light)' : 'var(--text-light)',
                    backgroundColor: active ? 'rgba(212, 168, 67, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: active ? '1px solid rgba(212, 168, 67, 0.35)' : 'none',
                    fontSize: '0.95rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <link.icon size={18} color={active ? 'var(--gold)' : 'var(--gold-light)'} />
                    {link.label}
                  </span>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* 2. Contenido Dinámico de la Ruta */}
      <main style={{ flex: 1, width: '100%', overflowX: 'hidden' }}>
        <Outlet />
      </main>

      {/* 3. Footer Simplificado */}
      <footer style={{
        backgroundColor: '#05080E',
        borderTop: '1px solid rgba(212, 168, 67, 0.2)',
        padding: '28px 24px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            © 2026 Ingeniería en Tecnologías de la Información · Todos los derechos reservados.
          </div>
          <div style={{
            color: 'var(--gold-light)',
            fontWeight: '600',
            fontSize: '0.82rem',
            letterSpacing: '0.4px'
          }}>
            Desarrollado por <span style={{ color: 'var(--gold)' }}>fercho-DMC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
