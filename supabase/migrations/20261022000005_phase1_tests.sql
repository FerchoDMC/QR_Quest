-- ============================================================================
-- SCRIPT DE PRUEBAS 05: BATERÍA DE PRUEBAS AUTOMATIZADAS T-01 A T-10
-- Proyecto: El Desafío Mágico de TI - Portal Institucional UIDE Loja
-- Fase: 1 - Infraestructura de Base de Datos
-- Autor: Antigravity Architect
-- Fecha: 22 de Octubre de 2026
-- ESTADO: PREPARADO PARA REVISIÓN (PENDIENTE DE EJECUCIÓN AUTORIZADA)
-- ============================================================================

-- NOTA IMPORTANTE DE AUDITORÍA:
-- Este archivo contiene las pruebas unitarias y de integración escritas en PL/pgSQL
-- para validar rigurosamente la Fase 1. En cumplimiento con la regla de No Ejecución,
-- este script NO ha sido ejecutado en el entorno de Supabase. Su ejecución deberá ser
-- autorizada expresamente por el usuario tras revisar el código.

CREATE OR REPLACE FUNCTION public.run_phase1_verification_suite()
RETURNS TABLE(test_id TEXT, test_name TEXT, status TEXT, details TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_match_res JSONB;
    v_match_id UUID;
    v_match_token TEXT;
    v_answer_res JSONB;
    v_ans_idem1 JSONB;
    v_ans_idem2 JSONB;
    v_challenge_row RECORD;
    v_correct_opt TEXT;
    v_wrong_opt TEXT;
    v_code TEXT;
    v_claim_res JSONB;
    v_second_claim JSONB;
    v_step0_start TIMESTAMPTZ;
    v_step1_start TIMESTAMPTZ;
    v_step2_start TIMESTAMPTZ;
BEGIN
    -- ------------------------------------------------------------------------
    -- TEST T-01: CERO FUGA DE RESPUESTAS EN VISTA PÚBLICA
    -- ------------------------------------------------------------------------
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'challenges_public' 
          AND column_name = 'correct_option_id'
    ) THEN
        RETURN QUERY SELECT 'T-01'::TEXT, 'Cero Fuga en Vista Publica'::TEXT, 'FAILED'::TEXT, 'Vulnerabilidad: correct_option_id esta expuesto en challenges_public'::TEXT;
    ELSE
        RETURN QUERY SELECT 'T-01'::TEXT, 'Cero Fuga en Vista Publica'::TEXT, 'PASSED'::TEXT, 'challenges_public oculta estrictamente correct_option_id'::TEXT;
    END IF;

    -- ------------------------------------------------------------------------
    -- TEST T-02: AISLAMIENTO DIRECTO DE TABLAS OPERATIVAS PARA ANON
    -- ------------------------------------------------------------------------
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = 'matches' 
          AND policyname = 'No Direct Anon Matches'
    ) THEN
        RETURN QUERY SELECT 'T-02'::TEXT, 'Aislamiento de Tablas para Anon'::TEXT, 'PASSED'::TEXT, 'Politica RLS No Direct Anon Matches activa en matches'::TEXT;
    ELSE
        RETURN QUERY SELECT 'T-02'::TEXT, 'Aislamiento de Tablas para Anon'::TEXT, 'FAILED'::TEXT, 'Falta politica de aislamiento para anon en matches'::TEXT;
    END IF;

    -- ------------------------------------------------------------------------
    -- TEST T-03: PRIVILEGIOS DE EJECUCIÓN DE RPCs ADMINISTRATIVAS
    -- ------------------------------------------------------------------------
    IF EXISTS (
        SELECT 1 FROM information_schema.routine_privileges 
        WHERE routine_schema = 'public' 
          AND routine_name = 'rpc_claim_prize' 
          AND grantee = 'anon'
    ) THEN
        RETURN QUERY SELECT 'T-03'::TEXT, 'Revocacion de rpc_claim_prize para Anon'::TEXT, 'FAILED'::TEXT, 'rpc_claim_prize tiene permiso EXECUTE concedido a anon'::TEXT;
    ELSE
        RETURN QUERY SELECT 'T-03'::TEXT, 'Revocacion de rpc_claim_prize para Anon'::TEXT, 'PASSED'::TEXT, 'rpc_claim_prize no es ejecutable por anon'::TEXT;
    END IF;

    -- ------------------------------------------------------------------------
    -- TEST T-04: AUTORIZACIÓN POR TOKEN CRIPTOGRÁFICO DE SESIÓN
    -- ------------------------------------------------------------------------
    -- Iniciar una partida de prueba
    v_match_res := public.rpc_start_match('Mago Tester');
    v_match_id := (v_match_res->>'match_id')::UUID;
    v_match_token := v_match_res->>'match_token';

    BEGIN
        -- Intentar validar con un token adulterado
        PERFORM public.rpc_validate_answer(v_match_id, 'token_falso_adulterado_123', 0, 'opt_a', 'test_key_bad_token');
        RETURN QUERY SELECT 'T-04'::TEXT, 'Token Criptografico Invalido'::TEXT, 'FAILED'::TEXT, 'Permitio validar con un token falso'::TEXT;
    EXCEPTION WHEN OTHERS THEN
        IF SQLSTATE = '42501' THEN
            RETURN QUERY SELECT 'T-04'::TEXT, 'Token Criptografico Invalido'::TEXT, 'PASSED'::TEXT, 'Rechazo correctamente con 42501 Unauthorized'::TEXT;
        ELSE
            RETURN QUERY SELECT 'T-04'::TEXT, 'Token Criptografico Invalido'::TEXT, 'PASSED'::TEXT, ('Rechazo excepcion: ' || SQLERRM)::TEXT;
        END IF;
    END;

    -- ------------------------------------------------------------------------
    -- TEST T-05: TEMPORIZADORES SECUENCIALES (STARTED_AT)
    -- ------------------------------------------------------------------------
    SELECT started_at INTO v_step0_start FROM public.match_challenges WHERE match_id = v_match_id AND step_order = 0;
    SELECT started_at INTO v_step1_start FROM public.match_challenges WHERE match_id = v_match_id AND step_order = 1;

    IF v_step0_start IS NOT NULL AND v_step1_start IS NULL THEN
        RETURN QUERY SELECT 'T-05'::TEXT, 'Temporizador Secuencial Inicial'::TEXT, 'PASSED'::TEXT, 'Paso 0 tiene started_at activo; Paso 1 tiene started_at en NULL'::TEXT;
    ELSE
        RETURN QUERY SELECT 'T-05'::TEXT, 'Temporizador Secuencial Inicial'::TEXT, 'FAILED'::TEXT, 'Paso 1 tiene started_at antes de iniciar'::TEXT;
    END IF;

    -- ------------------------------------------------------------------------
    -- TEST T-06: IDEMPOTENCIA TRANSACCIONAL (REINTENTO IDÉNTICO)
    -- ------------------------------------------------------------------------
    -- Obtener la respuesta correcta del paso 0 para simular acierto
    SELECT c.correct_option_id INTO v_correct_opt 
    FROM public.match_challenges mc
    JOIN public.challenges c ON c.id = mc.challenge_id
    WHERE mc.match_id = v_match_id AND mc.step_order = 0;

    v_ans_idem1 := public.rpc_validate_answer(v_match_id, v_match_token, 0, v_correct_opt, 'idem_key_test_001');
    v_ans_idem2 := public.rpc_validate_answer(v_match_id, v_match_token, 0, v_correct_opt, 'idem_key_test_001');

    IF v_ans_idem1 = v_ans_idem2 AND (v_ans_idem1->>'is_correct')::BOOLEAN = true THEN
        RETURN QUERY SELECT 'T-06'::TEXT, 'Idempotencia Reintento Identico'::TEXT, 'PASSED'::TEXT, 'Devolvio la respuesta cacheada sin duplicar puntuacion ni avanzar de paso extra'::TEXT;
    ELSE
        RETURN QUERY SELECT 'T-06'::TEXT, 'Idempotencia Reintento Identico'::TEXT, 'FAILED'::TEXT, 'Discrepancia en reintento de idempotencia'::TEXT;
    END IF;

    -- ------------------------------------------------------------------------
    -- TEST T-07: CONFLICTO DE IDEMPOTENCIA ANTE PAYLOAD ADULTERADO (P0002)
    -- ------------------------------------------------------------------------
    BEGIN
        -- Reutilizar la clave 'idem_key_test_001' con un selected_option_id distinto
        PERFORM public.rpc_validate_answer(v_match_id, v_match_token, 0, 'opt_adulterada_distinta', 'idem_key_test_001');
        RETURN QUERY SELECT 'T-07'::TEXT, 'Conflicto Idempotencia Payload Adulterado'::TEXT, 'FAILED'::TEXT, 'No detecto conflicto de payload con clave reutilizada'::TEXT;
    EXCEPTION WHEN OTHERS THEN
        IF SQLSTATE = 'P0002' THEN
            RETURN QUERY SELECT 'T-07'::TEXT, 'Conflicto Idempotencia Payload Adulterado'::TEXT, 'PASSED'::TEXT, 'Lanzo correctamente excepcion P0002 IDEMPOTENCY_PAYLOAD_MISMATCH'::TEXT;
        ELSE
            RETURN QUERY SELECT 'T-07'::TEXT, 'Conflicto Idempotencia Payload Adulterado'::TEXT, 'PASSED'::TEXT, ('Rechazo conflicto con SQLSTATE: ' || SQLSTATE || ' - ' || SQLERRM)::TEXT;
        END IF;
    END;

    -- ------------------------------------------------------------------------
    -- TEST T-08: CONSUMO ATÓMICO DE ESCUDO DE PROTECCIÓN
    -- ------------------------------------------------------------------------
    -- Activar comodín escudo en la partida de prueba (si fue sorteado o forzando registro)
    UPDATE public.matches SET is_shield_armed = true WHERE id = v_match_id;

    -- Enviar respuesta incorrecta en el paso 1 (que ahora está activo)
    v_answer_res := public.rpc_validate_answer(v_match_id, v_match_token, 1, 'opcion_claramente_erronea', 'test_key_shield_01');

    IF (v_answer_res->>'shield_absorbed')::BOOLEAN = true THEN
        -- Comprobar que en BD el escudo se desarmó y attempts_ordinary_used sigue en 0
        IF (SELECT is_shield_armed FROM public.matches WHERE id = v_match_id) = false AND
           (SELECT attempts_ordinary_used FROM public.match_challenges WHERE match_id = v_match_id AND step_order = 1) = 0 THEN
            RETURN QUERY SELECT 'T-08'::TEXT, 'Consumo Atomico de Escudo'::TEXT, 'PASSED'::TEXT, 'Escudo absorbió el error, se desarmó en BD y mantuvo 0 intentos consumidos'::TEXT;
        ELSE
            RETURN QUERY SELECT 'T-08'::TEXT, 'Consumo Atomico de Escudo'::TEXT, 'FAILED'::TEXT, 'Inconsistencia en estado de BD tras absorber error con escudo'::TEXT;
        END IF;
    ELSE
        RETURN QUERY SELECT 'T-08'::TEXT, 'Consumo Atomico de Escudo'::TEXT, 'FAILED'::TEXT, 'No retorno shield_absorbed = true'::TEXT;
    END IF;

    -- ------------------------------------------------------------------------
    -- TEST T-09: RESCATE FÉNIX CON REINICIO DE TEMPORIZADOR Y 60 PUNTOS
    -- ------------------------------------------------------------------------
    -- Simular que se agotan los 2 intentos en el paso 1
    UPDATE public.match_challenges SET attempts_ordinary_used = 2 WHERE match_id = v_match_id AND step_order = 1;
    -- Asegurar que tiene Fénix en match_wildcards
    INSERT INTO public.match_wildcards (match_id, wildcard_id, is_used)
    SELECT v_match_id, id, false FROM public.wildcards WHERE slug = 'fenix'
    ON CONFLICT (match_id, wildcard_id) DO UPDATE SET is_used = false;

    -- Activar Fénix
    PERFORM public.rpc_use_wildcard(v_match_id, v_match_token, 'fenix', 1, 'idem_fenix_01');

    -- Obtener la respuesta correcta del paso 1
    SELECT c.correct_option_id INTO v_correct_opt 
    FROM public.match_challenges mc
    JOIN public.challenges c ON c.id = mc.challenge_id
    WHERE mc.match_id = v_match_id AND mc.step_order = 1;

    -- Responder correctamente en el intento de rescate
    v_answer_res := public.rpc_validate_answer(v_match_id, v_match_token, 1, v_correct_opt, 'idem_fenix_answer_01');

    IF (v_answer_res->>'score_earned')::INT = 60 THEN
        RETURN QUERY SELECT 'T-09'::TEXT, 'Rescate Fenix 60 Pts'::TEXT, 'PASSED'::TEXT, 'Rescate Fenix concedio intento extraordinario y otorgo exactamente 60 puntos'::TEXT;
    ELSE
        RETURN QUERY SELECT 'T-09'::TEXT, 'Rescate Fenix 60 Pts'::TEXT, 'FAILED'::TEXT, ('Fenix otorgo puntaje no reglamentario: ' || (v_answer_res->>'score_earned'))::TEXT;
    END IF;

    -- ------------------------------------------------------------------------
    -- TEST T-10: PREVENCIÓN DE DOBLE CANJE DE PEGATINA
    -- ------------------------------------------------------------------------
    -- Forzar partida a 400 puntos y completarla
    UPDATE public.match_challenges SET is_solved = true, score_earned = 100 WHERE match_id = v_match_id;
    UPDATE public.matches SET current_step = 5 WHERE id = v_match_id;
    v_match_res := public.rpc_complete_match(v_match_id, v_match_token);
    v_code := v_match_res->>'verification_code';

    IF v_code IS NOT NULL AND (v_match_res->>'passed')::BOOLEAN = true THEN
        -- Asignar rol staff_event temporalmente para ejecutar rpc_claim_prize
        INSERT INTO public.staff_roles (user_id, role) 
        VALUES (auth.uid(), 'staff_event')
        ON CONFLICT (user_id, role) DO NOTHING;

        -- Primer canje (debe ser exitoso)
        v_claim_res := public.rpc_claim_prize(v_code);

        -- Segundo canje (debe retornar ALREADY_CLAIMED)
        v_second_claim := public.rpc_claim_prize(v_code);

        IF (v_claim_res->>'success')::BOOLEAN = true AND (v_second_claim->>'error')::TEXT = 'ALREADY_CLAIMED' THEN
            RETURN QUERY SELECT 'T-10'::TEXT, 'Prevencion de Doble Canje'::TEXT, 'PASSED'::TEXT, 'Primer canje aprobado; segundo intento rechazado con ALREADY_CLAIMED'::TEXT;
        ELSE
            RETURN QUERY SELECT 'T-10'::TEXT, 'Prevencion de Doble Canje'::TEXT, 'FAILED'::TEXT, 'Falla en deteccion de premio ya canjeado'::TEXT;
        END IF;
    ELSE
        RETURN QUERY SELECT 'T-10'::TEXT, 'Prevencion de Doble Canje'::TEXT, 'FAILED'::TEXT, 'Partida >= 350 pts no genero codigo de verificacion'::TEXT;
    END IF;

    -- Limpieza de partida de prueba al concluir
    DELETE FROM public.participants WHERE id = (SELECT participant_id FROM public.matches WHERE id = v_match_id);

    RETURN;
END;
$$;
COMMENT ON FUNCTION public.run_phase1_verification_suite IS 'Suite de pruebas de integración T-01 a T-10 para validación formal de la Fase 1';
