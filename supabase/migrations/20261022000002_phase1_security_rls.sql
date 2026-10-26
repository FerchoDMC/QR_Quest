-- ============================================================================
-- MIGRACIÓN 02: SEGURIDAD, CONTROL DE ACCESO (RBAC), RLS Y VISTA PÚBLICA
-- Proyecto: El Desafío Mágico de TI - Portal Institucional UIDE Loja
-- Fase: 1 - Infraestructura de Base de Datos
-- Autor: Antigravity Architect
-- Fecha: 22 de Octubre de 2026
-- ============================================================================

-- 1. ACTIVACIÓN DE ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_wildcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idempotency_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. FUNCIÓN DE SEGURIDAD PARA VERIFICACIÓN DE ROLES (RBAC)
-- Ejecutada con SECURITY DEFINER y search_path vacío para prevenir search_path hijacking
CREATE OR REPLACE FUNCTION public.is_staff(required_role public.staff_role_type DEFAULT NULL) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;

    -- Si no se especifica rol, comprueba si tiene cualquier rol asignado en staff_roles
    IF required_role IS NULL THEN
        RETURN EXISTS (SELECT 1 FROM public.staff_roles WHERE user_id = auth.uid());
    END IF;

    -- Comprueba el rol específico o si es superadmin (jerarquía superior)
    RETURN EXISTS (
        SELECT 1 FROM public.staff_roles 
        WHERE user_id = auth.uid() 
          AND (role = required_role OR role = 'superadmin'::public.staff_role_type)
    );
END;
$$;
COMMENT ON FUNCTION public.is_staff IS 'Comprueba de forma segura si el usuario autenticado ostenta un rol de staff válido';

-- Revocar privilegios públicos y otorgar a authenticated
REVOKE EXECUTE ON FUNCTION public.is_staff(public.staff_role_type) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(public.staff_role_type) TO authenticated;

-- 3. POLÍTICAS RLS: ROLES DE STAFF
DROP POLICY IF EXISTS "Superadmin View Staff Roles" ON public.staff_roles;
CREATE POLICY "Superadmin View Staff Roles" ON public.staff_roles 
    FOR SELECT TO authenticated 
    USING (public.is_staff('superadmin'));

DROP POLICY IF EXISTS "Superadmin Manage Staff Roles" ON public.staff_roles;
CREATE POLICY "Superadmin Manage Staff Roles" ON public.staff_roles 
    FOR ALL TO authenticated 
    USING (public.is_staff('superadmin')) 
    WITH CHECK (public.is_staff('superadmin'));

-- 4. POLÍTICAS RLS: BANCO DE PREGUNTAS Y COMODINES
-- La tabla base 'challenges' SOLO es visible por superadmin. Anónimos NO tienen acceso a esta tabla.
DROP POLICY IF EXISTS "Superadmin Read Challenges" ON public.challenges;
CREATE POLICY "Superadmin Read Challenges" ON public.challenges 
    FOR SELECT TO authenticated 
    USING (public.is_staff('superadmin'));

DROP POLICY IF EXISTS "Public Read Wildcards" ON public.wildcards;
CREATE POLICY "Public Read Wildcards" ON public.wildcards 
    FOR SELECT TO anon, authenticated 
    USING (is_active = true);

-- 6. POLÍTICAS RLS: TABLAS OPERATIVAS DE JUEGO (AISLAMIENTO TOTAL)
-- Cero acceso directo para anon. Toda interacción de juego se realiza vía RPCs con SECURITY DEFINER.
DROP POLICY IF EXISTS "No Direct Anon Matches" ON public.matches;
CREATE POLICY "No Direct Anon Matches" ON public.matches 
    FOR ALL TO anon 
    USING (false);

DROP POLICY IF EXISTS "Staff View Matches" ON public.matches;
CREATE POLICY "Staff View Matches" ON public.matches 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

DROP POLICY IF EXISTS "No Direct Anon Match Challenges" ON public.match_challenges;
CREATE POLICY "No Direct Anon Match Challenges" ON public.match_challenges 
    FOR ALL TO anon 
    USING (false);

DROP POLICY IF EXISTS "Staff View Match Challenges" ON public.match_challenges;
CREATE POLICY "Staff View Match Challenges" ON public.match_challenges 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

DROP POLICY IF EXISTS "No Direct Anon Match Wildcards" ON public.match_wildcards;
CREATE POLICY "No Direct Anon Match Wildcards" ON public.match_wildcards 
    FOR ALL TO anon 
    USING (false);

DROP POLICY IF EXISTS "Staff View Match Wildcards" ON public.match_wildcards;
CREATE POLICY "Staff View Match Wildcards" ON public.match_wildcards 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

DROP POLICY IF EXISTS "No Direct Anon Audit" ON public.match_audit_logs;
CREATE POLICY "No Direct Anon Audit" ON public.match_audit_logs 
    FOR ALL TO anon 
    USING (false);

DROP POLICY IF EXISTS "Staff View Audit" ON public.match_audit_logs;
CREATE POLICY "Staff View Audit" ON public.match_audit_logs 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

DROP POLICY IF EXISTS "No Direct Anon Idempotency" ON public.idempotency_records;
CREATE POLICY "No Direct Anon Idempotency" ON public.idempotency_records 
    FOR ALL TO anon 
    USING (false);

DROP POLICY IF EXISTS "Staff View Idempotency" ON public.idempotency_records;
CREATE POLICY "Staff View Idempotency" ON public.idempotency_records 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

-- 7. VISTA PÚBLICA SANITIZADA (ZERO-LEAKAGE DE RESPUESTAS)
-- Esta vista entrega únicamente los datos requeridos por la interfaz, excluyendo correct_option_id
CREATE OR REPLACE VIEW public.challenges_public AS 
SELECT 
    id, slug, title, type, icon, duration_secs, 
    ti_skill, description, question, options, hint, explanation
FROM public.challenges 
WHERE is_active = true;

COMMENT ON VIEW public.challenges_public IS 'Vista sanitizada de desafíos para consumo público del cliente web sin fuga de respuestas';

-- 8. PERMISOS EXPLÍCITOS DE TABLAS Y VISTAS (GRANT / REVOKE)
-- RLS no sustituye a GRANT/REVOKE; se aplican permisos de mínimo privilegio

-- A. Revocar todo acceso directo en tablas protegidas para PUBLIC y anon
REVOKE ALL ON TABLE public.challenges, public.matches, public.match_challenges, 
                     public.match_wildcards, public.participants, public.idempotency_records, 
                     public.match_audit_logs, public.staff_roles FROM PUBLIC, anon;

-- B. Otorgar SELECT en tablas públicas del juego y vista sanitizada
GRANT SELECT ON TABLE public.wildcards TO anon, authenticated;
GRANT SELECT ON TABLE public.challenges_public TO anon, authenticated;

-- C. Otorgar permisos de lectura y gestión administrativa para authenticated (filtrado luego por RLS)
GRANT SELECT ON TABLE public.challenges TO authenticated;
GRANT SELECT ON TABLE public.matches TO authenticated;
GRANT SELECT ON TABLE public.match_challenges TO authenticated;
GRANT SELECT ON TABLE public.match_wildcards TO authenticated;
GRANT SELECT ON TABLE public.match_audit_logs TO authenticated;
GRANT SELECT ON TABLE public.idempotency_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.staff_roles TO authenticated;

-- D. Permisos de secuencias
GRANT USAGE, SELECT ON SEQUENCE public.challenges_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.wildcards_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.match_challenges_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.match_wildcards_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.match_audit_logs_id_seq TO authenticated;
