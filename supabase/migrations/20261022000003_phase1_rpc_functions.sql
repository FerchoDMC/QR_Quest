-- ============================================================================
-- MIGRACIÓN 03: PROCEDIMIENTOS RPC BLINDADOS, IDEMPOTENCIA Y CRIPTOGRAFÍA
-- Proyecto: El Desafío Mágico de TI - Portal Institucional UIDE Loja
-- Fase: 1 - Infraestructura de Base de Datos
-- Autor: Antigravity Architect
-- Fecha: 22 de Octubre de 2026
-- ============================================================================

-- 1. FUNCIONES AUXILIARES CRIPTOGRÁFICAS RESILIENTES
-- Resuelve dinámicamente si pgcrypto reside en 'extensions' o en 'public'
CREATE OR REPLACE FUNCTION public.gen_secret_token()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN encode(extensions.gen_random_bytes(32), 'hex');
EXCEPTION WHEN undefined_function THEN
    RETURN encode(public.gen_random_bytes(32), 'hex');
END;
$$;

CREATE OR REPLACE FUNCTION public.hash_secret_token(p_token TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN encode(extensions.digest(p_token::bytea, 'sha256'), 'hex');
EXCEPTION WHEN undefined_function THEN
    RETURN encode(public.digest(p_token::bytea, 'sha256'), 'hex');
END;
$$;

CREATE OR REPLACE FUNCTION public.gen_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN 'TI-' || upper(encode(extensions.gen_random_bytes(3), 'hex'));
EXCEPTION WHEN undefined_function THEN
    RETURN 'TI-' || upper(encode(public.gen_random_bytes(3), 'hex'));
END;
$$;

-- 2. RPC: INICIAR PARTIDA
-- Sortea 5 retos, 1-3 comodines, inicializa temporizador SOLO en paso 0 y genera token
CREATE OR REPLACE FUNCTION public.rpc_start_match(p_display_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_clean_name TEXT;
    v_participant_id UUID;
    v_match_id UUID;
    v_raw_token TEXT;
    v_token_hash TEXT;
    v_wildcard_count INT;
    v_rand FLOAT;
    v_challenges JSONB;
    v_wildcards JSONB;
    v_challenge_record RECORD;
    v_wildcard_record RECORD;
    v_step_idx INT := 0;
BEGIN
    -- A. Validación de entrada
    v_clean_name := trim(p_display_name);
    IF char_length(v_clean_name) < 2 OR char_length(v_clean_name) > 50 THEN
        RAISE EXCEPTION 'El nombre debe tener entre 2 y 50 caracteres' USING ERRCODE = '22023';
    END IF;

    -- B. Generación de credenciales criptográficas de sesión
    v_raw_token := public.gen_secret_token();
    v_token_hash := public.hash_secret_token(v_raw_token);

    -- C. Registrar participante
    INSERT INTO public.participants (display_name)
    VALUES (v_clean_name)
    RETURNING id INTO v_participant_id;

    -- D. Sorteo probabilístico de cantidad de comodines: 1 (40%), 2 (40%), 3 (20%)
    v_rand := random();
    IF v_rand < 0.40 THEN
        v_wildcard_count := 1;
    ELSIF v_rand < 0.80 THEN
        v_wildcard_count := 2;
    ELSE
        v_wildcard_count := 3;
    END IF;

    -- E. Registrar partida
    INSERT INTO public.matches (participant_id, session_token_hash, status, total_score, current_step)
    VALUES (v_participant_id, v_token_hash, 'in_progress', 0, 0)
    RETURNING id INTO v_match_id;

    -- F. Sorteo de 5 desafíos únicos activos
    -- Paso 0: started_at = clock_timestamp(); Pasos 1 a 4: started_at = NULL (activación secuencial)
    FOR v_challenge_record IN (
        SELECT id FROM public.challenges 
        WHERE is_active = true 
        ORDER BY random() 
        LIMIT 5
    ) LOOP
        INSERT INTO public.match_challenges (
            match_id, challenge_id, step_order, attempts_ordinary_used, 
            extra_time_secs, is_solved, score_earned, started_at
        ) VALUES (
            v_match_id, 
            v_challenge_record.id, 
            v_step_idx, 
            0, 
            0, 
            false, 
            0, 
            CASE WHEN v_step_idx = 0 THEN clock_timestamp() ELSE NULL END
        );
        v_step_idx := v_step_idx + 1;
    END LOOP;

    -- G. Sorteo de comodines sin repetición
    FOR v_wildcard_record IN (
        SELECT id FROM public.wildcards 
        WHERE is_active = true 
        ORDER BY random() 
        LIMIT v_wildcard_count
    ) LOOP
        INSERT INTO public.match_wildcards (match_id, wildcard_id, is_used)
        VALUES (v_match_id, v_wildcard_record.id, false);
    END LOOP;

    -- H. Registrar evento en auditoría
    INSERT INTO public.match_audit_logs (match_id, step_order, event_type, payload, actor)
    VALUES (v_match_id, 0, 'match_started', jsonb_build_object('participant', v_clean_name, 'wildcards_count', v_wildcard_count), 'participant');

    -- I. Preparar payload de retorno (usando la vista pública sanitizada)
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', cp.id,
            'slug', cp.slug,
            'title', cp.title,
            'type', cp.type,
            'icon', cp.icon,
            'duration_secs', cp.duration_secs,
            'ti_skill', cp.ti_skill,
            'description', cp.description,
            'question', cp.question,
            'options', cp.options,
            'hint', cp.hint,
            'explanation', cp.explanation,
            'step_order', mc.step_order
        ) ORDER BY mc.step_order
    ) INTO v_challenges
    FROM public.match_challenges mc
    JOIN public.challenges_public cp ON cp.id = mc.challenge_id
    WHERE mc.match_id = v_match_id;

    SELECT jsonb_agg(
        jsonb_build_object(
            'id', w.id,
            'slug', w.slug,
            'name', w.name,
            'type', w.type,
            'emoji', w.emoji,
            'short_desc', w.short_desc,
            'description', w.description,
            'is_used', mw.is_used
        )
    ) INTO v_wildcards
    FROM public.match_wildcards mw
    JOIN public.wildcards w ON w.id = mw.wildcard_id
    WHERE mw.match_id = v_match_id;

    RETURN jsonb_build_object(
        'match_id', v_match_id,
        'match_token', v_raw_token,
        'participant_name', v_clean_name,
        'challenges', v_challenges,
        'wildcards', v_wildcards
    );
END;
$$;

-- 3. RPC: VALIDAR RESPUESTA
-- Bloqueo transaccional FOR UPDATE, idempotencia rigurosa, temporizador de servidor,
-- escudo atómico, puntuación 100/60/0 y avance secuencial
CREATE OR REPLACE FUNCTION public.rpc_validate_answer(
    p_match_id UUID,
    p_match_token TEXT,
    p_step INT,
    p_selected_option_id TEXT,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_match RECORD;
    v_mc RECORD;
    v_challenge RECORD;
    v_cached_req JSONB;
    v_cached_res JSONB;
    v_current_payload JSONB;
    v_token_hash TEXT;
    v_time_limit INT;
    v_elapsed_seconds FLOAT;
    v_is_correct BOOLEAN;
    v_score_earned INT := 0;
    v_response JSONB;
BEGIN
    -- A. Bloqueo transaccional exclusivo de la partida (Previene condiciones de carrera)
    v_token_hash := public.hash_secret_token(p_match_token);

    SELECT * INTO v_match 
    FROM public.matches 
    WHERE id = p_match_id AND session_token_hash = v_token_hash 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acceso denegado: token o partida invalida' USING ERRCODE = '42501';
    END IF;

    -- B. Verificación de Idempotencia dentro del lock
    v_current_payload := jsonb_build_object('step', p_step, 'selected_option_id', p_selected_option_id);

    SELECT request_payload, response_payload INTO v_cached_req, v_cached_res
    FROM public.idempotency_records
    WHERE idempotency_key = p_idempotency_key AND match_id = p_match_id;

    IF FOUND THEN
        -- Contrato de error explícito ante conflicto de payload reutilizado
        IF v_cached_req != v_current_payload THEN
            RAISE EXCEPTION 'IDEMPOTENCY_PAYLOAD_MISMATCH: The idempotency key % was previously used with a different request payload', p_idempotency_key
                USING ERRCODE = 'P0002';
        END IF;
        -- Reintento idéntico: devuelve resultado original sin repetir efectos
        RETURN v_cached_res;
    END IF;

    -- C. Validar estado de la partida y paso
    IF v_match.status != 'in_progress' THEN
        RAISE EXCEPTION 'La partida no se encuentra en curso' USING ERRCODE = '22023';
    END IF;

    IF v_match.current_step != p_step THEN
        RAISE EXCEPTION 'Paso desfasado. Paso actual de la partida: %', v_match.current_step USING ERRCODE = '22023';
    END IF;

    -- D. Obtener reto activo y verificar temporizador
    SELECT mc.*, c.duration_secs, c.correct_option_id, c.explanation 
    INTO v_mc
    FROM public.match_challenges mc
    JOIN public.challenges c ON c.id = mc.challenge_id
    WHERE mc.match_id = p_match_id AND mc.step_order = p_step;

    IF v_mc.is_solved THEN
        RAISE EXCEPTION 'El reto de este paso ya ha sido resuelto' USING ERRCODE = '22023';
    END IF;

    -- Control de tiempo con margen fijo de 7 segundos
    v_time_limit := v_mc.duration_secs + v_mc.extra_time_secs + 7;
    v_elapsed_seconds := extract(epoch from (clock_timestamp() - v_mc.started_at));

    IF v_elapsed_seconds > v_time_limit THEN
        -- Fallo por expiración de tiempo
        IF v_mc.phoenix_rescue_granted AND NOT v_mc.phoenix_rescue_used THEN
            -- Rescate Fénix expirado por tiempo
            UPDATE public.match_challenges 
            SET phoenix_rescue_used = true, resolved_at = clock_timestamp()
            WHERE match_id = p_match_id AND step_order = p_step;

            UPDATE public.matches 
            SET current_step = current_step + 1, last_activity_at = clock_timestamp()
            WHERE id = p_match_id;

            IF p_step < 4 THEN
                UPDATE public.match_challenges 
                SET started_at = clock_timestamp() 
                WHERE match_id = p_match_id AND step_order = p_step + 1;
            END IF;

            v_response := jsonb_build_object(
                'is_correct', false,
                'timeout', true,
                'message', 'El tiempo del rescate Fénix ha expirado.',
                'exhausted', true,
                'explanation', v_mc.explanation
            );
        ELSE
            -- Intento ordinario expirado por tiempo
            IF v_mc.attempts_ordinary_used >= 2 AND NOT (v_mc.phoenix_rescue_granted AND NOT v_mc.phoenix_rescue_used) THEN
                RAISE EXCEPTION 'Los intentos ordinarios para este desafio ya se encuentran agotados' USING ERRCODE = '22023';
            END IF;

            UPDATE public.match_challenges 
            SET attempts_ordinary_used = attempts_ordinary_used + 1
            WHERE match_id = p_match_id AND step_order = p_step;

            IF v_mc.attempts_ordinary_used + 1 >= 2 THEN
                -- Se agotaron los 2 intentos ordinarios
                -- Comprobar si tiene Fénix en inventario
                IF EXISTS (
                    SELECT 1 FROM public.match_wildcards mw
                    JOIN public.wildcards w ON w.id = mw.wildcard_id
                    WHERE mw.match_id = p_match_id AND w.slug = 'fenix' AND mw.is_used = false
                ) THEN
                    v_response := jsonb_build_object(
                        'is_correct', false,
                        'timeout', true,
                        'message', 'Tiempo agotado. Tienes el Fénix Salvador disponible para un intento extraordinario.',
                        'exhausted', true,
                        'allow_phoenix', true,
                        'explanation', v_mc.explanation
                    );
                ELSE
                    -- Cierre en 0 pts y avance
                    UPDATE public.match_challenges 
                    SET resolved_at = clock_timestamp()
                    WHERE match_id = p_match_id AND step_order = p_step;

                    UPDATE public.matches 
                    SET current_step = current_step + 1, last_activity_at = clock_timestamp()
                    WHERE id = p_match_id;

                    IF p_step < 4 THEN
                        UPDATE public.match_challenges 
                        SET started_at = clock_timestamp() 
                        WHERE match_id = p_match_id AND step_order = p_step + 1;
                    END IF;

                    v_response := jsonb_build_object(
                        'is_correct', false,
                        'timeout', true,
                        'message', 'Tiempo agotado. Intentos finalizados.',
                        'exhausted', true,
                        'allow_phoenix', false,
                        'explanation', v_mc.explanation
                    );
                END IF;
            ELSE
                v_response := jsonb_build_object(
                    'is_correct', false,
                    'timeout', true,
                    'message', 'El tiempo ha expirado para este intento. Te queda 1 intento.',
                    'attempts_left', 1
                );
            END IF;
        END IF;

        -- Registrar en idempotencia y retornar
        INSERT INTO public.idempotency_records (idempotency_key, match_id, step_order, operation_type, request_payload, response_payload)
        VALUES (p_idempotency_key, p_match_id, p_step, 'validate_answer', v_current_payload, v_response);

        RETURN v_response;
    END IF;

    -- E. Evaluación de Acierto / Error
    v_is_correct := (p_selected_option_id = v_mc.correct_option_id);

    IF v_is_correct THEN
        -- RESPUESTA CORRECTA
        IF v_mc.phoenix_rescue_granted AND NOT v_mc.phoenix_rescue_used THEN
            v_score_earned := 60;
            UPDATE public.match_challenges 
            SET is_solved = true, score_earned = 60, resolved_by = 'phoenix_rescue', 
                phoenix_rescue_used = true, resolved_at = clock_timestamp()
            WHERE match_id = p_match_id AND step_order = p_step;
        ELSIF v_mc.attempts_ordinary_used = 0 THEN
            v_score_earned := 100;
            UPDATE public.match_challenges 
            SET is_solved = true, score_earned = 100, resolved_by = 'first_ordinary', 
                resolved_at = clock_timestamp()
            WHERE match_id = p_match_id AND step_order = p_step;
        ELSE
            v_score_earned := 60;
            UPDATE public.match_challenges 
            SET is_solved = true, score_earned = 60, resolved_by = 'second_ordinary', 
                resolved_at = clock_timestamp()
            WHERE match_id = p_match_id AND step_order = p_step;
        END IF;

        -- Actualizar acumulado de partida y avanzar de paso
        UPDATE public.matches 
        SET total_score = total_score + v_score_earned, 
            current_step = current_step + 1, 
            last_activity_at = clock_timestamp()
        WHERE id = p_match_id;

        -- Inicializar temporizador secuencial del siguiente reto si existe
        IF p_step < 4 THEN
            UPDATE public.match_challenges 
            SET started_at = clock_timestamp() 
            WHERE match_id = p_match_id AND step_order = p_step + 1;
        END IF;

        v_response := jsonb_build_object(
            'is_correct', true,
            'score_earned', v_score_earned,
            'total_score', v_match.total_score + v_score_earned,
            'explanation', v_mc.explanation
        );
    ELSE
        -- RESPUESTA INCORRECTA
        -- 1. Verificación atómica de Escudo de Protección
        IF v_match.is_shield_armed THEN
            UPDATE public.matches 
            SET is_shield_armed = false, last_activity_at = clock_timestamp()
            WHERE id = p_match_id;

            INSERT INTO public.match_audit_logs (match_id, step_order, event_type, payload, actor)
            VALUES (p_match_id, p_step, 'shield_absorbed', jsonb_build_object('message', 'Escudo absorbió error'), 'participant');

            v_response := jsonb_build_object(
                'is_correct', false,
                'shield_absorbed', true,
                'message', 'El Escudo de Protección absorbió el error. No has perdido ningún intento.'
            );
        ELSE
            -- 2. Sin escudo: descontar vidas
            IF v_mc.phoenix_rescue_granted AND NOT v_mc.phoenix_rescue_used THEN
                -- Falló el rescate de Fénix: fin de ese reto (0 pts) y avance
                UPDATE public.match_challenges 
                SET phoenix_rescue_used = true, resolved_at = clock_timestamp()
                WHERE match_id = p_match_id AND step_order = p_step;

                UPDATE public.matches 
                SET current_step = current_step + 1, last_activity_at = clock_timestamp()
                WHERE id = p_match_id;

                IF p_step < 4 THEN
                    UPDATE public.match_challenges 
                    SET started_at = clock_timestamp() 
                    WHERE match_id = p_match_id AND step_order = p_step + 1;
                END IF;

                v_response := jsonb_build_object(
                    'is_correct', false,
                    'shield_absorbed', false,
                    'message', 'El intento del Fénix ha fallado.',
                    'exhausted', true,
                    'allow_phoenix', false,
                    'explanation', v_mc.explanation
                );
            ELSE
                IF v_mc.attempts_ordinary_used >= 2 THEN
                    RAISE EXCEPTION 'Los intentos ordinarios para este desafio ya se encuentran agotados' USING ERRCODE = '22023';
                END IF;

                UPDATE public.match_challenges 
                SET attempts_ordinary_used = attempts_ordinary_used + 1
                WHERE match_id = p_match_id AND step_order = p_step;

                IF v_mc.attempts_ordinary_used + 1 >= 2 THEN
                    -- Agotados los 2 intentos ordinarios
                    IF EXISTS (
                        SELECT 1 FROM public.match_wildcards mw
                        JOIN public.wildcards w ON w.id = mw.wildcard_id
                        WHERE mw.match_id = p_match_id AND w.slug = 'fenix' AND mw.is_used = false
                    ) THEN
                        v_response := jsonb_build_object(
                            'is_correct', false,
                            'shield_absorbed', false,
                            'message', 'Has agotado tus intentos ordinarios, pero tienes el Fénix Salvador disponible.',
                            'exhausted', true,
                            'allow_phoenix', true,
                            'explanation', v_mc.explanation
                        );
                    ELSE
                        -- Cierre en 0 pts y avance
                        UPDATE public.match_challenges 
                        SET resolved_at = clock_timestamp()
                        WHERE match_id = p_match_id AND step_order = p_step;

                        UPDATE public.matches 
                        SET current_step = current_step + 1, last_activity_at = clock_timestamp()
                        WHERE id = p_match_id;

                        IF p_step < 4 THEN
                            UPDATE public.match_challenges 
                            SET started_at = clock_timestamp() 
                            WHERE match_id = p_match_id AND step_order = p_step + 1;
                        END IF;

                        v_response := jsonb_build_object(
                            'is_correct', false,
                            'shield_absorbed', false,
                            'message', 'Intentos agotados. La magia revela el misterio.',
                            'exhausted', true,
                            'allow_phoenix', false,
                            'explanation', v_mc.explanation
                        );
                    END IF;
                ELSE
                    v_response := jsonb_build_object(
                        'is_correct', false,
                        'shield_absorbed', false,
                        'message', 'Respuesta incorrecta. Te queda 1 intento.',
                        'attempts_left', 1
                    );
                END IF;
            END IF;
        END IF;
    END IF;

    -- F. Registro de idempotencia y auditoría
    INSERT INTO public.idempotency_records (idempotency_key, match_id, step_order, operation_type, request_payload, response_payload)
    VALUES (p_idempotency_key, p_match_id, p_step, 'validate_answer', v_current_payload, v_response);

    INSERT INTO public.match_audit_logs (match_id, step_order, event_type, payload, actor)
    VALUES (p_match_id, p_step, 'answer_submitted', jsonb_build_object('selected_option', p_selected_option_id, 'is_correct', v_is_correct, 'score', v_score_earned), 'participant');

    RETURN v_response;
END;
$$;

-- 4. RPC: ACTIVAR COMODÍN
-- Giratiempo (+20s), Fénix (rescate con reset de timer), Escudo, Sabiduría, Ayuda Social y Felix
CREATE OR REPLACE FUNCTION public.rpc_use_wildcard(
    p_match_id UUID,
    p_match_token TEXT,
    p_wildcard_slug TEXT,
    p_step INT,
    p_idempotency_key TEXT,
    p_target_slug TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_match RECORD;
    v_token_hash TEXT;
    v_current_payload JSONB;
    v_cached_req JSONB;
    v_cached_res JSONB;
    v_wildcard_id INT;
    v_response JSONB;
    v_discarded JSONB;
    v_challenge RECORD;
BEGIN
    -- A. Bloqueo transaccional
    v_token_hash := public.hash_secret_token(p_match_token);

    SELECT * INTO v_match 
    FROM public.matches 
    WHERE id = p_match_id AND session_token_hash = v_token_hash 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acceso denegado: token o partida invalida' USING ERRCODE = '42501';
    END IF;

    -- B. Idempotencia con verificación de payload
    v_current_payload := jsonb_build_object('wildcard_slug', p_wildcard_slug, 'step', p_step, 'target_slug', p_target_slug);

    SELECT request_payload, response_payload INTO v_cached_req, v_cached_res
    FROM public.idempotency_records
    WHERE idempotency_key = p_idempotency_key AND match_id = p_match_id;

    IF FOUND THEN
        IF v_cached_req != v_current_payload THEN
            RAISE EXCEPTION 'IDEMPOTENCY_PAYLOAD_MISMATCH: The idempotency key % was previously used with a different request payload', p_idempotency_key
                USING ERRCODE = 'P0002';
        END IF;
        RETURN v_cached_res;
    END IF;

    -- C. Verificar comodín disponible
    SELECT w.id INTO v_wildcard_id
    FROM public.match_wildcards mw
    JOIN public.wildcards w ON w.id = mw.wildcard_id
    WHERE mw.match_id = p_match_id AND w.slug = p_wildcard_slug AND mw.is_used = false;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El comodin solicitado no existe o ya ha sido consumido' USING ERRCODE = '22023';
    END IF;

    -- D. Aplicar efecto específico
    CASE p_wildcard_slug
        WHEN 'escudo' THEN
            UPDATE public.matches SET is_shield_armed = true WHERE id = p_match_id;
            v_response := jsonb_build_object('success', true, 'slug', 'escudo', 'message', '🛡️ Escudo armado. Tu próximo error será absorbido.');

        WHEN 'giratiempo' THEN
            UPDATE public.match_challenges 
            SET extra_time_secs = extra_time_secs + 20 
            WHERE match_id = p_match_id AND step_order = p_step;
            v_response := jsonb_build_object('success', true, 'slug', 'giratiempo', 'extra_seconds', 20, 'message', '⏳ +20 segundos concedidos por el Giratiempo.');

        WHEN 'fenix' THEN
            -- Solo se permite si agotó los intentos ordinarios y no se ha resuelto
            IF NOT EXISTS (
                SELECT 1 FROM public.match_challenges 
                WHERE match_id = p_match_id AND step_order = p_step 
                  AND attempts_ordinary_used >= 2 AND is_solved = false AND phoenix_rescue_granted = false
            ) THEN
                RAISE EXCEPTION 'El Fénix Salvador solo puede activarse cuando se agotan los intentos ordinarios de este reto' USING ERRCODE = '22023';
            END IF;

            -- Concede 1 intento extraordinario y REINICIA el temporizador para la duración reglamentaria
            UPDATE public.match_challenges 
            SET phoenix_rescue_granted = true,
                phoenix_rescue_used = false,
                started_at = clock_timestamp()
            WHERE match_id = p_match_id AND step_order = p_step;

            v_response := jsonb_build_object('success', true, 'slug', 'fenix', 'message', '🔥 Fénix Salvador activado. Temporizador reiniciado con 1 intento de rescate.');

        WHEN 'sabiduria' THEN
            -- Seleccionar 2 opciones erróneas de la tabla de retos
            SELECT c.options, c.correct_option_id INTO v_challenge
            FROM public.match_challenges mc
            JOIN public.challenges c ON c.id = mc.challenge_id
            WHERE mc.match_id = p_match_id AND mc.step_order = p_step;

            SELECT jsonb_agg(opt->>'id') INTO v_discarded
            FROM (
                SELECT opt 
                FROM jsonb_array_elements(v_challenge.options) AS opt
                WHERE opt->>'id' != v_challenge.correct_option_id
                ORDER BY random()
                LIMIT 2
            ) sub;

            v_response := jsonb_build_object('success', true, 'slug', 'sabiduria', 'discarded_options', v_discarded, 'message', '🧪 2 opciones incorrectas han sido disueltas.');

        WHEN 'ayuda_mago' THEN
            v_response := jsonb_build_object('success', true, 'slug', 'ayuda_mago', 'is_social', true, 'message', '🧙 Misión social activada.');

        WHEN 'felix' THEN
            IF p_target_slug IS NOT NULL THEN
                IF p_target_slug = 'felix' THEN
                    RAISE EXCEPTION 'Felix Felicis no puede reactivar a otro Felix Felicis' USING ERRCODE = '22023';
                END IF;

                UPDATE public.match_wildcards mw
                SET is_used = false, used_at = NULL, used_at_step = NULL
                FROM public.wildcards w
                WHERE mw.match_id = p_match_id AND mw.wildcard_id = w.id AND w.slug = p_target_slug AND mw.is_used = true;

                IF NOT FOUND THEN
                    RAISE EXCEPTION 'El comodin objetivo % no se encuentra en estado consumido', p_target_slug USING ERRCODE = '22023';
                END IF;

                v_response := jsonb_build_object('success', true, 'slug', 'felix', 'action', 'recycle', 'reactivated_slug', p_target_slug, 'message', '✨ Comodin ' || p_target_slug || ' reactivado con exito.');
            ELSE
                -- Si no especifico target, entrega la pista del grimorio
                SELECT c.hint INTO v_challenge 
                FROM public.match_challenges mc 
                JOIN public.challenges c ON c.id = mc.challenge_id 
                WHERE mc.match_id = p_match_id AND mc.step_order = p_step;

                v_response := jsonb_build_object('success', true, 'slug', 'felix', 'action', 'hint', 'hint', v_challenge.hint, 'message', '✨ Pista revelada por Felix Felicis.');
            END IF;
    END CASE;

    -- E. Marcar comodín como consumido
    UPDATE public.match_wildcards 
    SET is_used = true, used_at_step = p_step, used_at = clock_timestamp()
    WHERE match_id = p_match_id AND wildcard_id = v_wildcard_id;

    -- F. Registro de idempotencia y auditoría
    INSERT INTO public.idempotency_records (idempotency_key, match_id, step_order, operation_type, request_payload, response_payload)
    VALUES (p_idempotency_key, p_match_id, p_step, 'use_wildcard', v_current_payload, v_response);

    INSERT INTO public.match_audit_logs (match_id, step_order, event_type, payload, actor)
    VALUES (p_match_id, p_step, 'wildcard_activated', jsonb_build_object('slug', p_wildcard_slug), 'participant');

    RETURN v_response;
END;
$$;

-- 5. RPC: COMPLETAR PARTIDA
-- Recalcula puntaje de forma segura y emite código de verificación solo si total_score >= 350
CREATE OR REPLACE FUNCTION public.rpc_complete_match(
    p_match_id UUID,
    p_match_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_match RECORD;
    v_token_hash TEXT;
    v_actual_score INT;
    v_code TEXT := NULL;
    v_status public.match_status;
    v_prize public.prize_status;
BEGIN
    v_token_hash := public.hash_secret_token(p_match_token);

    SELECT * INTO v_match 
    FROM public.matches 
    WHERE id = p_match_id AND session_token_hash = v_token_hash 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acceso denegado: token o partida invalida' USING ERRCODE = '42501';
    END IF;

    -- Recalcular puntaje matemáticamente sumando retos
    SELECT COALESCE(SUM(score_earned), 0) INTO v_actual_score
    FROM public.match_challenges
    WHERE match_id = p_match_id;

    IF v_actual_score >= 350 THEN
        v_status := 'completed_passed';
        v_prize := 'pending';
        v_code := public.gen_verification_code();
    ELSE
        v_status := 'completed_failed';
        v_prize := 'not_eligible';
        v_code := NULL;
    END IF;

    UPDATE public.matches 
    SET total_score = v_actual_score,
        status = v_status,
        prize_status = v_prize,
        verification_code = v_code,
        completed_at = clock_timestamp(),
        last_activity_at = clock_timestamp()
    WHERE id = p_match_id;

    INSERT INTO public.match_audit_logs (match_id, step_order, event_type, payload, actor)
    VALUES (p_match_id, 4, 'match_completed', jsonb_build_object('final_score', v_actual_score, 'status', v_status, 'code', v_code), 'participant');

    RETURN jsonb_build_object(
        'total_score', v_actual_score,
        'passed', (v_actual_score >= 350),
        'verification_code', v_code,
        'prize_status', v_prize
    );
END;
$$;

-- 6. RPC: ESTADO DE PARTIDA (RECUPERACIÓN TRAS RECARGA O PÉRDIDA DE RED)
CREATE OR REPLACE FUNCTION public.rpc_get_match_state(
    p_match_id UUID,
    p_match_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_match RECORD;
    v_token_hash TEXT;
    v_challenges JSONB;
    v_wildcards JSONB;
BEGIN
    v_token_hash := public.hash_secret_token(p_match_token);

    SELECT * INTO v_match 
    FROM public.matches 
    WHERE id = p_match_id AND session_token_hash = v_token_hash;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acceso denegado: token o partida invalida' USING ERRCODE = '42501';
    END IF;

    -- Obtener estado de retos
    SELECT jsonb_agg(
        jsonb_build_object(
            'step_order', mc.step_order,
            'is_solved', mc.is_solved,
            'attempts_ordinary_used', mc.attempts_ordinary_used,
            'phoenix_rescue_granted', mc.phoenix_rescue_granted,
            'phoenix_rescue_used', mc.phoenix_rescue_used,
            'extra_time_secs', mc.extra_time_secs,
            'score_earned', mc.score_earned,
            'started_at', mc.started_at,
            'challenge', jsonb_build_object(
                'id', cp.id,
                'slug', cp.slug,
                'title', cp.title,
                'type', cp.type,
                'icon', cp.icon,
                'duration_secs', cp.duration_secs,
                'ti_skill', cp.ti_skill,
                'description', cp.description,
                'question', cp.question,
                'options', cp.options,
                'hint', cp.hint,
                'explanation', cp.explanation
            )
        ) ORDER BY mc.step_order
    ) INTO v_challenges
    FROM public.match_challenges mc
    JOIN public.challenges_public cp ON cp.id = mc.challenge_id
    WHERE mc.match_id = p_match_id;

    -- Obtener estado de comodines
    SELECT jsonb_agg(
        jsonb_build_object(
            'slug', w.slug,
            'name', w.name,
            'is_used', mw.is_used,
            'used_at_step', mw.used_at_step
        )
    ) INTO v_wildcards
    FROM public.match_wildcards mw
    JOIN public.wildcards w ON w.id = mw.wildcard_id
    WHERE mw.match_id = p_match_id;

    RETURN jsonb_build_object(
        'match_id', v_match.id,
        'status', v_match.status,
        'total_score', v_match.total_score,
        'current_step', v_match.current_step,
        'is_shield_armed', v_match.is_shield_armed,
        'verification_code', v_match.verification_code,
        'prize_status', v_match.prize_status,
        'challenges', v_challenges,
        'wildcards', v_wildcards
    );
END;
$$;

-- 7. RPC: RECLAMAR PREMIO (EXCLUSIVO STAFF AUTORIZADO)
CREATE OR REPLACE FUNCTION public.rpc_claim_prize(p_verification_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_clean_code TEXT;
    v_match RECORD;
    v_participant RECORD;
BEGIN
    -- A. Verificación estricta de autorización de staff
    IF NOT public.is_staff('staff_event') AND NOT public.is_staff('superadmin') THEN
        RAISE EXCEPTION 'Acceso denegado: rol de staff no autorizado para canjear premios' USING ERRCODE = '42501';
    END IF;

    v_clean_code := upper(trim(p_verification_code));

    -- B. Bloqueo transaccional de la fila de la partida
    SELECT * INTO v_match 
    FROM public.matches 
    WHERE verification_code = v_clean_code 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Codigo de verificacion no encontrado' USING ERRCODE = '22023';
    END IF;

    -- C. Prevención de doble entrega
    IF v_match.prize_status = 'claimed' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'ALREADY_CLAIMED',
            'message', 'Este premio ya ha sido entregado anteriormente.',
            'claimed_at', v_match.prize_claimed_at,
            'claimed_by', v_match.prize_claimed_by
        );
    END IF;

    -- D. Verificar mérito
    IF v_match.status != 'completed_passed' OR v_match.total_score < 350 THEN
        RAISE EXCEPTION 'La partida no cumple los requisitos para canje de pegatina' USING ERRCODE = '22023';
    END IF;

    -- E. Canje atómico
    UPDATE public.matches 
    SET prize_status = 'claimed',
        prize_claimed_at = clock_timestamp(),
        prize_claimed_by = auth.uid(),
        last_activity_at = clock_timestamp()
    WHERE id = v_match.id;

    SELECT display_name INTO v_participant FROM public.participants WHERE id = v_match.participant_id;

    INSERT INTO public.match_audit_logs (match_id, step_order, event_type, payload, actor)
    VALUES (v_match.id, 4, 'prize_claimed', jsonb_build_object('code', v_clean_code, 'claimed_by', auth.uid()), auth.uid()::text);

    RETURN jsonb_build_object(
        'success', true,
        'message', '¡Pegatina entregada exitosamente!',
        'participant_name', v_participant.display_name,
        'score', v_match.total_score,
        'claimed_at', clock_timestamp()
    );
END;
$$;

-- 8. GESTIÓN DE PRIVILEGIOS DE EJECUCIÓN (GRANT / REVOKE)
-- Revocar ejecución pública universal en esquema public
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM authenticated;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- Otorgar ejecución a funciones públicas de juego y utilitarios requeridos
GRANT EXECUTE ON FUNCTION public.is_staff(public.staff_role_type) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_start_match(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_validate_answer(UUID, TEXT, INT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_use_wildcard(UUID, TEXT, TEXT, INT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_complete_match(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_get_match_state(UUID, TEXT) TO anon, authenticated;

-- Otorgar ejecución de canje de premios EXCLUSIVAMENTE a authenticated
GRANT EXECUTE ON FUNCTION public.rpc_claim_prize(TEXT) TO authenticated;
