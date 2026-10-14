import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Play } from 'lucide-react';
import { playClick } from '../../utils/audio';

export default function MazePathVisual({ selectedOptionId }) {
  const [currentStep, setCurrentStep] = useState(0); // 0: Norte, 1: Este, 2: Oeste, 3: Norte
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentStep(0);
    playClick();

    setTimeout(() => {
      setCurrentStep(1); // 90° der -> Este (90°)
      playClick();
    }, 700);

    setTimeout(() => {
      setCurrentStep(2); // 180° media vuelta -> Oeste (270°)
      playClick();
    }, 1400);

    setTimeout(() => {
      setCurrentStep(3); // 90° der -> Norte (0°)
      playClick();
      setIsSimulating(false);
    }, 2100);
  };

  // Rotaciones:
  // Paso 0: 0deg (Norte)
  // Paso 1: 90deg (Este)
  // Paso 2: 270deg (Oeste)
  // Paso 3: 360deg (Norte)
  const rotationMap = [0, 90, 270, 360];
  const wandRotation = rotationMap[currentStep] || 0;

  return (
    <div style={{
      backgroundColor: '#0F1826',
      borderRadius: 'var(--radius-md)',
      padding: '14px 10px',
      border: '1px solid rgba(212, 168, 67, 0.3)',
      boxShadow: 'inset 0 0 25px rgba(0,0,0,0.7)',
      marginBottom: '14px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <span style={{
          fontSize: '0.72rem',
          color: 'var(--gold-light)',
          fontFamily: 'var(--font-magic)',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Compass size={13} />
          BRÚJULA DE ORIENTACIÓN ESPACIAL
        </span>

        <button
          onClick={startSimulation}
          disabled={isSimulating}
          style={{
            background: 'linear-gradient(135deg, #D4A843 0%, #9A7725 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#120B02',
            fontSize: '0.7rem',
            fontWeight: '700',
            padding: '3px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <Play size={10} fill="#120B02" />
          {isSimulating ? 'Simulando...' : 'Simular Giros'}
        </button>
      </div>

      {/* Rosa de los vientos */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#162335',
        borderRadius: '10px',
        padding: '10px 8px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          border: '1px solid var(--gold)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F1722'
        }}>
          <span style={{ position: 'absolute', top: '2px', fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--gold-light)' }}>N</span>
          <span style={{ position: 'absolute', right: '4px', fontSize: '0.65rem', fontWeight: 'bold', color: '#94A3B8' }}>E</span>
          <span style={{ position: 'absolute', bottom: '2px', fontSize: '0.65rem', fontWeight: 'bold', color: '#94A3B8' }}>S</span>
          <span style={{ position: 'absolute', left: '4px', fontSize: '0.65rem', fontWeight: 'bold', color: '#94A3B8' }}>O</span>

          {/* Aguja orientable */}
          <motion.div
            animate={{ rotate: wandRotation }}
            transition={{ type: 'spring', damping: 14 }}
            style={{
              width: '4px',
              height: '44px',
              backgroundColor: 'var(--crimson)',
              borderRadius: '2px',
              boxShadow: '0 0 8px rgba(231,76,60,0.8)',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-3px',
              left: '-3px',
              width: '10px',
              height: '10px',
              backgroundColor: 'var(--gold)',
              borderRadius: '50%'
            }} />
          </motion.div>
        </div>

        {/* Pasos */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontSize: '0.72rem',
          maxWidth: '175px'
        }}>
          <div style={{ color: currentStep >= 0 ? '#E2E8F0' : '#64748B' }}>
            Posición inicial: <strong>Norte</strong>
          </div>
          <div style={{ color: currentStep >= 1 ? 'var(--gold-light)' : '#64748B' }}>
            Maniobra 1: Gira 90° a su derecha
          </div>
          <div style={{ color: currentStep >= 2 ? 'var(--gold-light)' : '#64748B' }}>
            Maniobra 2: Media vuelta de 180°
          </div>
          <div style={{ color: currentStep >= 3 ? 'var(--success)' : '#64748B' }}>
            Maniobra 3: Gira 90° a su derecha
          </div>
        </div>
      </div>
    </div>
  );
}
