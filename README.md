# ⚡ El Desafío Mágico de TI
> **Experiencia interactiva individual para la Feria de Bienvenida universitaria · Temática Harry Potter**  
> *Facultad de Ingeniería · Carrera de Tecnologías de la Información*

---

## 🧙‍♂️ Resumen del Proyecto

**El Desafío Mágico de TI** es una aplicación web mobile-first diseñada para que estudiantes de nuevo ingreso y de cualquier carrera conozcan el potencial de **Tecnologías de la Información** de forma lúdica, intuitiva y memorable.

El participante accede escaneando un único código QR en el stand de la carrera, inscribe su nombre, recibe **3 desafíos aleatorios** de un banco de 10 y entre **1 y 3 comodines mágicos** sorteados de un banco de 6. Al superar las pruebas, descubre que *"acaba de programar sin darse cuenta"* y recibe un certificado digital con código único para reclamar su sticker presencial.

---

## 🛠️ Stack Tecnológico Actual

* **Frontend:** React 19 + Vite 8
* **Estilos & Diseño:** Vanilla CSS Modules con variables temáticas de Harry Potter (*Cinzel Decorative*, *Lora*, *Outfit*, paleta de pergamino, dorado mágico y sellos de cera).
* **Animaciones 3D:** Framer Motion (sobre mágico abriéndose, cartas levitantes, transiciones y volteo 3D).
* **Efectos:** Canvas Confetti (lluvia de destellos dorados en la victoria).
* **Iconografía:** Lucide React + Emojis temáticos.
* **Audio Nativo:** Web Audio API (síntesis de sonidos mágicos ultraligeros sin descargar MP3s pesados).
* **Feedback Háptico:** Web Vibration API (`navigator.vibrate`) para respuesta táctil en celulares.
* **Persistencia:** `localStorage` modular con servicio desacoplado tolerante a recargas.

---

## ✅ Lo que se ha implementado hasta ahora

### 1. Flujo y Pantallas de la Experiencia
- [x] **Carta de Convocatoria (Welcome):** Pergamino oficial de Hogwarts con sello de cera, texto de bienvenida y botón de inicio.
- [x] **Registro de Nombre:** Input estilizado "¿Cómo te llamas, mago?" sin contraseñas ni fricción de registro.
- [x] **Sobre Mágico 3D:** Animación de sobre de pergamino que se abre y revela los comodines otorgados en tarjetas flotantes.
- [x] **Motor de Desafíos (`ChallengeRunner`):** Indicador de progreso (1/3, 2/3, 3/3), 2 vidas/intentos por reto, botón de pistas y barra flotante de comodines.
- [x] **Celebración y Gran Revelación:** Lluvia de confeti y mensaje formativo *"Acabas de programar sin darte cuenta"*.
- [x] **Vitrina de Áreas de TI:** 6 tarjetas interactivas de especialidades (Desarrollo Web, Móviles, IA, Ciberseguridad, Redes, Bases de Datos).
- [x] **Certificado y Pantalla de Sticker:** Sello dorado oficial, nombre del participante y código de validación único para el staff del stand.

### 2. Banco de los 10 Micro-desafíos con Widgets Visuales Interactivos
Cada reto cuenta con un widget visual propio y acertijos que ponen a pensar al participante sin respuestas obvias ni pistas entre paréntesis:
1. 🧩 **El Enigma de las Runas:** Altar de piedra con polígonos sagrados y ranura de vórtice dorado (*Reconocimiento de Patrones*).
2. 🧪 **La Poción Correcta:** 4 frascos de vidrio con vapor plateado ascendente y caldero de alquimia (*Deducción Lógica & Filtrado*).
3. ⚡ **El Hechizo Lógico:** Interruptores rúnicos interactivos SOL y LUNA con cerradura elemental de sombras (*Compuertas Lógicas AND-NOT*).
4. ♟️ **El Tablero Encantado:** Cuadrícula matricial 3x3 con simulación de movimientos vectoriales (+2 Sur, +1 Este) hacia [3, 2] (*Matrices y Coordenadas*).
5. 🗝️ **La Llave del Tesoro:** Cofre ancestral con 4 llaves temáticas (la Llave de Silicio con circuitos luminosos) (*Ciberseguridad & Datos*).
6. 🪞 **El Espejo de la Memoria:** Espejo místico con cuenta atrás de 3 segundos y volteo de naipes 3D (*Memoria Caché & RAM*).
7. 📜 **El Alfabeto Secreto:** Decodificador de runas desordenadas que se transcriben en D-A-T-O-S (*Criptografía & Ciberseguridad*).
8. 🧭 **El Laberinto Mágico:** Brújula interactiva con simulación de rotaciones espaciales en 3 pasos (*Algoritmos de Navegación*).
9. 💻 **El Código del Mago:** 4 antorchas binarias interactivas con fuego animado (código 0 1 1 0 = 6) (*Aritmética Binaria*).
10. 🥣 **La Fórmula Encantada:** Pipeline interactivo de 4 tareas con dependencias ordenadas (Pesar ➔ Disolver ➔ Hervir ➔ Decantar) (*Pipelines de CI/CD & DAGs*).

### 3. Sistema de los 6 Comodines Mágicos (Recursos de Hogwarts)
- [x] Sorteo aleatorio inicial probabilístico: 1 comodín (40%), 2 comodines (40%), 3 comodines (20%).
- [x] **🛡️ Escudo de Protección:** Absorbe 1 error sin descontar vidas.
- [x] **🧙 Ayuda del Mago (Misión Social):** Modal que reta a buscar a alguien en el campus con un rasgo rotativo (gafas, gorro, camiseta verde, etc.) para romper el hielo.
- [x] **🧪 Poción de la Sabiduría:** Descarta automáticamente opciones erróneas (efecto 50/50).
- [x] **⏳ Giratiempo:** Otorga tiempo extra de análisis.
- [x] **🔥 Fénix Salvador:** Reinicia los intentos de un reto si el jugador llega a 0 vidas.
- [x] **✨ Felix Felicis:** Revela la pista del grimorio o recicla un comodín agotado.

---

## ⏳ Lo que falta por implementar

### Fase 1: Backend en la Nube con Supabase
- [ ] Conectar la base de datos PostgreSQL en Supabase mediante el SDK `@supabase/supabase-js`.
- [ ] Implementar la función RPC `validate_answer` con `SECURITY DEFINER` para trasladar la validación de respuestas al servidor (máxima protección anti-trampas).
- [ ] Implementar la función RPC `use_wildcard` para auditar el consumo de comodines en tiempo real.
- [ ] Configurar Row Level Security (RLS) y vistas públicas seguras (`challenges_public`, `wildcards_public`).

### Fase 2: Módulo de Foto Mágica (Opcional)
- [ ] Pantalla de consentimiento previo con opciones de aceptar o saltar.
- [ ] Captura de selfie con cámara frontal mediante `navigator.mediaDevices.getUserMedia` y compresión WebP en `<canvas>`.
- [ ] Subida automática de la fotografía al bucket privado `participant-photos` en Supabase Storage.

### Fase 3: Herramientas del Stand y Administración
- [ ] **Generador de Cartel QR:** Página `/admin/qr` para generar e imprimir el póster del stand con el QR oficial.
- [ ] **Panel de Métricas del Staff:** Vista rápida `/admin` para consultar participantes en tiempo real, tasa de éxito y galería de fotos.

### Fase 4: PWA Offline y Despliegue Final
- [ ] Configurar `vite-plugin-pwa` con `manifest.json` (iconos temáticos, color de barra de estado y soporte de instalación en pantalla de inicio).
- [ ] Pruebas en dispositivos móviles reales (Android + iOS).
- [ ] Despliegue en producción mediante **Vercel** conectado al repositorio de GitHub.

---

## 🚀 Puesta en Marcha Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/FerchoDMC/QR_Quest.git
cd QR_Quest

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```

La aplicación estará disponible localmente en `http://localhost:5173/`.

---

## 📄 Documentación Técnica
- [info.md](file:///c:/Users/ASUS/Desktop/J.A.R.V.I.S/QR_Quest/info.md) — Visión general y reglas de la actividad.
- [SRS.md](file:///c:/Users/ASUS/Desktop/J.A.R.V.I.S/QR_Quest/SRS.md) — Especificación formal de requerimientos de software.
- [tecnologias_y_plugins.md](file:///c:/Users/ASUS/Desktop/J.A.R.V.I.S/QR_Quest/tecnologias_y_plugins.md) — Reporte arquitectónico, seguridad y dependencias.
