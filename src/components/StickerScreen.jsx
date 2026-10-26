import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';

export default function StickerScreen({ session }) {
  const code = (session.id || 'TI-QUEST').slice(-6).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 20px',
        minHeight: '100%',
        textAlign: 'center'
      }}
    >
      <div style={{ width: '100%' }}>
        <p style={{
          fontFamily: 'var(--font-magic)',
          color: 'var(--gold-light)',
          fontSize: '0.85rem',
          letterSpacing: '1px',
          marginBottom: '4px'
        }}>
          VALIDACIÓN PRESENCIAL
        </p>

        <h2 className="magic-title" style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
          ¡Reclama tu Sticker!
        </h2>

        {/* Certificado Pergamino para mostrar al Staff */}
        <div className="parchment-card" style={{
          padding: '26px 20px',
          marginBottom: '20px',
          border: '3px solid var(--gold)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5), inset 0 0 30px rgba(212, 168, 67, 0.2)'
        }}>
          {/* Sello Dorado Central */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #F7E396 0%, #D4A843 50%, #9A7725 100%)',
            border: '3px solid #FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 4px 15px rgba(212, 168, 67, 0.5)'
          }}>
            <Award size={36} color="#4A3405" />
          </div>

          <p style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '0.85rem',
            color: 'var(--crimson)',
            letterSpacing: '0.5px',
            marginBottom: '6px'
          }}>
            CERTIFICADO DE MÉRITO EN TI
          </p>

          <h3 style={{
            fontFamily: 'var(--font-magic)',
            fontSize: '1.5rem',
            color: 'var(--text-parchment)',
            marginBottom: '8px',
            textDecoration: 'underline',
            textDecorationColor: 'var(--gold)'
          }}>
            {session.name}
          </h3>

          {/* Condición de Entrega según Umbral de 350 pts */}
          {(session.totalScore || 0) >= 350 ? (
            <>
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-parchment-muted)',
                lineHeight: '1.4',
                marginBottom: '16px'
              }}>
                Ha superado con honor las pruebas del Desafío Mágico alcanzando <strong>{session.totalScore || 0} / 500 puntos</strong>.
              </p>

              {/* Código de Verificación para el Staff */}
              <div style={{
                backgroundColor: '#EDE0C4',
                padding: '12px 18px',
                borderRadius: '10px',
                border: '2px dashed var(--crimson)',
                display: 'inline-flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(126, 18, 29, 0.15)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)', fontWeight: '700' }}>
                  CÓDIGO OFICIAL DE CANJE
                </span>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '1.35rem',
                  fontWeight: '900',
                  letterSpacing: '2px',
                  color: 'var(--crimson)'
                }}>
                  {session.verificationCode || `TI-${code}`}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--emerald)', fontWeight: '700' }}>
                  ● Estado: Pendiente de entrega
                </span>
              </div>

              <div style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: 'var(--emerald)',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}>
                <CheckCircle size={18} />
                Apto para Pegatina Holográfica Oficial
              </div>
            </>
          ) : (
            <>
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-parchment-muted)',
                lineHeight: '1.4',
                marginBottom: '16px'
              }}>
                Ha completado los desafíos con <strong>{session.totalScore || 0} / 500 puntos</strong>. El umbral para obtener la pegatina holográfica es de <strong>350 puntos</strong>.
              </p>

              <div style={{
                backgroundColor: 'rgba(212, 168, 67, 0.15)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--gold)',
                display: 'inline-block'
              }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-parchment)', fontWeight: '600' }}>
                  ¡Gran participación en el Desafío Mágico!
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)', marginTop: '4px' }}>
                  Has puesto a prueba tu lógica y pensamiento computacional.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Instrucción para el participante */}
        <div style={{
          backgroundColor: 'rgba(212, 168, 67, 0.12)',
          border: '1px solid rgba(212, 168, 67, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          color: 'var(--gold-light)',
          fontSize: '0.85rem',
          lineHeight: '1.4'
        }}>
          {(session.totalScore || 0) >= 350 ? (
            <span>👉 <strong>Muestra esta pantalla al estudiante encargado del stand</strong> para que verifique tu código y te entregue la pegatina oficial.</span>
          ) : (
            <span>🎉 <strong>¡Gracias por participar!</strong> Acércate al stand para conocer más proyectos de la carrera de TI.</span>
          )}
        </div>
      </div>

      {/* Sello de partida bloqueada y protegida contra fraudes */}
      <div style={{
        marginTop: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        opacity: 0.8
      }}>
        <span>🔒 Partida finalizada y registrada oficialmente</span>
      </div>
    </motion.div>
  );
}
