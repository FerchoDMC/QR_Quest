# Especificación de Requerimientos de Software (SRS)
## Proyecto: El Desafío Mágico de TI

---

### 1. Introducción

#### 1.1 Propósito
El presente documento define los requerimientos de software (funcionales, no funcionales y reglas de negocio) para el desarrollo de la aplicación web **"El Desafío Mágico de TI"**, una experiencia interactiva individual con temática Harry Potter para la Feria de Bienvenida universitaria.

#### 1.2 Alcance del Sistema
La aplicación es una **Progressive Web App (PWA)** que guía al participante a través de 3 micro-desafíos seleccionados aleatoriamente de un banco de 10 minijuegos, con el soporte estratégico de **comodines mágicos** (1 a 3 sorteados al inicio de un banco de 6). Se conecta a **Supabase** como backend ligero para:
- Registrar el nombre del participante
- Asignar y persistir la combinación aleatoria de desafíos y comodines
- Validar las respuestas del lado del servidor (anti-trampas)
- Controlar el inventario y consumo de comodines en tiempo real
- Almacenar fotos opcionales (Supabase Storage)
- Proveer métricas básicas de participación

El participante accede escaneando un código QR en el stand de Tecnologías de la Información y completa la experiencia en 3–5 minutos desde su celular.

#### 1.3 Alcance Fuera del Sistema
Los siguientes elementos **NO** forman parte de este sistema:
- Autenticación con contraseña o correo electrónico
- Geolocalización, GPS o mapas interactivos
- Modalidad por equipos o competencia síncrona entre participantes
- Escaneo de múltiples QR dentro de la experiencia
- Dashboard en tiempo real con mapa de ubicaciones geográficas

#### 1.4 Actores del Sistema
| Actor | Descripción |
| :--- | :--- |
| **Participante** | Estudiante de cualquier carrera que accede a la experiencia desde su celular al escanear el QR del stand. Registra solo su nombre. Recibe desafíos y comodines aleatorios. No requiere conocimientos técnicos previos. |
| **Staff del Stand** | Estudiante encargado que verifica la pantalla de misión completada y entrega el sticker de la carrera. |
| **Administrador** | Persona con acceso a Supabase Dashboard o a una vista administrativa básica para consultar métricas, descargar fotos y gestionar desafíos y comodines. |

---

### 2. Reglas de Negocio (RN)

- **RN-01 (Acceso por QR Único):** La experiencia se inicia exclusivamente escaneando un código QR visible en el stand, que dirige al navegador del celular a la URL de la PWA.
- **RN-02 (Registro Mínimo):** Solo se solicita el nombre del participante. No se pide correo, carrera, código estudiantil ni contraseña.
- **RN-03 (Selección Aleatoria de Desafíos):** Al registrarse, el sistema selecciona 3 minijuegos al azar de un banco de 10, sin repetición. La combinación se persiste en base de datos y no cambia si el participante recarga la página.
- **RN-04 (Sorteo Aleatorio de Comodines):** Al registrarse, el sistema asigna de forma aleatoria entre 1 y 3 comodines del banco de 6 según la distribución probabilística: 1 comodín (40%), 2 comodines (40%), 3 comodines (20%). No se asignan comodines repetidos.
- **RN-05 (Comodines Opcionales de Uso Único):** Cada comodín asignado puede ser activado un máximo de 1 vez durante cualquiera de los 3 desafíos. El uso de comodines es totalmente voluntario; la misión puede completarse exitosamente sin utilizarlos.
- **RN-06 (Mecánica Social "Ayuda del Mago"):** Al activar el comodín "Ayuda del Mago", la app solicita interactuar con una persona en el campus con un rasgo físico/prenda visible aleatorio (ej. gafas, gorro, camiseta verde). La interacción es voluntaria y el participante puede continuar si la persona no está disponible o declina ayudar.
- **RN-07 (Flujo Lineal de Pantallas):** El participante avanza de forma secuencial por las pantallas sin posibilidad de saltar desafíos ni retroceder a pantallas anteriores.
- **RN-08 (Duración Controlada):** Cada micro-desafío está diseñado para resolverse en 30–60 segundos. La experiencia completa no debe superar los 5 minutos (los comodines sociales pueden sumar ~1 minuto adicional).
- **RN-09 (Validación Presencial):** La obtención del sticker requiere que el participante muestre la pantalla de misión completada al staff del stand.
- **RN-10 (Sin Conocimientos Técnicos Previos):** Los desafíos están orientados a lógica, observación y patrones computacionales intuitivos; no requieren conocimientos de programación.
- **RN-11 (Validación Server-Side):** Las respuestas correctas de los desafíos se validan en el servidor (Supabase RPC), nunca en el cliente, evitando trampas por inspección de código.
- **RN-12 (Consumo Seguro de Comodines):** El uso de cada comodín se audita y valida en Supabase para evitar reutilización manipulando el estado local.
- **RN-13 (Foto Opcional con Consentimiento):** La captura de foto al final es completamente opcional. Si el participante acepta, debe otorgar consentimiento explícito antes de abrir la cámara.

---

### 3. Flujo de la Experiencia

```
QR del Stand
    │
    ▼
┌─────────────────────────┐
│  Pantalla de Bienvenida  │  ← Carta de Hogwarts / ambientación HP
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Registro de Nombre      │  ← Solo nombre, sin datos adicionales
│  "¿Cómo te llamas, mago?"│
└──────────┬──────────────┘
           ▼
   ┌───────────────┐
   │ Sistema Sortea│  ← 3 de 10 minijuegos al azar
   │ Desafíos y    │  ← 1–3 de 6 comodines (40/40/20%)
   │ Comodines     │     Persistencia en Supabase
   └───────┬───────┘
           ▼
┌─────────────────────────┐
│  Sobre Mágico Revelador │  ← Animación de sobre abriéndose
│  (Revela Comodines)     │     Descubre cartas mágicas una a una
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Instrucciones          │  ← Explicación breve + inventario listo
│  "Comenzar Misión"       │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Desafío 1               │  ← Minijuego aleatorio (30–60 seg)
│  Progreso: ●○○           │  ← Barra de comodines disponible
│  [🛡️][🧪][⏳]           │     Validación server-side
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Desafío 2               │  ← Minijuego aleatorio (30–60 seg)
│  Progreso: ●●○           │  ← Barra de comodines activa
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Desafío 3               │  ← Minijuego aleatorio (30–60 seg)
│  Progreso: ●●●           │  ← Barra de comodines activa
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  ¡Misión Completada!     │  ← Celebración visual + confeti mágico
│  "Acabas de programar    │
│   sin darte cuenta"      │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Descubre TI             │  ← Áreas de la carrera (tarjetas visuales)
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  📸 Foto Mágica          │  ← Opcional, con consentimiento
│  (Opcional)              │     Sube a Supabase Storage
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Pantalla de Sticker     │  ← Muéstrala al staff
│  "Nombre" completó la    │
│   misión                 │
└─────────────────────────┘
```

---

### 4. Requerimientos Funcionales (RF)

#### Módulo 1: Acceso, Bienvenida, Registro y Sorteo

* **RF-01 (Acceso por QR):** La aplicación debe cargarse directamente en el navegador móvil al escanear el código QR del stand, sin descarga previa ni instalación forzada.
* **RF-02 (Pantalla de Bienvenida):** La aplicación debe mostrar una pantalla de bienvenida con ambientación visual temática de Harry Potter (escudo, carta, pergamino, tipografía clásica) y un botón interactivo de inicio.
* **RF-03 (Registro de Nombre):** La aplicación debe solicitar únicamente el nombre del participante. Al enviarlo, genera un registro en Supabase con UUID y almacena la sesión en `localStorage`.
* **RF-04 (Sorteo de Desafíos):** Al registrarse, el sistema selecciona 3 minijuegos al azar del banco de 10, sin repetición, registrándolos en `participant_challenges`.
* **RF-05 (Sorteo de Comodines Mágicos):** Al registrarse, el sistema sortea la cantidad de comodines (1 con 40% prob, 2 con 40% prob, 3 con 20% prob) y selecciona los comodines específicos del banco de 6 sin duplicados, registrándolos en `participant_wildcards`.
* **RF-06 (Animación de Sobre Mágico):** Tras el registro, la app debe presentar una animación interactiva donde un sobre con sello de cera de Hogwarts se abre y revela los comodines asignados uno por uno mediante tarjetas mágicas volteables o deslizantes.
* **RF-07 (Persistencia de Sesión):** Si el participante cierra, recarga o pierde conexión temporalmente, la aplicación debe reanudar la sesión desde `localStorage` con los mismos desafíos y comodines asignados (y consumidos).

#### Módulo 2: Motor de Micro-Desafíos y Comodines

* **RF-08 (Banco de 10 Minijuegos):** El sistema debe soportar un banco de 10 minijuegos con las siguientes mecánicas:
  1. **El Enigma de las Runas** — Reconocimiento de patrones en secuencia visual
  2. **La Poción Correcta** — Deducción lógica con pistas
  3. **El Hechizo Lógico** — Reglas condicionales (si A entonces B)
  4. **El Tablero Encantado** — Estrategia y análisis de movimiento
  5. **La Llave del Tesoro** — Comprensión y resolución de acertijo
  6. **El Espejo de la Memoria** — Memorización y reconocimiento visual
  7. **El Alfabeto Secreto** — Descifrado con clave visual
  8. **El Laberinto Mágico** — Secuenciación de instrucciones
  9. **El Código del Mago** — Interpretación de secuencia numérica/binaria
  10. **La Fórmula Encantada** — Ordenamiento lógico de elementos
* **RF-09 (Despliegue Secuencial):** La aplicación debe presentar los 3 desafíos asignados en secuencia, uno a la vez, avanzando solo tras superar o agotar los intentos del reto actual.
* **RF-10 (Validación Server-Side):** Al enviar una respuesta, la aplicación debe invocar una función RPC en Supabase (`validate_answer`) para verificarla. Las respuestas correctas **nunca** residen en el código cliente.
* **RF-11 (Retroalimentación Inmediata):** Al recibir la respuesta del servidor, la app debe proporcionar retroalimentación visual inmediata (colores temáticos, animaciones de chispa o humo) y háptica (`navigator.vibrate`).
* **RF-12 (Reintentos y Vidas):** Cada desafío otorga 2 intentos. Si ambos fallan (y no se aplica escudo/fénix), se muestra la explicación y se avanza al siguiente reto.
* **RF-13 (Pista Básica):** Cada desafío incluye un botón de "pista rápida" que ofrece una orientación parcial (1 uso por reto).
* **RF-14 (Inventario de Comodines en Pantalla):** Durante cada desafío, la UI debe incluir una barra de inventario con los comodines disponibles del participante, indicando icono, nombre y estado (disponible / usado).
* **RF-15 (Lógica y Efectos de los 6 Comodines):**
  * **🛡️ Escudo de Protección:** Previene la pérdida de vida/intento ante una respuesta errónea.
  * **🧙 Ayuda del Mago (Social):** Abre un modal temático con una misión social de rotación dinámica (ej. *"Busca a alguien con gafas / gorro / camiseta verde y pídele ayuda"*).
  * **🧪 Poción de la Sabiduría:** Descarta automáticamente 1 o 2 opciones erróneas (estilo 50/50).
  * **⏳ Giratiempo:** Agrega 20 segundos adicionales al contador del desafío activo.
  * **🔥 Fénix Salvador:** Reinicia un desafío fallido permitiendo un nuevo intento completo.
  * **✨ Felix Felicis:** Abre un diálogo mágico permitiendo elegir entre: obtener una super-pista de la respuesta O reactivar un comodín ya utilizado.
* **RF-16 (Registro y Consumo de Comodines en BD):** Al hacer clic en activar comodín, se ejecuta la función `use_wildcard` en Supabase para registrar fecha, desafío donde se aplicó y cambiar su estado a consumido.
* **RF-17 (Indicador de Progreso Visual):** La cabecera debe reflejar de forma persistente el desafío en curso (●○○, ●●○, ●●●).

#### Módulo 3: Finalización, Revelación y Promoción de TI

* **RF-18 (Pantalla de Misión Completada):** Al superar los 3 desafíos, la aplicación muestra una celebración mágica con animación de confeti dorado, sonido sutil y felicitación personalizada: *"¡Misión cumplida, [Nombre]!"*.
* **RF-19 (Mensaje de Revelación):** Muestra el mensaje principal: *"Acabas de programar sin darte cuenta"*, con desglose educativo conectando la lógica usada en los 3 desafíos con conceptos reales de TI.
* **RF-20 (Muestra Visual de Áreas de TI):** Presentación en tarjetas ilustradas de las 6 áreas de la carrera: Desarrollo Web, Apps Móviles, Inteligencia Artificial, Ciberseguridad, Redes y Telecomunicaciones, Bases de Datos.
* **RF-21 (Pantalla de Validación para Sticker):** Pantalla final de diseño limpio y distintivo con el nombre del participante y sello de verificación para mostrar presencialmente al staff del stand.

#### Módulo 4: Foto Mágica (Opcional)

* **RF-22 (Consentimiento Explícito de Foto):** Modal informativo previo con opciones de "Tomar foto de recuerdo" o "Saltar este paso".
* **RF-23 (Captura con Cámara Frontal):** Si acepta, activa la cámara frontal del dispositivo para una selfie mágica.
* **RF-24 (Subida a Supabase Storage):** Envío automático del archivo comprimido al bucket `participant-photos` vinculado al UUID del participante.
* **RF-25 (Tolerancia a Errores de Cámara):** Si el navegador rechaza los permisos de cámara, se muestra un mensaje informativo y se redirige limpiamente a la pantalla del sticker sin bloquear la experiencia.

#### Módulo 5: Administración y Métricas

* **RF-26 (Métricas Globales):** Consulta en tiempo real desde Supabase de total de participantes, misiones completadas, comodines más utilizados y tasa de uso social.
* **RF-27 (Gestión de Desafíos y Comodines):** Capacidad de activar o desactivar desafíos o comodines desde la tabla correspondiente sin alterar el código de la PWA.
* **RF-28 (Galería de Fotos):** Acceso seguro para el staff a la descarga de fotos para fines de difusión y redes sociales.

---

### 5. Modelo de Datos (Supabase / PostgreSQL)

```sql
-- 1. Tabla de participantes
CREATE TABLE participants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,              -- NULL hasta completar la misión
  photo_url       TEXT,                     -- URL en Supabase Storage (nullable)
  wildcards_count INTEGER DEFAULT 0         -- Cantidad sorteada (1, 2 o 3)
);

-- 2. Banco de 10 desafíos
CREATE TABLE challenges (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,     -- ej: 'runas', 'pocion', 'hechizo'
  title           TEXT NOT NULL,            -- ej: 'El Enigma de las Runas'
  type            TEXT NOT NULL,            -- 'multiple_choice', 'sequence', 'memory', 'ordering'
  description     TEXT NOT NULL,
  question        TEXT NOT NULL,
  options         JSONB NOT NULL,           -- array de opciones
  correct_answer  JSONB NOT NULL,           -- respuesta protegida (nunca visible en cliente)
  hint            TEXT,
  explanation     TEXT NOT NULL,            -- explicación de revelación
  ti_skill        TEXT NOT NULL,            -- ej: 'Reconocimiento de Patrones'
  is_active       BOOLEAN DEFAULT true,
  duration_secs   INTEGER DEFAULT 45
);

-- 3. Banco de 6 comodines mágicos
CREATE TABLE wildcards (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,     -- 'escudo', 'ayuda_mago', 'sabiduria', 'giratiempo', 'fenix', 'felix'
  name            TEXT NOT NULL,
  type            TEXT NOT NULL,            -- 'defensive', 'social', 'logic', 'time', 'retry', 'special'
  icon            TEXT NOT NULL,            -- emoji o identificador de icono
  description     TEXT NOT NULL,
  is_active       BOOLEAN DEFAULT true
);

-- 4. Desafíos asignados por participante (3 por persona)
CREATE TABLE participant_challenges (
  id              SERIAL PRIMARY KEY,
  participant_id  UUID REFERENCES participants(id) ON DELETE CASCADE,
  challenge_id    INTEGER REFERENCES challenges(id),
  position        INTEGER NOT NULL,         -- 1, 2 o 3
  is_completed    BOOLEAN DEFAULT false,
  attempts        INTEGER DEFAULT 0,
  used_hint       BOOLEAN DEFAULT false,
  completed_at    TIMESTAMPTZ,

  UNIQUE(participant_id, position)
);

-- 5. Comodines asignados por participante (1 a 3 por persona)
CREATE TABLE participant_wildcards (
  id                  SERIAL PRIMARY KEY,
  participant_id      UUID REFERENCES participants(id) ON DELETE CASCADE,
  wildcard_id         INTEGER REFERENCES wildcards(id),
  is_used             BOOLEAN DEFAULT false,
  used_at             TIMESTAMPTZ,
  used_on_challenge   INTEGER REFERENCES challenges(id),
  social_target       TEXT,                 -- ej. 'persona con gafas' si es comodín social

  UNIQUE(participant_id, wildcard_id)
);
```

#### Funciones de Validación Server-Side (RPC)

```sql
-- Validar respuesta de desafío
CREATE OR REPLACE FUNCTION validate_answer(
  p_participant_id UUID,
  p_challenge_id INTEGER,
  p_answer JSONB
) RETURNS JSONB AS $$
DECLARE
  v_correct JSONB;
  v_is_correct BOOLEAN;
  v_explanation TEXT;
BEGIN
  SELECT correct_answer, explanation
  INTO v_correct, v_explanation
  FROM challenges WHERE id = p_challenge_id;

  v_is_correct := (p_answer = v_correct);

  UPDATE participant_challenges
  SET attempts = attempts + 1,
      is_completed = CASE WHEN v_is_correct THEN true ELSE is_completed END,
      completed_at = CASE WHEN v_is_correct THEN now() ELSE completed_at END
  WHERE participant_id = p_participant_id
    AND challenge_id = p_challenge_id;

  RETURN jsonb_build_object(
    'correct', v_is_correct,
    'explanation', CASE WHEN v_is_correct THEN v_explanation ELSE NULL END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Consumir comodín
CREATE OR REPLACE FUNCTION use_wildcard(
  p_participant_id UUID,
  p_wildcard_slug TEXT,
  p_challenge_id INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_pw_id INTEGER;
  v_already_used BOOLEAN;
BEGIN
  SELECT pw.id, pw.is_used
  INTO v_pw_id, v_already_used
  FROM participant_wildcards pw
  JOIN wildcards w ON pw.wildcard_id = w.id
  WHERE pw.participant_id = p_participant_id
    AND w.slug = p_wildcard_slug;

  IF v_pw_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Comodín no asignado');
  END IF;

  IF v_already_used THEN
    RETURN jsonb_build_object('success', false, 'error', 'Comodín ya utilizado');
  END IF;

  UPDATE participant_wildcards
  SET is_used = true,
      used_at = now(),
      used_on_challenge = p_challenge_id
  WHERE id = v_pw_id;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 6. Requerimientos No Funcionales (RNF)

#### 6.1 Usabilidad y Experiencia de Usuario
* **RNF-01 (Principio 1 Pantalla = 1 Acción):** Cada pantalla mantiene un objetivo directo sin menús colaterales ni botones confusos.
* **RNF-02 (Curva de Aprendizaje Cero):** Un participante sin formación tecnológica puede completar la dinámica sin apoyo de un facilitador.
* **RNF-03 (Mobile-First Estricto):** Optimizado para pantallas táctiles de smartphone en orientación vertical (portrait).
* **RNF-04 (Legibilidad en Exteriores):** Alto contraste temático (oro y pergamino sobre fondos oscuros) apto para visibilidad en luz solar.

#### 6.2 Rendimiento
* **RNF-05 (Carga Inicial en < 3s):** El bundle web inicial de la PWA debe cargarse en menos de 3 segundos en redes móviles 4G.
* **RNF-06 (Fluidez de Animaciones):** Animaciones del sobre mágico y feedback visual a 60 fps continuos.
* **RNF-07 (Latencia RPC < 800ms):** La validación de respuestas y consumo de comodines en Supabase debe responder en menos de 800ms.

#### 6.3 Seguridad y Anti-Trampas
* **RNF-08 (Respuestas Protegidas):** Cero exposición de `correct_answer` en el código fuente de React ni en los payloads JSON de lectura pública.
* **RNF-09 (Row Level Security en Supabase):** Políticas RLS configuradas para garantizar que ningún participante pueda modificar datos de otros participantes.
* **RNF-10 (Privacidad de Almacenamiento):** Las fotos en Supabase Storage no deben ser listables públicamente por usuarios anónimos.

#### 6.4 Resiliencia y Compatibilidad
* **RNF-11 (Persistencia Offline Parcial):** Si hay micro-cortes de Wi-Fi en la feria, la sesión y el estado de los comodines permanecen en `localStorage`.
* **RNF-12 (Compatibilidad Multiplataforma):** Soporte total en Safari iOS (15+), Google Chrome Android (90+) y Samsung Internet.

---

### 7. Matriz de Priorización (MoSCoW)

| Código | Requerimiento | Prioridad |
| :--- | :--- | :--- |
| **RF-01** | Acceso por QR único al navegador móvil | **Must Have** |
| **RF-02** | Pantalla de bienvenida temática Harry Potter | **Must Have** |
| **RF-03** | Registro mínimo de nombre del participante | **Must Have** |
| **RF-04** | Sorteo aleatorio de 3 de 10 desafíos | **Must Have** |
| **RF-08** | Implementación del banco de 10 minijuegos | **Must Have** |
| **RF-09** | Despliegue secuencial de desafíos (1 por pantalla) | **Must Have** |
| **RF-10** | Validación server-side de respuestas (RPC) | **Must Have** |
| **RF-11** | Retroalimentación inmediata (visual + háptica) | **Must Have** |
| **RF-18** | Pantalla de misión completada con celebración | **Must Have** |
| **RF-19** | Mensaje "Acabas de programar sin darte cuenta" | **Must Have** |
| **RF-21** | Pantalla de validación presencial para sticker | **Must Have** |
| **RNF-01** | Principio de 1 pantalla = 1 acción | **Must Have** |
| **RNF-03** | Enfoque mobile-first portrait | **Must Have** |
| **RNF-08** | Respuestas protegidas en backend | **Must Have** |
| **RF-05** | Sorteo aleatorio de 1–3 comodines mágicos | **Should Have** |
| **RF-06** | Animación de sobre mágico abriéndose con comodines | **Should Have** |
| **RF-14** | Barra de inventario de comodines en pantalla de juego | **Should Have** |
| **RF-15** | Lógica de efectos de los 6 comodines (escudo, social, etc.) | **Should Have** |
| **RF-16** | Consumo seguro y auditoría de comodines en BD | **Should Have** |
| **RF-07** | Persistencia de sesión y comodines en recargas | **Should Have** |
| **RF-12** | Vidas / Reintentos por desafío | **Should Have** |
| **RF-13** | Botón de pista rápida | **Should Have** |
| **RF-17** | Indicador de progreso visual | **Should Have** |
| **RF-20** | Pantalla visual de áreas de la carrera de TI | **Should Have** |
| **RF-22/23/24** | Módulo de foto mágica opcional con upload a Storage | **Could Have** |
| **RF-25** | Tolerancia a denegación de cámara | **Could Have** |
| **RF-26** | Métricas de participación en Supabase | **Could Have** |
| **RF-27** | Gestión dinámica de desafíos/comodines activos | **Could Have** |
| **RF-28** | Galería de fotos administrativa | **Could Have** |

---

### 8. Plan de Implementación — 2 Semanas

| Periodo | Actividades Principales | Entregables |
| :--- | :--- | :--- |
| **Días 1–2** | • Redacción y validación de los 10 minijuegos y los 6 comodines.<br>• Paleta temática HP, tipografías y reglas de los comodines.<br>• Diseño UI del sobre mágico y componentes móviles. | Contenido funcional, narrativa y prototipo de diseño aprobados |
| **Días 3–5** | • Configuración de proyecto Vite + React.<br>• Setup de Supabase: esquemas de DB, tablas de comodines, RLS y RPCs.<br>• Flujo de bienvenida, registro de nombre y sorteo aleatorio.<br>• Animación del sobre mágico y persistencia de sesión. | MVP funcional con registro, sorteo y sobre mágico navegable |
| **Días 6–8** | • Construcción de los 10 minijuegos.<br>• Implementación de la barra de comodines y sus 6 efectos en tiempo real.<br>• Mecánica social "Ayuda del Mago" y validación RPC server-side.<br>• Retroalimentación háptica y visual. | Motor de juego completo con 10 desafíos y 6 comodines |
| **Días 9–10** | • Pantalla de misión completada, confeti y mensaje educativo de TI.<br>• Showcase de las 6 áreas de la carrera.<br>• Captura de foto opcional con cámara frontal y upload a Supabase Storage.<br>• Pantalla de validación presencial de sticker. | Flujo de usuario end-to-end completado |
| **Días 11–12** | • Configuración PWA (manifest, service worker y precache).<br>• Pulido de animaciones y performance 60fps.<br>• Panel administrativo de métricas y fotos en Supabase. | Versión Candidata (RC) para producción |
| **Día 13** | • Pruebas de campo con 8–10 usuarios en celulares iOS y Android.<br>• Ajuste fino de tiempos de desafío y comodines.<br>• Corrección de bugs detectados. | Versión estable y verificada |
| **Día 14** | • Generación e impresión del cartel QR final para el stand.<br>• Capacitación al equipo de staff sobre la dinámica y entrega de stickers.<br>• Despliegue en Vercel y verificación en vivo. | **Experiencia lista para operar en la Feria** |
