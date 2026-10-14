# Reporte de Tecnologías, Librerías y Plugins
## Proyecto: El Desafío Mágico de TI

---

### 1. Resumen de Arquitectura

La aplicación es una **Progressive Web App (PWA)** conectada a **Supabase** como backend ligero. El participante accede escaneando un QR con su cámara nativa, registra su nombre, y recibe 3 desafíos aleatorios (de un banco de 10) junto con 1 a 3 comodines mágicos (de un banco de 6). Las respuestas y el consumo de comodines se validan del lado del servidor para evitar trampas.

```
  ┌──────────────────────────────────────┐
  │       Celular del Participante       │
  │                                      │
  │   Cámara nativa escanea QR           │
  │          │                           │
  │          ▼                           │
  │   Navegador abre URL de la PWA       │
  │          │                           │
  │          ▼                           │
  │   ┌──────────────────────────────┐   │
  │   │   PWA (React + Vite)         │   │
  │   │                              │   │
  │   │  • Bienvenida HP             │   │
  │   │  • Registro de nombre        │   │
  │   │  • Sorteo de Retos + Comodín │   │
  │   │  • Sobre Mágico (Revelación) │   │
  │   │  • 3 Micro-desafíos (de 10)  │   │
  │   │  • Inventario de Comodines   │   │
  │   │  • Misión Completada         │   │
  │   │  • Descubre TI               │   │
  │   │  • 📸 Foto mágica (opcional) │   │
  │   │  • Pantalla Sticker          │   │
  │   │                              │   │
  │   │  Estado local: localStorage  │   │
  │   │  Offline: Service Worker     │   │
  │   └──────────┬───────────────────┘   │
  │              │ HTTPS                 │
  │              │                       │
  └──────────────┼───────────────────────┘
                 │
                 ▼
  ┌──────────────────────────────────────┐
  │          Supabase (BaaS)             │
  │                                      │
  │  ┌────────────────────────────────┐  │
  │  │  PostgreSQL Database           │  │
  │  │  • participants                │  │
  │  │  • challenges (banco de 10)    │  │
  │  │  • wildcards (banco de 6)      │  │
  │  │  • participant_challenges      │  │
  │  │  • participant_wildcards       │  │
  │  │  • RPC: validate_answer()      │  │
  │  │  • RPC: use_wildcard()         │  │
  │  │  • RLS: protección de filas    │  │
  │  │  └────────────────────────────────┘  │
  │                                      │
  │  ┌────────────────────────────────┐  │
  │  │  Supabase Storage              │  │
  │  │  • Bucket: participant-photos  │  │
  │  │  • Fotos con UUID + timestamp  │  │
  │  │  └────────────────────────────────┘  │
  │                                      │
  │  ┌────────────────────────────────┐  │
  │  │  Supabase Auth (anónimo)       │  │
  │  │  • Sesión anónima automática   │  │
  │  │  • Para permisos de RLS        │  │
  │  │  └────────────────────────────────┘  │
  └──────────────────────────────────────┘

  ┌──────────────────────────────────────┐
  │   Hosting Estático (Vercel)          │
  │   HTML + CSS + JS (bundle PWA)       │
  │   Deploy automático desde GitHub     │
  └──────────────────────────────────────┘
```

#### ¿Por qué esta arquitectura?
1. **PWA = Cero fricción:** Escanea QR → abre en el navegador en 2 seg. Sin descarga, sin tiendas de apps, sin registro previo.
2. **Supabase free tier:** Base de datos PostgreSQL, Storage, Auth anónimo y funciones RPC gratis para hasta 50K filas y 1 GB de storage. Más que suficiente para un evento de bienvenida.
3. **Validación server-side:** Las respuestas correctas viven en la BD, nunca en el JS del cliente. Imposible hacer trampa inspeccionando el código.
4. **Seguridad en comodines:** El uso de comodines se registra con auditoría en BD mediante RPC `use_wildcard`, previniendo reutilización por manipulación de estado cliente.
5. **Hosting estático gratuito:** Vercel despliega la PWA sin costo con CD (Continuous Deployment) directo desde GitHub.

---

### 2. Frontend — Framework y Build

| Categoría | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Framework Base** | **React 18+** | Manejo declarativo del flujo secuencial de pantallas, inventario reactivo de comodines y micro-desafíos modulares. |
| **Build Tool** | **Vite 5+** | Servidor de desarrollo con HMR instantáneo y empaquetador Rollup ultra-optimizado para producción. |
| **Soporte PWA** | **vite-plugin-pwa** + **Workbox** | Automatiza el Service Worker y `manifest.json`. Precachea fuentes, estilos y lógica para tolerancia a caídas de red. |
| **Lenguaje** | **JavaScript (ES2022+)** | Rápida velocidad de iteración en el plazo de 2 semanas sin la sobrecarga de configuración y tipado de TypeScript. |

---

### 3. Backend — Supabase

| Componente | Servicio | Función en el Proyecto |
| :--- | :--- | :--- |
| **Base de Datos** | **Supabase Database (PostgreSQL)** | Almacena participantes, banco de 10 desafíos, banco de 6 comodines, combinaciones asignadas y estados de completitud. |
| **Validación de Respuestas** | **Supabase RPC** (`validate_answer`) | Función PL/pgSQL con `SECURITY DEFINER` que compara la respuesta contra `correct_answer` en la BD sin exponerla al cliente. |
| **Gestión de Comodines** | **Supabase RPC** (`use_wildcard`) | Función PL/pgSQL con `SECURITY DEFINER` que valida la pertenencia del comodín, comprueba que no haya sido consumido y registra su uso en tiempo real. |
| **Almacenamiento de Fotos** | **Supabase Storage** | Bucket privado `participant-photos`. Las selfies se almacenan como `{uuid}_{timestamp}.webp` accesibles vía URLs firmadas en el dashboard del staff. |
| **Autenticación** | **Supabase Auth (anónimo)** | Crea una sesión anónima automática al registrar el nombre, indispensable para ejecutar las políticas de RLS sin pedir credenciales. |
| **SDK** | **@supabase/supabase-js** | Cliente oficial único para queries, autenticación, ejecución de RPCs y subida de archivos (~15 KB gzip). |

#### Row Level Security (RLS) — Políticas clave

```sql
-- Participantes: solo pueden leer y crear su propio registro
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participant_read_own"
  ON participants FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "participant_insert"
  ON participants FOR INSERT
  WITH CHECK (true);

-- Desafíos: vista pública sin la columna de respuesta correcta
CREATE VIEW challenges_public AS
  SELECT id, slug, title, type, description, question, options, hint, explanation, ti_skill, duration_secs
  FROM challenges
  WHERE is_active = true;

-- Comodines: lectura pública del catálogo de comodines activos
CREATE VIEW wildcards_public AS
  SELECT id, slug, name, type, icon, description
  FROM wildcards
  WHERE is_active = true;

-- participant_challenges: solo el participante puede consultar sus retos asignados
ALTER TABLE participant_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pc_read_own"
  ON participant_challenges FOR SELECT
  USING (participant_id = auth.uid());

-- participant_wildcards: solo el participante puede consultar sus comodines asignados
ALTER TABLE participant_wildcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pw_read_own"
  ON participant_wildcards FOR SELECT
  USING (participant_id = auth.uid());
```

---

### 4. Estilos y Diseño Visual (Temática Harry Potter)

| Categoría | Tecnología | Uso en el Proyecto |
| :--- | :--- | :--- |
| **Framework CSS** | **CSS Modules** o **Vanilla CSS** | Control absoluto del diseño temático, bordes pergamino, sellos de cera, sombras mágicas y animaciones sin conflictos. |
| **Tipografía HP** | **Google Fonts: "Cinzel Decorative"** + **"Lora"** | *Cinzel Decorative* para títulos épicos y cartas de Hogwarts. *Lora* para enunciados y cuerpo de lectura legible en móviles. |
| **Iconografía** | **Lucide React** + Emojis temáticos | Iconos para escudos, pociones, relojes de arena, plumas, chispas y sellos. |

#### Paleta de Colores

```css
:root {
  /* Fondos */
  --bg-primary: #0D1B2A;       /* Azul noche oscuro de Hogwarts */
  --bg-secondary: #1B2838;     /* Azul noche medio */
  --bg-parchment: #F5E6C8;     /* Pergamino claro para cartas y sobres */

  /* Acentos Mágicos */
  --gold: #D4A843;             /* Dorado cálido */
  --gold-light: #F2D680;       /* Resplandor dorado */
  --crimson: #740001;          /* Granate Gryffindor / Sello de cera */
  --emerald: #1A472A;          /* Verde esmeralda Slytherin */
  --sapphire: #0E1A40;         /* Azul profundo Ravenclaw */
  --amber: #ECB939;            /* Ámbar Hufflepuff */

  /* Textos */
  --text-primary: #F5E6C8;     /* Pergamino sobre fondo oscuro */
  --text-dark: #2C1810;        /* Tinta sepia sobre pergamino */

  /* Estados y Feedback */
  --success: #2ECC71;          /* Verde acierto mágico */
  --error: #E74C3C;            /* Chispa roja de error */
}
```

---

### 5. Animaciones y Micro-interacciones

| Efecto | Tecnología | Experiencia del Participante |
| :--- | :--- | :--- |
| **Sobre Mágico de Hogwarts** | **Framer Motion** + CSS 3D | El sobre se abre desplegando la solapa superior en 3D; las cartas de comodines emergen secuencialmente con efecto levitación. |
| **Transiciones de pantalla** | **Framer Motion** (`AnimatePresence`) | Transiciones fluidas tipo libro o pergamino que se desliza entre etapas. |
| **Celebración de Misión** | **canvas-confetti** | Lluvia de destellos dorados, estrellas y confeti al superar los 3 desafíos. |
| **Feedback háptico** | **Web Vibration API** (`navigator.vibrate()`) | Pulsos de vibración táctil al activar comodines, acertar respuestas o completar la misión. |
| **Sonido Mágico Opcional** | **Web Audio API** (nativa) | Síntesis ligera de campanillas mágicas sin descargar archivos de audio pesados. |

---

### 6. Captura de Foto

| Necesidad | Tecnología | Detalle |
| :--- | :--- | :--- |
| **Acceso a cámara** | **MediaDevices API** (`navigator.mediaDevices.getUserMedia`) | API nativa del navegador. Activa la cámara frontal sin librerías de terceros en iOS y Android. |
| **Captura y compresión** | **Canvas API** | Transfiere el frame del `<video>` a un lienzo HTML5 y lo convierte a `Blob` WebP con compresión 0.8. |
| **Upload directo** | **Supabase Storage** SDK | Envío inmediato con `supabase.storage.from('participant-photos').upload()`. |

---

### 7. Hosting y Despliegue

| Plataforma | Costo | Ventaja |
| :--- | :--- | :--- |
| **Vercel** (recomendado) | Gratis (Plan Hobby) | Despliegue automático desde el repositorio de GitHub con previews instantáneos y HTTPS obligatorio (requerido para la cámara y PWA). |
| **Supabase** | Gratis (Free Tier) | 500 MB base de datos, 1 GB Storage, 50,000 usuarios activos mensuales. |

---

### 8. Resumen de Dependencias para `package.json`

```json
{
  "name": "desafio-magico-ti",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.45.0",
    "framer-motion": "^11.5.0",
    "lucide-react": "^0.440.0",
    "canvas-confetti": "^1.9.3"
  },
  "devDependencies": {
    "vite": "^5.4.2",
    "@vitejs/plugin-react": "^4.3.1",
    "vite-plugin-pwa": "^0.20.5"
  }
}
```

**Total de dependencias de producción: 6**
- `react` + `react-dom` — Biblioteca de componentes UI
- `@supabase/supabase-js` — Backend unificado (DB, RPC, Storage, Auth anónimo)
- `framer-motion` — Animación 3D del sobre mágico, cartas de comodín y transiciones
- `lucide-react` — Iconografía ligera
- `canvas-confetti` — Efectos de confeti mágico

**Bundle final estimado: ~190–230 KB gzip**

---

### 9. Mapa de APIs Nativas del Navegador (Cero Librerías Adicionales)

| Funcionalidad | API Nativa del Navegador | Justificación |
| :--- | :--- | :--- |
| Feedback háptico | `navigator.vibrate()` | Retroalimentación táctil nativa sin librerías. |
| Cámara frontal | `navigator.mediaDevices.getUserMedia()` | Acceso directo a hardware fotográfico. |
| Compresión de fotos | `HTMLCanvasElement.toBlob()` | Generación de archivos WebP livianos sin plugins. |
| Síntesis de sonido mágico | `window.AudioContext` (Web Audio API) | Efectos de brillo/chispas generados por osciladores sin descargar archivos MP3. |
| Persistencia de sesión | `localStorage` | Reanudación automática ante recargas de página. |
| Capacidades offline PWA | `ServiceWorker` + `CacheStorage` | Caché de assets para operar sin microcortes. |

---

### 10. Tecnologías Descartadas y Justificación

| Tecnología Descartada | Razón |
| :--- | :--- |
| ~~Leaflet.js / GPS~~ | Toda la actividad se desarrolla de pie frente al stand de TI; no hay navegación por el campus. |
| ~~Socket.io / WebSockets~~ | Es una experiencia individual; no requiere partidas multijugador síncronas. |
| ~~Librerías de audio pesadas (Howler)~~ | Los sonidos mágicos breves se generan con Web Audio API nativa. |
| ~~TypeScript~~ | Añadiría tiempo de tipado innecesario para un sprint estricto de 2 semanas con alcance bien delimitado. |
| ~~Lectores QR JavaScript en la app~~ | El QR lo escanea la cámara nativa del celular del participante para ingresar. |
| ~~Tailwind CSS~~ | CSS Modules y Custom Properties permiten un control artesanal del look & feel de Harry Potter sin clases genéricas. |
