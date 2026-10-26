-- ============================================================================
-- MIGRACIÓN 01: ESQUEMA BASE, EXTENSIONES, TIPOS ENUM, TABLAS E ÍNDICES
-- Proyecto: El Desafío Mágico de TI - Portal Institucional UIDE Loja
-- Fase: 1 - Infraestructura de Base de Datos
-- Autor: Antigravity Architect
-- Fecha: 22 de Octubre de 2026
-- ============================================================================

-- 1. VERIFICACIÓN Y REGISTRO DE EXTENSIONES CRIPTOGRÁFICAS
-- En Supabase, las extensiones residen estándar en el esquema 'extensions'.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- 2. TIPOS ENUM DE NEGOCIO
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'match_status' AND typnamespace = 'public'::regnamespace) THEN
        CREATE TYPE public.match_status AS ENUM ('in_progress', 'completed_passed', 'completed_failed', 'abandoned');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prize_status' AND typnamespace = 'public'::regnamespace) THEN
        CREATE TYPE public.prize_status AS ENUM ('not_eligible', 'pending', 'claimed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attempt_type' AND typnamespace = 'public'::regnamespace) THEN
        CREATE TYPE public.attempt_type AS ENUM ('first_ordinary', 'second_ordinary', 'phoenix_rescue', 'none');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_event_type' AND typnamespace = 'public'::regnamespace) THEN
        CREATE TYPE public.audit_event_type AS ENUM (
            'match_started', 
            'answer_submitted', 
            'shield_absorbed', 
            'wildcard_activated', 
            'phoenix_granted', 
            'match_completed', 
            'prize_claimed'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'staff_role_type' AND typnamespace = 'public'::regnamespace) THEN
        CREATE TYPE public.staff_role_type AS ENUM ('superadmin', 'staff_event');
    END IF;
END $$;

-- 3. TABLA DE ROLES ADMINISTRATIVOS (CANJE DE PREMIOS Y SUPERADMIN)
CREATE TABLE IF NOT EXISTS public.staff_roles (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.staff_role_type NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT clock_timestamp(),
    CONSTRAINT uq_staff_user_role UNIQUE (user_id, role)
);
COMMENT ON TABLE public.staff_roles IS 'Asignaciones de roles para staff de canje de premios y administración del juego';

-- 4. BANCO DE DESAFÍOS Y COMODINES
CREATE TABLE IF NOT EXISTS public.challenges (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    icon TEXT NOT NULL,
    duration_secs INT DEFAULT 45 CHECK (duration_secs >= 15 AND duration_secs <= 120),
    ti_skill TEXT NOT NULL,
    description TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array de objetos [{"id": "opt_a", "label": "..."}] SIN is_correct
    correct_option_id TEXT NOT NULL, -- PROTEGIDO: Jamás visible en clientes anónimos
    hint TEXT NOT NULL,
    explanation TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);
COMMENT ON TABLE public.challenges IS 'Banco oficial de los 10 micro-desafíos con respuestas correctas protegidas';

CREATE TABLE IF NOT EXISTS public.wildcards (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    emoji TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);
COMMENT ON TABLE public.wildcards IS 'Catálogo de los 6 comodines mágicos reglamentarios';

-- 6. PARTIDAS, SESIONES Y MECÁNICA DE JUEGO
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    display_name TEXT NOT NULL CHECK (char_length(trim(display_name)) >= 2 AND char_length(trim(display_name)) <= 50),
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);
COMMENT ON TABLE public.participants IS 'Participantes registrados con minimización de datos (solo display_name)';

CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL, -- SHA-256 del match_token del participante
    status public.match_status DEFAULT 'in_progress',
    total_score INT DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 500),
    current_step INT DEFAULT 0 CHECK (current_step >= 0 AND current_step <= 5),
    is_shield_armed BOOLEAN DEFAULT false,
    verification_code TEXT UNIQUE, -- Código oficial para reclamo de pegatina (ej. TI-9B2A4F)
    prize_status public.prize_status DEFAULT 'not_eligible',
    prize_claimed_at TIMESTAMPTZ,
    prize_claimed_by UUID REFERENCES auth.users(id),
    photo_storage_path TEXT,
    photo_consent_storage BOOLEAN DEFAULT false,
    photo_consent_publish BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT clock_timestamp(),
    completed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT clock_timestamp()
);
COMMENT ON TABLE public.matches IS 'Partidas activas e históricas con estado de puntuación y premios';

CREATE TABLE IF NOT EXISTS public.match_challenges (
    id SERIAL PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    challenge_id INT NOT NULL REFERENCES public.challenges(id),
    step_order INT NOT NULL CHECK (step_order >= 0 AND step_order <= 4),
    attempts_ordinary_used INT DEFAULT 0 CHECK (attempts_ordinary_used >= 0 AND attempts_ordinary_used <= 2),
    phoenix_rescue_granted BOOLEAN DEFAULT false,
    phoenix_rescue_used BOOLEAN DEFAULT false,
    extra_time_secs INT DEFAULT 0,
    is_solved BOOLEAN DEFAULT false,
    score_earned INT DEFAULT 0 CHECK (score_earned IN (0, 60, 100)),
    resolved_by public.attempt_type DEFAULT 'none',
    used_hint BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NULL, -- Nullable para activación secuencial estricta
    resolved_at TIMESTAMPTZ,
    CONSTRAINT uq_match_step UNIQUE (match_id, step_order)
);
COMMENT ON TABLE public.match_challenges IS 'Los 5 desafíos asignados a cada partida con trazabilidad secuencial';

CREATE TABLE IF NOT EXISTS public.match_wildcards (
    id SERIAL PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    wildcard_id INT NOT NULL REFERENCES public.wildcards(id),
    is_used BOOLEAN DEFAULT false,
    used_at_step INT CHECK (used_at_step >= 0 AND used_at_step <= 4),
    used_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT uq_match_wildcard UNIQUE (match_id, wildcard_id)
);
COMMENT ON TABLE public.match_wildcards IS 'Inventario de comodines asignados (1-3) y consumidos por partida';

-- 7. IDEMPOTENCIA TRANSACCIONAL Y AUDITORÍA INMUTABLE
CREATE TABLE IF NOT EXISTS public.idempotency_records (
    idempotency_key TEXT PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    operation_type TEXT NOT NULL,
    request_payload JSONB NOT NULL,
    response_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);
COMMENT ON TABLE public.idempotency_records IS 'Registro persistente para deduplicación y detección de conflictos de payload';

CREATE TABLE IF NOT EXISTS public.match_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    step_order INT,
    event_type public.audit_event_type NOT NULL,
    payload JSONB NOT NULL,
    actor TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);
COMMENT ON TABLE public.match_audit_logs IS 'Bitácora inmutable de eventos de seguridad y progreso de juego';

-- 8. ÍNDICES DE RENDIMIENTO Y MANTENIMIENTO
CREATE INDEX IF NOT EXISTS idx_staff_roles_lookup ON public.staff_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_matches_session ON public.matches(id, session_token_hash);
CREATE INDEX IF NOT EXISTS idx_matches_verification ON public.matches(verification_code) WHERE verification_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_match_challenges_step ON public.match_challenges(match_id, step_order);
CREATE INDEX IF NOT EXISTS idx_idempotency_lookup ON public.idempotency_records(idempotency_key, match_id);
CREATE INDEX IF NOT EXISTS idx_matches_cleanup ON public.matches(status, last_activity_at) WHERE status = 'in_progress';
CREATE INDEX IF NOT EXISTS idx_audit_match ON public.match_audit_logs(match_id, created_at);
