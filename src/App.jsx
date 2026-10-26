import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PortalLayout from './layouts/PortalLayout';
import GameLayout from './layouts/GameLayout';

// Páginas Institucionales
import HomePage from './pages/HomePage';
import AboutCareerPage from './pages/AboutCareerPage';
import FacultyPage from './pages/FacultyPage';
import CouncilPage from './pages/CouncilPage';
import SchedulePage from './pages/SchedulePage';
import GamesCatalogPage from './pages/GamesCatalogPage';

// Experiencia del Juego
import GamePage from './pages/GamePage';

// Panel Administrativo Secreto (Acceso exclusivo por URL directa)
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas del Portal Institucional UIDE */}
        <Route element={<PortalLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/carrera" element={<AboutCareerPage />} />
          <Route path="/docentes" element={<FacultyPage />} />
          <Route path="/consejo-estudiantil" element={<CouncilPage />} />
          <Route path="/cronograma" element={<SchedulePage />} />
          <Route path="/juegos" element={<GamesCatalogPage />} />
        </Route>

        {/* Rutas de la Experiencia del Juego (Mobile-First aislada) */}
        <Route element={<GameLayout />}>
          <Route path="/juegos/desafio-magico" element={<GamePage />} />
        </Route>

        {/* Panel Administrativo de Staff (Sin enlaces públicos en la web) */}
        <Route path="/admin-stand-ti" element={<AdminPage />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
