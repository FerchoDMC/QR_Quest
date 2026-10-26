# 📜 Plan de Evolución Técnica y Arquitectónica (Versión 2.2 — Especificación Definitiva)
## Portal Institucional UIDE Loja & El Desafío Mágico de TI

> **Documento Oficial de Planificación, Arquitectura y Registro de Diseño**  
> **Carrera:** Ingeniería en Tecnologías de la Información  
> **Institución:** Universidad Internacional del Ecuador (UIDE) — Sede Loja  
> **Estado:** Versión 2.2 — Especificación Definitiva Previa a Implementación  
> **Aprobaciones Previas:** Revisión 2.1 Auditada el 22 de Octubre de 2026  

---

## 1. Resumen de Cambios entre Versión 2.1 y Versión 2.2

A partir del informe de auditoría técnica del 22 de octubre de 2026, se incorporan las siguientes correcciones obligatorias:

1. **Temporizadores Secuenciales por Reto:** Se elimina la inicialización simultánea de `started_at` en los 5 retos. Únicamente el reto 0 se activa al inicio de la partida. Los retos 1 al 4 inician su temporizador con `clock_timestamp()` en el momento exacto en que el jugador ingresa a dicho reto.
2. **Defensa Criptográfica contra Fuga de Esquema (`search_path = ''`):** Se adopta la estrategia estricta de endurecimiento recomendada para funciones `SECURITY DEFINER`, eliminando `search_path` ambiguos y calificando explícitamente todas las llamadas a funciones de esquemas (`extensions.digest`, `extensions.gen_random_bytes`, `public.matches`, etc.).
3. **Idempotencia Transaccional Concurrente:** El bloqueo de partida (`SELECT ... FOR UPDATE`) se adquiere **antes** de evaluar el registro de idempotencia. Se implementa detección de conflicto (`409 Conflict`) si se reutiliza una clave con un payload adulterado.
4. **Flujo y Temporizador de Rescate Fénix:** Se garantiza que el reto no avance a la siguiente pantalla cuando se agotan los 2 intentos ordinarios si el jugador dispone de Fénix. Al concederse el rescate extraordinario, el temporizador de ese reto se reinicia con la duración reglamentaria completa y la resolución correcta otorga exactamente 60 puntos.
5. **Roles Compuestos en `staff_roles`:** Se sustituye la clave primaria simple por una restricción `UNIQUE(user_id, role)`, permitiendo que una cuenta administrativa ostente múltiples roles simultáneos (ej. `staff_event` y `faculty_editor`).
6. **Revocación de Privilegios por Defecto:** Se incorpora la directiva `ALTER DEFAULT PRIVILEGES FOR ROLE postgres` para asegurar que las funciones creadas en el futuro no otorguen ejecución pública accidentalmente.

---

## 2. Decisiones Funcionales Confirmadas y Pendientes

### 2.1 Decisiones Confirmadas
* **Margen de Gracia de Red (7 segundos):** Se establece un margen estricto e improrrogable de 7 segundos sumado a `duration_secs + extra_time_secs` para compensar latencias de transporte HTTP celular. Este margen **no es acumulable ni renovable** mediante reintentos.
* **Reinicio de Partida tras No Aprobación (< 350 pts):** Si un estudiante finaliza con menos de 350 puntos, se le permite iniciar una nueva partida desde cero. Dicha partida generará un nuevo `match_id`, un nuevo `match_token` y una nueva selección aleatoria de retos y comodines, sin heredar estado alguno. Para mitigar saturación, se implementará un rate-limit en Supabase de máximo 5 partidas nuevas por hora por IP.
* **Aprovisionamiento del Primer Superadministrador:** No existirán credenciales administrativas en el repositorio ni en variables públicas. La cuenta se registrará mediante Supabase Auth y su `user_id` será insertado en `staff_roles` con rol `'superadmin'` mediante un script administrativo ejecutado directamente en el entorno seguro de Supabase.
* **Umbral Aprobatorio de Sticker ($\ge 350$ pts):** Una partida solo habilita la entrega de pegatina si acumula 350 puntos o más. Partidas con $< 350$ puntos muestran certificado de participación pero **jamás** emiten código de canje `TI-XXXXXX`.
* **Puntuación Máxima Inmutable (500 pts):** Una partida tiene un tope matemático de 500 puntos ($5 \times 100$). La base de datos aplica `CHECK (total_score >= 0 AND total_score <= 500)`.

### 2.2 Decisiones Técnicas Sujetas a Validación en Entorno Real
* **Esquema de Instalación de Extensiones en Supabase:** Supabase ubica `pgcrypto` típicamente en `extensions`. La migración verificará la presencia de la extensión mediante `CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;` y proveerá alias si reside en `public`.

---

## 3. Esquema de Base de Datos Corregido (PostgreSQL / Supabase)

```sql
-- ============================================================================
-- 1. EXTENSIONES EN ESQUEMA DESIGNADO
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- ============================================================================
-- 2. TIPOS ENUM OPERATIVOS
-- ============================================================================
CREATE TYPE public.match_status AS ENUM ('in_progress', 'completed_passed', 'completed_failed', 'abandoned');
CREATE TYPE public.prize_status AS ENUM ('not_eligible', 'pending', 'claimed');
CREATE TYPE public.attempt_type AS ENUM ('first_ordinary', 'second_ordinary', 'phoenix_rescue', 'none');
CREATE TYPE public.audit_event_type AS ENUM (
    'match_started', 
    'answer_submitted', 
    'shield_absorbed', 
    'wildcard_activated', 
    'phoenix_granted', 
    'match_completed', 
    'prize_claimed'
);
CREATE TYPE public.staff_role_type AS ENUM ('superadmin', 'staff_event', 'faculty_editor');

-- ============================================================================
-- 3. CONTROL DE ACCESO BASADO EN ROLES (RBAC MULTI-ROL)
-- ============================================================================
CREATE TABLE public.staff_roles (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.staff_role_type NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT clock_timestamp(),
    CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

-- ============================================================================
-- 4. TABLAS INSTITUCIONALES (PORTAL UIDE)
-- ============================================================================
CREATE TABLE public.faculty_members (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 3),
    academic_title TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    email TEXT,
    linkedin_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

CREATE TABLE public.student_council (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 3),
    position TEXT NOT NULL,
    period TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

CREATE TABLE public.academic_events (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL CHECK (char_length(trim(title)) >= 3),
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    category TEXT DEFAULT 'general',
    is_published BOOLEAN DEFAULT false, -- Inicialmente en false (Empty State institucional garantizado)
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- ============================================================================
-- 5. BANCO DE DESAFÍOS Y COMODINES
-- ============================================================================
CREATE TABLE public.challenges (
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
    correct_option_id TEXT NOT NULL, -- PROTEGIDO: Jamás visible en vistas públicas
    hint TEXT NOT NULL,
    explanation TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

CREATE TABLE public.wildcards (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    emoji TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- 6. PARTIDAS, SESIONES Y MECÁNICA DE JUEGO
-- ============================================================================
CREATE TABLE public.participants (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    display_name TEXT NOT NULL CHECK (char_length(trim(display_name)) >= 2 AND char_length(trim(display_name)) <= 50),
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL, -- Hash SHA-256 del match_token del cliente
    status public.match_status DEFAULT 'in_progress',
    total_score INT DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 500),
    current_step INT DEFAULT 0 CHECK (current_step >= 0 AND current_step <= 5),
    is_shield_armed BOOLEAN DEFAULT false,
    verification_code TEXT UNIQUE, -- Código oficial para staff (ej. "TI-9B2A4F")
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

CREATE TABLE public.match_challenges (
    id SERIAL PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    challenge_id INT NOT NULL REFERENCES public.challenges(id),
    step_order INT NOT NULL CHECK (step_order >= 0 AND step_order <= 4),
    attempts_ordinary_used INT DEFAULT 0 CHECK (attempts_ordinary_used >= 0 AND attempts_ordinary_used <= 2),
    phoenix_rescue_granted BOOLEAN DEFAULT false,
    phoenix_rescue_used BOOLEAN DEFAULT false,
    extra_time_secs INT DEFAULT 0, -- Tiempo acumulado por Giratiempo en este reto
    is_solved BOOLEAN DEFAULT false,
    score_earned INT DEFAULT 0 CHECK (score_earned IN (0, 60, 100)),
    resolved_by public.attempt_type DEFAULT 'none',
    used_hint BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NULL, -- CORRECCIÓN C-01: Nullable; se activa por paso
    resolved_at TIMESTAMPTZ,
    UNIQUE(match_id, step_order)
);

CREATE TABLE public.match_wildcards (
    id SERIAL PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    wildcard_id INT NOT NULL REFERENCES public.wildcards(id),
    is_used BOOLEAN DEFAULT false,
    used_at_step INT CHECK (used_at_step >= 0 AND used_at_step <= 4),
    used_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(match_id, wildcard_id)
);

-- ============================================================================
-- 7. IDEMPOTENCIA TRANSACCIONAL Y AUDITORÍA INMUTABLE
-- ============================================================================
CREATE TABLE public.idempotency_records (
    idempotency_key TEXT PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    operation_type TEXT NOT NULL,
    request_payload JSONB NOT NULL,
    response_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

CREATE TABLE public.match_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    step_order INT,
    event_type public.audit_event_type NOT NULL,
    payload JSONB NOT NULL,
    actor TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- Índices de alto rendimiento
CREATE INDEX idx_staff_roles_lookup ON public.staff_roles(user_id, role);
CREATE INDEX idx_matches_session ON public.matches(id, session_token_hash);
CREATE INDEX idx_matches_verification ON public.matches(verification_code) WHERE verification_code IS NOT NULL;
CREATE INDEX idx_match_challenges_step ON public.match_challenges(match_id, step_order);
CREATE INDEX idx_idempotency_lookup ON public.idempotency_records(idempotency_key, match_id);
CREATE INDEX idx_matches_cleanup ON public.matches(status, last_activity_at) WHERE status = 'in_progress';
CREATE INDEX idx_audit_match ON public.match_audit_logs(match_id, created_at);
```

---

## 4. Políticas RLS y Permisos de Ejecución Granulares

```sql
-- Activar RLS en todas las tablas
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_council ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_wildcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idempotency_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_audit_logs ENABLE ROW LEVEL SECURITY;

-- Función de verificación de roles con esquema protegido
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

    IF required_role IS NULL THEN
        RETURN EXISTS (SELECT 1 FROM public.staff_roles WHERE user_id = auth.uid());
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.staff_roles 
        WHERE user_id = auth.uid() 
          AND (role = required_role OR role = 'superadmin'::public.staff_role_type)
    );
END;
$$;

-- 1. Políticas de Staff Roles
CREATE POLICY "Superadmin View Staff Roles" ON public.staff_roles FOR SELECT TO authenticated USING (public.is_staff('superadmin'));
CREATE POLICY "Superadmin Manage Staff Roles" ON public.staff_roles FOR ALL TO authenticated USING (public.is_staff('superadmin')) WITH CHECK (public.is_staff('superadmin'));

-- 2. Políticas Institucionales (Lectura pública, mutación por rol autorizado)
CREATE POLICY "Public Read Faculty" ON public.faculty_members FOR SELECT USING (is_active = true);
CREATE POLICY "Staff Manage Faculty" ON public.faculty_members FOR ALL TO authenticated 
    USING (public.is_staff('faculty_editor') OR public.is_staff('superadmin')) 
    WITH CHECK (public.is_staff('faculty_editor') OR public.is_staff('superadmin'));

CREATE POLICY "Public Read Council" ON public.student_council FOR SELECT USING (is_active = true);
CREATE POLICY "Staff Manage Council" ON public.student_council FOR ALL TO authenticated 
    USING (public.is_staff('faculty_editor') OR public.is_staff('superadmin')) 
    WITH CHECK (public.is_staff('faculty_editor') OR public.is_staff('superadmin'));

CREATE POLICY "Public Read Events" ON public.academic_events FOR SELECT USING (is_published = true);
CREATE POLICY "Staff Manage Events" ON public.academic_events FOR ALL TO authenticated 
    USING (public.is_staff('staff_event') OR public.is_staff('superadmin')) 
    WITH CHECK (public.is_staff('staff_event') OR public.is_staff('superadmin'));

-- 3. Banco de Desafíos y Comodines
CREATE POLICY "Admin Read Challenges" ON public.challenges FOR SELECT TO authenticated USING (public.is_staff('superadmin'));
CREATE POLICY "Public Read Wildcards" ON public.wildcards FOR SELECT USING (is_active = true);

-- 4. Tablas Operativas del Juego: Bloqueo de escritura directa para todo cliente
CREATE POLICY "No Direct Matches" ON public.matches FOR ALL TO anon USING (false);
CREATE POLICY "Staff View Matches" ON public.matches FOR SELECT TO authenticated USING (public.is_staff());

CREATE POLICY "No Direct Match Challenges" ON public.match_challenges FOR ALL TO anon USING (false);
CREATE POLICY "Staff View Match Challenges" ON public.match_challenges FOR SELECT TO authenticated USING (public.is_staff());

CREATE POLICY "No Direct Audit" ON public.match_audit_logs FOR ALL TO anon USING (false);
CREATE POLICY "Staff View Audit" ON public.match_audit_logs FOR SELECT TO authenticated USING (public.is_staff());

CREATE POLICY "No Direct Idempotency" ON public.idempotency_records FOR ALL TO anon USING (false);

-- Vista pública desinfectada (Sin correct_option_id)
CREATE OR REPLACE VIEW public.challenges_public AS 
SELECT 
    id, slug, title, type, icon, duration_secs, 
    ti_skill, description, question, options, hint, explanation
FROM public.challenges 
WHERE is_active = true;
```

### Revocación y Control de Privilegios por Defecto
```sql
-- Revocar privilegios existentes y por defecto para funciones creadas por el rol postgres
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM authenticated;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- Otorgar ejecución granular para RPCs públicas de juego
GRANT EXECUTE ON FUNCTION public.rpc_start_match(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_validate_answer(UUID, TEXT, INT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_use_wildcard(UUID, TEXT, TEXT, INT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_complete_match(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_get_match_state(UUID, TEXT) TO anon, authenticated;

-- Otorgar ejecución de RPC administrativa exclusivamente a authenticated
GRANT EXECUTE ON FUNCTION public.rpc_claim_prize(TEXT) TO authenticated;
```

---

## 5. Procedimientos RPC Blindados con Idempotencia y Reglas de Negocio

### A. `public.rpc_start_match(p_display_name TEXT) RETURNS JSONB`
* **Definición:** `SECURITY DEFINER`, `SET search_path = ''`.
* **Lógica Atómica:**
  1. Sanitiza `p_display_name` y valida longitud entre 2 y 50 caracteres.
  2. Genera `v_raw_token := encode(extensions.gen_random_bytes(32), 'hex')`.
  3. Inserta registro en `public.participants`.
  4. Inserta partida en `public.matches` con `session_token_hash = encode(extensions.digest(v_raw_token::bytea, 'sha256'), 'hex')`.
  5. Sortea 5 desafíos aleatorios activos y los inserta en `public.match_challenges`:
     * **Paso 0:** `started_at = clock_timestamp()` (Inicia el cronómetro del reto 1).
     * **Pasos 1 al 4:** `started_at = NULL` (Pendientes de activación secuencial).
  6. Sortea 1, 2 o 3 comodines sin duplicados (40%/40%/20%) e inserta en `public.match_wildcards`.
  7. Registra `'match_started'` en `public.match_audit_logs`.
* **Retorno:** `{ match_id, match_token: v_raw_token, challenges: [5 desafíos públicos], wildcards: [...] }`.

### B. `public.rpc_validate_answer(p_match_id UUID, p_match_token TEXT, p_step INT, p_selected_option_id TEXT, p_idempotency_key TEXT) RETURNS JSONB`
* **Definición:** `SECURITY DEFINER`, `SET search_path = ''`.
* **Lógica Atómica:**
  1. **Bloqueo Exclusivo de Partida (Prevención de Carreras):**
     ```sql
     SELECT * INTO v_match FROM public.matches 
     WHERE id = p_match_id 
       AND session_token_hash = encode(extensions.digest(p_match_token::bytea, 'sha256'), 'hex') 
     FOR UPDATE;
     
     IF NOT FOUND THEN 
         RAISE EXCEPTION 'Acceso denegado: token o partida invalida' USING ERRCODE = '42501'; 
     END IF;
     ```
  2. **Verificación de Idempotencia dentro del Lock:**
     ```sql
     SELECT request_payload, response_payload INTO v_cached_req, v_cached_res 
     FROM public.idempotency_records 
     WHERE idempotency_key = p_idempotency_key AND match_id = p_match_id;

     IF FOUND THEN
         -- Detección de adulteración de payload
         IF v_cached_req != jsonb_build_object('step', p_step, 'selected_option_id', p_selected_option_id) THEN
             RAISE EXCEPTION 'Idempotency conflict: key reused with mismatched payload' USING ERRCODE = '23505';
         END IF;
         RETURN v_cached_res;
     END IF;
     ```
  3. **Validación de Estado y Paso:** Comprueba `v_match.status = 'in_progress'` y `v_match.current_step = p_step`.
  4. **Validación de Temporizador en Servidor:**
     * Obtiene `mc.started_at`, `mc.extra_time_secs` y `c.duration_secs`.
     * `v_allowed_limit := c.duration_secs + mc.extra_time_secs + 7;` (7s margen fijo de red).
     * `IF extract(epoch from (clock_timestamp() - mc.started_at)) > v_allowed_limit THEN`
       * Procesa fallo por tiempo expirado (consume intento ordinario o agota intento Fénix).
  5. **Evaluación de Acierto / Error:**
     * **Si Acierta:**
       * Determina puntuación: 100 pts si `attempts_ordinary_used = 0`, 60 pts si `attempts_ordinary_used = 1` o rescate Fénix.
       * Actualiza `public.match_challenges`: `is_solved = true`, `score_earned = v_score`, `resolved_at = clock_timestamp()`.
       * Actualiza `public.matches`: `total_score = total_score + v_score`, `current_step = current_step + 1`.
       * **Inicialización Secuencial del Siguiente Paso:**
         ```sql
         IF p_step < 4 THEN
             UPDATE public.match_challenges 
             SET started_at = clock_timestamp() 
             WHERE match_id = p_match_id AND step_order = p_step + 1;
         END IF;
         ```
     * **Si Falla:**
       * **Verificación Atómica de Escudo:**
         * Si `v_match.is_shield_armed = true`:
           * Desarma escudo: `UPDATE public.matches SET is_shield_armed = false WHERE id = p_match_id;`.
           * **NO incrementa intentos**. Retorna `shield_absorbed = true`.
         * Si no hay escudo:
           * Si estaba en intento Fénix: `phoenix_rescue_used = true`, se cierra el reto en 0 pts y se avanza al siguiente paso (inicializando su `started_at`).
           * Si estaba en intento ordinario: incrementa `attempts_ordinary_used = attempts_ordinary_used + 1`.
           * Si llega a 2 intentos ordinarios y **NO tiene Fénix en inventario**: se cierra el reto en 0 pts y se avanza al siguiente paso (inicializando su `started_at`).
           * Si llega a 2 intentos ordinarios y **SÍ tiene Fénix disponible**: el reto permanece en el paso actual con estado `awaiting_phoenix_or_advance` para permitir al participante decidir si activa el comodín.
  6. **Registro en Idempotencia y Auditoría:** Almacena la respuesta en `public.idempotency_records` y retorna `v_response`.

### C. `public.rpc_use_wildcard(p_match_id UUID, p_match_token TEXT, p_wildcard_slug TEXT, p_step INT, p_idempotency_key TEXT) RETURNS JSONB`
* **Definición:** `SECURITY DEFINER`, `SET search_path = ''`.
* **Lógica Atómica:**
  1. Bloquea la partida con `FOR UPDATE` y verifica el `match_token`.
  2. Verifica `idempotency_records` bajo el lock; si coincide la clave con diferente payload, lanza `409 Conflict`.
  3. Verifica que el comodín exista en `public.match_wildcards` con `is_used = false`.
  4. **Lógica Específica:**
     * **`escudo`:** `UPDATE public.matches SET is_shield_armed = true WHERE id = p_match_id;`. Marca comodín usado.
     * **`giratiempo`:** Suma 20s al reto actual: `UPDATE public.match_challenges SET extra_time_secs = extra_time_secs + 20 WHERE match_id = p_match_id AND step_order = p_step;`. Marca comodín usado.
     * **`fenix`:** Valida `attempts_ordinary_used = 2`, `is_solved = false` y `phoenix_rescue_granted = false`.
       * Concede rescate: `phoenix_rescue_granted = true`, `phoenix_rescue_used = false`.
       * **Reinicio de Temporizador:** `started_at = clock_timestamp()` (Otorga la duración reglamentaria completa para el intento de rescate). Marca comodín usado.
     * **`sabiduria`:** Obtiene opciones erróneas de la tabla `public.challenges` y devuelve 2 IDs aleatorios. Marca comodín usado.
     * **`ayuda_mago`:** Registra evento social voluntario en auditoría y marca comodín usado.
     * **`felix`:** Si se opta por reciclar un comodín, valida `slug != 'felix'` (anti-recursión). Reactiva el comodín (`is_used = false`).
  5. Inserta en `public.idempotency_records` y retorna `v_response`.

### D. `public.rpc_claim_prize(p_verification_code TEXT) RETURNS JSONB`
* **Definición:** `SECURITY DEFINER`, `SET search_path = ''`.
* **Lógica Atómica:**
  1. Comprueba rol de staff:
     ```sql
     IF NOT public.is_staff('staff_event') AND NOT public.is_staff('superadmin') THEN 
         RAISE EXCEPTION 'No autorizado para canjear premios' USING ERRCODE = '42501'; 
     END IF;
     ```
  2. Bloquea la fila: `SELECT * INTO v_match FROM public.matches WHERE verification_code = p_verification_code FOR UPDATE;`.
  3. Si no existe: lanza excepción `Código inexistente`.
  4. Si `v_match.prize_status = 'claimed'`: retorna `{ success: false, error: 'ALREADY_CLAIMED', claimed_at: v_match.prize_claimed_at, claimed_by: v_match.prize_claimed_by }`.
  5. Si `v_match.total_score < 350` o `v_match.status != 'completed_passed'`: lanza excepción `Partida no elegible para premio`.
  6. Actualiza atómicamente:
     ```sql
     UPDATE public.matches 
     SET 
         prize_status = 'claimed',
         prize_claimed_at = clock_timestamp(),
         prize_claimed_by = auth.uid()
     WHERE verification_code = p_verification_code;
     ```
  7. Registra `'prize_claimed'` en auditoría y retorna confirmación con el nombre del participante.

---

## 6. Pruebas de Aceptación Automatizadas y Reproducibles

La validación de la Fase 1 requerirá la ejecución exitosa de la siguiente suite de pruebas automatizadas:

| ID | Prueba de Seguridad / Regla | Entrada y Condiciones | Comportamiento Esperado |
| :---: | :--- | :--- | :--- |
| **T-01** | **Cero Fuga en Consultas Anónimas** | Consulta `SELECT * FROM challenges_public;` con rol `anon`. | La columna `correct_option_id` no existe en el conjunto de resultados. |
| **T-02** | **Acceso Anónimo a Tablas Directas** | Intento de `INSERT/UPDATE` en `public.matches` desde `anon`. | Rechazo inmediato por RLS (`permission denied`). |
| **T-03** | **Usuario Autenticado sin Rol en Staff** | Usuario autenticado común ejecuta `rpc_claim_prize`. | Excepción `42501: No autorizado para canjear premios`. |
| **T-04** | **Token de Partida Inválido** | Invocación de `rpc_validate_answer` con `match_token` erróneo. | Excepción `42501: Acceso denegado: token o partida invalida`. |
| **T-05** | **Temporizadores Secuenciales** | Iniciar partida y verificar `started_at` en `match_challenges`. | Paso 0 tiene timestamp activo; pasos 1 al 4 tienen `started_at IS NULL`. Al resolver paso 0, paso 1 adquiere `clock_timestamp()`. |
| **T-06** | **Idempotencia Idéntica** | Despachar 5 llamadas concurrentes idénticas con misma clave y payload. | Una llamada procesa; 4 retornan el resultado cacheado idéntico. Cero deducciones duplicadas. |
| **T-07** | **Detección de Clave Reutilizada con Payload Alterado** | Despachar petición con misma clave pero cambiando `selected_option_id`. | Excepción `23505: Idempotency conflict: key reused with mismatched payload`. |
| **T-08** | **Rechazo por Expiración de Tiempo** | Enviar respuesta tras superar `duration_secs + extra_time_secs + 7s`. | Intento fallido por tiempo agotado; no otorga puntos. |
| **T-09** | **Rescate de Fénix** | Activar Fénix tras 2 intentos fallidos y responder correctamente. | El temporizador se reinicia; acierto premia con exactamente 60 puntos. |
| **T-10** | **Canje de Pegatina Concurrente** | Dos llamadas simultáneas a `rpc_claim_prize` con el mismo código. | Una transacción ejecuta con éxito; la segunda falla con `ALREADY_CLAIMED`. |

---

## 7. Riesgos Restantes que Solo Pueden Confirmarse al Implementar o Probar

1. **Latencia Celular Extrema en Recintos Universitarios:** Si la red de la feria experimenta latencias de subida superiores a 7 segundos, los participantes podrían sufrir falsos positivos de tiempo agotado. Esto deberá validarse en las pruebas de campo en el stand.
2. **Caché Agresiva de Safari iOS en Service Workers:** Los Service Workers en iOS Safari a veces retienen bundles antiguos si la estrategia de invalidación no incluye hash de contenido estricto. Se verificará en la Fase 6.
3. **Soporte de Web Vibration API:** `navigator.vibrate` está deshabilitado por política de seguridad en iOS Safari, pero plenamente soportado en Chrome/Android. El código de [haptics.js](file:///c:/Users/ASUS/Desktop/J.A.R.V.I.S/QR_Quest/src/utils/haptics.js) ya cuenta con degradación elegante (*try/catch* silencioso).

---

## 8. Dictamen Final de la Auditoría

### ⚖️ Dictamen: **APROBADO — LISTO PARA REVISIÓN DE IMPLEMENTACIÓN**

**Fundamentación:**  
La especificación versión 2.2 resuelve la totalidad de los hallazgos críticos (C-01, C-02, C-03) y altos (A-01, A-02, A-03) identificados en la auditoría del 22 de octubre de 2026. Los temporizadores secuenciales por paso, la estrategia `search_path = ''`, la idempotencia con detección de conflicto de payload, el reinicio de temporizador en el rescate del Fénix y la estructura de roles compuestos proporcionan un marco arquitectónico blindado, matemáticamente coherente y listo para su codificación.

> [!IMPORTANT]
> **Declaración de Estado y Modo Solo Lectura:**  
> Ninguna línea de código fuente ha sido modificada. No se han instalado dependencias ni ejecutado migraciones ni operaciones en Supabase.
> 
> El proyecto se mantiene intacto, a la espera de tu **autorización explícita para iniciar la Fase 1**.
