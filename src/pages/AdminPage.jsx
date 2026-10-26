import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Key, Lock, Search, RefreshCw, Award, 
  Users, CheckCircle2, XCircle, LogOut, Download, AlertTriangle, Sparkles
} from 'lucide-react';
import { consultarPorCodigo, obtenerTodosParticipantes } from '../services/supabaseClient';
import escudoImg from '../assets/escudo2.jpg';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('qr_quest_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados del panel
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('todos'); // 'todos', 'elegibles', 'no_elegibles'

  // Validador de código individual
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [resultadoCodigo, setResultadoCodigo] = useState(null);
  const [validandoCodigo, setValidandoCodigo] = useState(false);

  const cargarParticipantes = async () => {
    setLoading(true);
    try {
      const res = await obtenerTodosParticipantes(300);
      if (res.success) {
        setParticipantes(res.participantes || []);
      }
    } catch (err) {
      console.error('Error al cargar participantes:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Cargar participantes al autenticar
  useEffect(() => {
    if (isAuthenticated) {
      cargarParticipantes();
    }
  }, [isAuthenticated]);

  // 3. Manejo de inicio de sesión con variables de entorno
  const handleLogin = (e) => {
    e.preventDefault();
    const envUser = import.meta.env.VITE_ADMIN_USER || 'admin_ti';
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD || 'MisteriosTI2026*';

    if (username.trim() === envUser && password.trim() === envPass) {
      sessionStorage.setItem('qr_quest_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas. Verifique usuario y contraseña.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('qr_quest_admin_auth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // 4. Validación de un código mostrado por un estudiante en el stand
  const handleValidarCodigo = async (e) => {
    e.preventDefault();
    const cleanCode = codigoBusqueda.trim().toUpperCase();
    if (!cleanCode) return;

    setValidandoCodigo(true);
    setResultadoCodigo(null);

    try {
      const res = await consultarPorCodigo(cleanCode);
      if (res.success && res.participante) {
        setResultadoCodigo({
          found: true,
          data: res.participante,
          isEligible: (res.participante.puntuacion || 0) >= 350
        });
      } else {
        setResultadoCodigo({
          found: false,
          code: cleanCode,
          message: 'Código no encontrado en el registro. Verifique que el participante haya completado los 5 retos.'
        });
      }
    } catch (err) {
      setResultadoCodigo({
        found: false,
        code: cleanCode,
        message: 'Error de red o conexión al consultar: ' + err.message
      });
    } finally {
      setValidandoCodigo(false);
    }
  };

  // 5. Exportar a CSV para informe de la carrera
  const exportarCSV = () => {
    if (participantes.length === 0) return;

    const headers = ['ID', 'Nombre', 'Puntuación', 'Código Verificación', 'Apto Pegatina', 'Fecha UTC'];
    const rows = participantes.map(p => [
      `"${p.id || ''}"`,
      `"${p.nombre || ''}"`,
      p.puntuacion || 0,
      `"${p.codigo_verificacion || 'N/A'}"`,
      (p.puntuacion || 0) >= 350 ? 'SI' : 'NO',
      `"${p.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `participantes_feria_ti_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 6. Métricas computadas
  const totalParticipantes = participantes.length;
  const totalElegibles = participantes.filter(p => (p.puntuacion || 0) >= 350).length;
  const promedioPuntuacion = totalParticipantes > 0 
    ? Math.round(participantes.reduce((acc, p) => acc + (p.puntuacion || 0), 0) / totalParticipantes)
    : 0;
  const tasaAprobacion = totalParticipantes > 0 
    ? Math.round((totalElegibles / totalParticipantes) * 100) 
    : 0;

  // Filtrado de la lista
  const participantesFiltrados = participantes.filter(p => {
    const matchesSearch = (p.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.codigo_verificacion || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterState === 'elegibles') return matchesSearch && (p.puntuacion || 0) >= 350;
    if (filterState === 'no_elegibles') return matchesSearch && (p.puntuacion || 0) < 350;
    return matchesSearch;
  });

  // ==========================================
  // VISTA A: PANTALLA DE LOGIN ADMINISTRATIVO
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#080D14',
        background: 'radial-gradient(circle at 50% 30%, #15253B 0%, #080D14 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-light)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: 'rgba(22, 36, 56, 0.85)',
            border: '2px solid rgba(212, 168, 67, 0.4)',
            borderRadius: '20px',
            padding: '36px 28px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            textAlign: 'center'
          }}
        >
          {/* Logo Escudo */}
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '18px',
            overflow: 'hidden',
            border: '2px solid var(--gold)',
            margin: '0 auto 16px',
            boxShadow: '0 0 20px rgba(212, 168, 67, 0.35)',
            backgroundColor: '#080D14'
          }}>
            <img src={escudoImg} alt="Escudo TI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--gold-light)',
            fontFamily: 'var(--font-magic)',
            letterSpacing: '1px',
            marginBottom: '6px'
          }}>
            <Lock size={13} />
            ACCESO RESTRINGIDO
          </div>

          <h2 style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '1.45rem',
            color: '#FFF',
            marginBottom: '6px'
          }}>
            Panel Staff · Stand de TI
          </h2>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '26px'
          }}>
            Ingresa las credenciales autorizadas del equipo para validar códigos de canje y monitorear la feria.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                Usuario Staff
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario..."
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(8, 13, 20, 0.7)',
                  border: '1px solid rgba(212, 168, 67, 0.3)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                Contraseña Secreta
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(8, 13, 20, 0.7)',
                  border: '1px solid rgba(212, 168, 67, 0.3)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            {loginError && (
              <div style={{
                color: '#FF7675',
                fontSize: '0.82rem',
                backgroundColor: 'rgba(214, 48, 49, 0.15)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(214, 48, 49, 0.3)'
              }}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '8px',
                backgroundColor: 'var(--gold)',
                color: '#1A1005',
                fontFamily: 'var(--font-magic)',
                fontWeight: '700',
                fontSize: '0.95rem',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(212, 168, 67, 0.3)'
              }}
            >
              <Key size={16} />
              Acceder al Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // VISTA B: DASHBOARD ADMINISTRATIVO DEL STAND
  // ==========================================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#080D14',
      color: 'var(--text-light)',
      fontFamily: 'var(--font-sans)',
      paddingBottom: '80px'
    }}>
      {/* 1. Header Superior del Panel */}
      <header style={{
        backgroundColor: 'rgba(22, 36, 56, 0.85)',
        borderBottom: '1px solid rgba(212, 168, 67, 0.3)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '2px solid var(--gold)',
              backgroundColor: '#080D14'
            }}>
              <img src={escudoImg} alt="Escudo TI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-magic)',
                fontSize: '1.25rem',
                color: 'var(--gold-light)',
                lineHeight: '1.2'
              }}>
                Panel Administrativo · Stand de TI
              </h1>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Feria de Bienvenida Universitaria · Monitoreo en Vivo
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={cargarParticipantes}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(212, 168, 67, 0.15)',
                border: '1px solid rgba(212, 168, 67, 0.3)',
                color: 'var(--gold-light)',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>{loading ? 'Cargando...' : 'Actualizar'}</span>
            </button>

            <button
              onClick={exportarCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(46, 204, 113, 0.15)',
                border: '1px solid rgba(46, 204, 113, 0.3)',
                color: '#2ECC71',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(214, 48, 49, 0.15)',
                border: '1px solid rgba(214, 48, 49, 0.3)',
                color: '#FF7675',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 20px' }}>
        
        {/* 2. Sección de Verificación Rápida de Códigos (Para el Staff con el Estudiante enfrente) */}
        <section style={{
          backgroundColor: 'rgba(22, 36, 56, 0.9)',
          border: '2px solid rgba(212, 168, 67, 0.4)',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Award size={20} color="var(--gold)" />
            <h2 style={{
              fontFamily: 'var(--font-magic)',
              fontSize: '1.25rem',
              color: 'var(--gold-light)'
            }}>
              Validador de Códigos para Entrega de Sticker
            </h2>
          </div>

          <form onSubmit={handleValidarCodigo} style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '18px'
          }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                value={codigoBusqueda}
                onChange={(e) => setCodigoBusqueda(e.target.value)}
                placeholder="Ingresa código (ej: TI-AB12CD)..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#080D14',
                  border: '2px solid rgba(212, 168, 67, 0.4)',
                  borderRadius: '10px',
                  color: 'var(--gold-light)',
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  letterSpacing: '2px',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={validandoCodigo}
              style={{
                padding: '14px 24px',
                backgroundColor: 'var(--gold)',
                color: '#1A1005',
                fontFamily: 'var(--font-magic)',
                fontWeight: '700',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Search size={18} />
              <span>{validandoCodigo ? 'Consultando...' : 'Verificar Código'}</span>
            </button>
          </form>

          {/* Resultado de la Verificación */}
          <AnimatePresence>
            {resultadoCodigo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  backgroundColor: resultadoCodigo.found
                    ? (resultadoCodigo.isEligible ? 'rgba(46, 204, 113, 0.12)' : 'rgba(230, 126, 34, 0.12)')
                    : 'rgba(231, 76, 60, 0.12)',
                  border: `2px solid ${
                    resultadoCodigo.found
                      ? (resultadoCodigo.isEligible ? '#2ECC71' : '#E67E22')
                      : '#E74C3C'
                  }`,
                  borderRadius: '14px',
                  padding: '20px'
                }}
              >
                {resultadoCodigo.found ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        backgroundColor: resultadoCodigo.isEligible ? '#2ECC71' : '#E67E22',
                        color: '#080D14',
                        marginBottom: '8px'
                      }}>
                        {resultadoCodigo.isEligible ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                        {resultadoCodigo.isEligible ? 'APTO PARA PEGATINA HOLOGRÁFICA' : 'NO ALCANZÓ EL UMBRAL (350 PTS)'}
                      </div>

                      <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '4px' }}>
                        {resultadoCodigo.data.nombre}
                      </h3>

                      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        Código Validado: <strong style={{ color: 'var(--gold-light)', fontFamily: 'monospace' }}>{resultadoCodigo.data.codigo_verificacion}</strong>
                        {' · '}Registrado: {new Date(resultadoCodigo.data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div style={{
                      textAlign: 'right',
                      backgroundColor: 'rgba(8, 13, 20, 0.6)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PUNTAJE OBTENIDO</div>
                      <div style={{
                        fontSize: '1.8rem',
                        fontFamily: 'var(--font-magic)',
                        fontWeight: '900',
                        color: resultadoCodigo.isEligible ? '#2ECC71' : '#E67E22'
                      }}>
                        {resultadoCodigo.data.puntuacion} / 500 pts
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FF7675' }}>
                    <XCircle size={22} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Código no encontrado:</strong> {resultadoCodigo.message}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 3. Tarjetas de Métricas de la Feria */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(212, 168, 67, 0.3)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(52, 152, 219, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={24} color="#3498DB" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PARTICIPANTES TOTALES</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFF' }}>{totalParticipantes}</div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(212, 168, 67, 0.3)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(46, 204, 113, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={24} color="#2ECC71" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PEGATINAS HABILITADAS (≥350)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2ECC71' }}>{totalElegibles}</div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(212, 168, 67, 0.3)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 168, 67, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={24} color="var(--gold)" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PROMEDIO DE PUNTAJE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--gold-light)' }}>{promedioPuntuacion} <span style={{ fontSize: '0.9rem' }}>pts</span></div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(212, 168, 67, 0.3)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(155, 89, 182, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={24} color="#9B59B6" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>TASA DE ÉXITO</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFF' }}>{tasaAprobacion}%</div>
            </div>
          </div>
        </section>

        {/* 4. Tabla de Participantes en Vivo */}
        <section style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid rgba(212, 168, 67, 0.3)',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          {/* Barra de Filtros */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o código..."
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'rgba(8, 13, 20, 0.7)',
                  border: '1px solid rgba(212, 168, 67, 0.3)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  minWidth: '240px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'elegibles', label: 'Aptos Pegatina (≥350)' },
                { id: 'no_elegibles', label: 'Menores (<350)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterState(f.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: filterState === f.id ? 'var(--gold)' : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: filterState === f.id ? 'rgba(212, 168, 67, 0.2)' : 'transparent',
                    color: filterState === f.id ? 'var(--gold-light)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Resultados */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(212, 168, 67, 0.3)', color: 'var(--gold-light)' }}>
                  <th style={{ padding: '12px 14px' }}>#</th>
                  <th style={{ padding: '12px 14px' }}>Nombre Participante</th>
                  <th style={{ padding: '12px 14px' }}>Puntuación</th>
                  <th style={{ padding: '12px 14px' }}>Código Oficial</th>
                  <th style={{ padding: '12px 14px' }}>Estado Sticker</th>
                  <th style={{ padding: '12px 14px' }}>Hora</th>
                </tr>
              </thead>
              <tbody>
                {participantesFiltrados.length > 0 ? (
                  participantesFiltrados.map((p, idx) => {
                    const esApto = (p.puntuacion || 0) >= 350;
                    return (
                      <tr 
                        key={p.id || idx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px', fontWeight: '600', color: '#FFF' }}>{p.nombre}</td>
                        <td style={{ padding: '12px 14px', fontFamily: 'var(--font-magic)', fontWeight: '700', color: esApto ? '#2ECC71' : 'var(--gold-light)' }}>
                          {p.puntuacion} pts
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '0.95rem', color: esApto ? 'var(--gold-light)' : 'var(--text-muted)' }}>
                          {p.codigo_verificacion || '—'}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: esApto ? 'rgba(46, 204, 113, 0.15)' : 'rgba(230, 126, 34, 0.15)',
                            color: esApto ? '#2ECC71' : '#E67E22',
                            border: `1px solid ${esApto ? 'rgba(46, 204, 113, 0.3)' : 'rgba(230, 126, 34, 0.3)'}`
                          }}>
                            {esApto ? '✓ Apto Pegatina' : 'Formativo'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {p.created_at ? new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {loading ? 'Cargando participantes desde Supabase...' : 'No se encontraron registros de participantes.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
