import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Smartphone, Cpu, ShieldCheck, Radio, Database, ArrowRight, Award } from 'lucide-react';
import { TI_AREAS } from '../data/tiAreas';
import { playClick } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

const ICONS = {
  Globe,
  Smartphone,
  Cpu,
  ShieldCheck,
  Radio,
  Database
};

export default function AreasShowcaseScreen({ onClaimSticker }) {
  const handleNext = () => {
    playClick();
    triggerHaptic('light');
    onClaimSticker();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 18px',
        minHeight: '100%'
      }}
    >
      <div>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h2 className="magic-title" style={{ fontSize: '1.35rem', marginBottom: '4px' }}>
            Tu Futuro en TI
          </h2>
          <p style={{ color: 'var(--gold-light)', fontSize: '0.85rem', fontFamily: 'var(--font-serif)' }}>
            Descubre las especialidades donde tus habilidades pueden transformar el mundo:
          </p>
        </div>

        {/* Grilla de 6 Áreas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {TI_AREAS.map((area, idx) => {
            const Icon = ICONS[area.icon] || Globe;
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  backgroundColor: 'rgba(22, 36, 56, 0.85)',
                  border: '1px solid rgba(212, 168, 67, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(212, 168, 67, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: area.color
                  }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '1.1rem' }}>{area.emoji}</span>
                </div>

                <h4 style={{
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  color: 'var(--text-light)',
                  lineHeight: '1.2'
                }}>
                  {area.title}
                </h4>

                <p style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.3'
                }}>
                  {area.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleNext}
        className="btn-magic"
        style={{ width: '100%', padding: '16px' }}
      >
        <Award size={20} />
        Reclamar Mi Sticker de TI
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}
