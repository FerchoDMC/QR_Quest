// Banco oficial de los 10 Micro-desafíos de El Desafío Mágico de TI (Versión Gamificada & Desafiante)
export const CHALLENGES = [
  {
    id: 1,
    slug: 'runas',
    title: 'El Enigma de las Runas',
    type: 'sequence',
    icon: 'Sparkles',
    durationSecs: 45,
    tiSkill: 'Reconocimiento de Patrones Complejos',
    description: 'Descifra la regla oculta que gobierna esta secuencia de polígonos sagrados.',
    question: 'Observa la progresión de glifos en el altar. Cada figura geométrica guarda una relación estricta con la siguiente. ¿Cuál es el glifo que debe ocupar la quinta ranura para equilibrar el encantamiento?',
    options: [
      { id: 'opt_a', label: 'Hexágono rúnico', isCorrect: false },
      { id: 'opt_b', label: 'Heptagrama místico', isCorrect: true },
      { id: 'opt_c', label: 'Círculo oracular', isCorrect: false },
      { id: 'opt_d', label: 'Rombo elemental', isCorrect: false }
    ],
    hint: 'Observa el número de lados o vértices de cada figura geométrica en la secuencia: triángulo, cuadrilátero, pentágono, hexágono... ¿Qué figura tiene la cantidad siguiente?',
    explanation: '¡Excelente deducción! En programación y Ciencia de Datos, el reconocimiento de patrones es la base de la Inteligencia Artificial y la visión por computadora para predecir series y clasificar información.'
  },
  {
    id: 2,
    slug: 'pocion',
    title: 'La Poción Correcta',
    type: 'logic_deduction',
    icon: 'FlaskConical',
    durationSecs: 60,
    tiSkill: 'Deducción Lógica & Filtrado de Datos',
    description: 'En el laboratorio hay cuatro elixires de distintos colores. Solo uno cura el encantamiento sin ser letal.',
    question: 'El pergamino del boticario contiene tres condiciones indispensables:\n1. El antídoto despide vapor plateado constante hacia el aire.\n2. Los elixires de color verde y ámbar provocan parálisis inmediata.\n3. El frasco de tonalidad azul zafiro contiene veneno destilado de basilisco.\n¿Cuál elixir debes verter en el caldero?',
    options: [
      { id: 'opt_a', label: 'Elixir Esmeralda', isCorrect: false },
      { id: 'opt_b', label: 'Elixir Zafiro', isCorrect: false },
      { id: 'opt_c', label: 'Elixir Amatista Púrpura', isCorrect: true },
      { id: 'opt_d', label: 'Elixir Ámbar Dorado', isCorrect: false }
    ],
    hint: 'Descarta paso a paso: elimina los frascos prohibidos por la condición 2 (verde y ámbar) y el veneno de la condición 3 (azul). ¿Cuál es el único que queda con vapor activo?',
    explanation: '¡Perfecto! Acabas de ejecutar mentalmente un filtro booleano condicional (WHERE color NOT IN ("verde", "ámbar", "azul") AND vapor = true), tal como lo hacen las consultas a bases de datos en SQL.'
  },
  {
    id: 3,
    slug: 'hechizo',
    title: 'El Hechizo Lógico',
    type: 'conditional',
    icon: 'Wand2',
    durationSecs: 45,
    tiSkill: 'Lógica Condicional (Compuertas Lógicas)',
    description: 'La cripta de los secretos está protegida por dos runas elementales: SOL y LUNA.',
    question: 'El guardián de piedra recita el enigma de la cerradura:\n"La luz solar despierta a las bestias si la Luna también se encuentra encendida.\nPero si la Luna reposa en el abismo, la luz solar es la única llave que disuelve el cerrojo.\nLa oscuridad total jamás abrirá este umbral."\n¿Qué estado rúnico abre la cripta?',
    options: [
      { id: 'opt_a', label: 'Sol inactivo y Luna inactiva', isCorrect: false },
      { id: 'opt_b', label: 'Sol activo y Luna activa', isCorrect: false },
      { id: 'opt_c', label: 'Sol activo y Luna inactiva', isCorrect: true },
      { id: 'opt_d', label: 'Sol inactivo y Luna activa', isCorrect: false }
    ],
    hint: 'Busca la única condición donde la luz del Sol esté encendida pero la Luna esté apagada para evitar que las bestias despierten.',
    explanation: '¡Exacto! Esta combinación representa la compuerta lógica AND-NOT en circuitos electrónicos y estructuras IF / ELSE en desarrollo de software.'
  },
  {
    id: 4,
    slug: 'tablero',
    title: 'El Tablero Encantado',
    type: 'matrix_strategy',
    icon: 'Grid',
    durationSecs: 50,
    tiSkill: 'Estructuras Matriciales & Vectores',
    description: 'Un talismán inicia su recorrido en la celda superior izquierda [Fila 1, Columna 1] de una matriz 3x3.',
    question: 'El talismán ejecuta la siguiente rutina de movimiento mágico:\n1. Un hechizo de viento lo empuja dos casillas hacia abajo (Sur).\n2. Un hechizo de marea lo desplaza una casilla hacia la derecha (Este).\n¿En qué coordenada exacta de la matriz se detiene el talismán?',
    options: [
      { id: 'opt_a', label: 'Casilla [3, 2]', isCorrect: true },
      { id: 'opt_b', label: 'Casilla [2, 3]', isCorrect: false },
      { id: 'opt_c', label: 'Casilla [1, 3]', isCorrect: false },
      { id: 'opt_d', label: 'Casilla [3, 1]', isCorrect: false }
    ],
    hint: 'Mover hacia abajo aumenta el número de fila (1 + 2). Mover hacia la derecha aumenta el número de columna (1 + 1).',
    explanation: '¡Muy bien! Los motores de videojuegos, interfaces gráficas y algoritmos de optimización operan calculando vectores en matrices bidimensionales (x, y).'
  },
  {
    id: 5,
    slug: 'tesoro',
    title: 'La Llave del Tesoro',
    type: 'riddle',
    icon: 'Key',
    durationSecs: 45,
    tiSkill: 'Ciberseguridad & Gestión de la Información',
    description: 'Cuatro llaves forjadas en distintos materiales levitan sobre un arcón sellado.',
    question: 'La cerradura exhibe una inscripción grabada:\n"Carezco de peso y masa corpórea, mas gobierno satélites, bancos e imperios.\nSi me interceptan sin resguardo me pierdes, mas si me encriptas protejo tu identidad.\nViajo a la velocidad del destello por hilos de vidrio y ondas invisibles."\n¿Qué llave abre el arcón?',
    options: [
      { id: 'opt_a', label: 'La Llave de Hierro Forjado', isCorrect: false },
      { id: 'opt_b', label: 'La Llave de Silicio y Pulsos Digitales', isCorrect: true },
      { id: 'opt_c', label: 'La Llave de Cristal de Cuarzo', isCorrect: false },
      { id: 'opt_d', label: 'La Llave de Roble Ancestral', isCorrect: false }
    ],
    hint: 'La adivinanza alude a aquello invisible que viaja por fibra óptica y ondas Wi-Fi, hecho de bits y procesado en microchips de silicio.',
    explanation: '¡Brillante! La Información y los Datos digitales son el núcleo de la sociedad moderna, protegidos por especialistas en Ciberseguridad y Redes de TI.'
  },
  {
    id: 6,
    slug: 'memoria',
    title: 'El Espejo de la Memoria',
    type: 'memory_recall',
    icon: 'Eye',
    durationSecs: 40,
    tiSkill: 'Memoria Volátil (RAM & Caché)',
    description: 'El espejo muestra una secuencia mágica efímera antes de ocultarla bajo un velo de niebla.',
    question: 'Observa con atención el espejo durante los 3 segundos que dura la proyección mágica. Cuando las cartas se volteen mostrando su dorso, deberás identificar qué artefacto se encontraba exactamente en la posición CENTRAL (segunda casilla).',
    options: [
      { id: 'opt_a', label: 'El Rayo crepitante', isCorrect: false },
      { id: 'opt_b', label: 'El Escudo protector', isCorrect: true },
      { id: 'opt_c', label: 'La Poción alquímica', isCorrect: false },
      { id: 'opt_d', label: 'El Pergamino sellado', isCorrect: false }
    ],
    hint: 'La secuencia proyectada tenía un orden: el elemento de ataque primero, el elemento de defensa en el medio y el brebaje al final.',
    explanation: '¡Gran retención! La memoria RAM y los registros de la CPU almacenan secuencias de datos ultrarrápidas de forma volátil durante milisegundos para ejecutar tareas complejas.'
  },
  {
    id: 7,
    slug: 'alfabeto',
    title: 'El Alfabeto Secreto',
    type: 'cipher',
    icon: 'Scroll',
    durationSecs: 50,
    tiSkill: 'Criptografía & Ciberseguridad',
    description: 'Un mensaje secreto interceptado está codificado en glifos rúnicos.',
    question: 'Utiliza la tabla criptográfica para descifrar el conjuro interceptado:\n[★] - [▲] - [■] - [●] - [◆]\n¿Qué término técnico fundamental revela la combinación?',
    options: [
      { id: 'opt_a', label: 'D - A - T - O - S', isCorrect: true },
      { id: 'opt_b', label: 'R - E - D - E - S', isCorrect: false },
      { id: 'opt_c', label: 'B - Y - T - E - S', isCorrect: false },
      { id: 'opt_d', label: 'L - O - G - I - C', isCorrect: false }
    ],
    hint: 'Reemplaza cada glifo rúnico con su letra correspondiente en la tabla del descifrador: ★ es D, ▲ es A, ■ es T, ● es O, ◆ es S.',
    explanation: '¡Extraordinario! Acabas de realizar una operación de criptoanálisis por sustitución monoalfabética, la raíz histórica de la encriptación digital AES y RSA.'
  },
  {
    id: 8,
    slug: 'laberinto',
    title: 'El Laberinto Mágico',
    type: 'sequence_instructions',
    icon: 'Compass',
    durationSecs: 50,
    tiSkill: 'Secuenciación de Instrucciones (Algoritmos)',
    description: 'Navega mentalmente a través de giros angulares en una encrucijada encantada.',
    question: 'Un explorador se ubica en el centro de un laberinto con su brújula apuntando inicialmente hacia el NORTE.\nEjecuta las siguientes maniobras de orientación en secuencia:\n1. Gira 90° a su derecha.\n2. Da media vuelta completa sobre sí mismo (180°).\n3. Gira 90° hacia su derecha.\n¿Hacia qué punto cardinal apunta finalmente su brújula?',
    options: [
      { id: 'opt_a', label: 'Norte', isCorrect: true },
      { id: 'opt_b', label: 'Este', isCorrect: false },
      { id: 'opt_c', label: 'Sur', isCorrect: false },
      { id: 'opt_d', label: 'Oeste', isCorrect: false }
    ],
    hint: 'Sigue la trayectoria: Mirando al Norte (0°), 90° a la derecha apunta al Este. Una media vuelta (180°) apunta al Oeste. Girar 90° a la derecha desde el Oeste te devuelve hacia...',
    explanation: '¡Excelente cálculo angular! Los algoritmos de robótica, vehículos autónomos y navegación GPS calculan transformaciones geométricas espaciales continuamente.'
  },
  {
    id: 9,
    slug: 'codigo',
    title: 'El Código del Mago',
    type: 'binary_logic',
    icon: 'Binary',
    durationSecs: 50,
    tiSkill: 'Aritmética Binaria (Base 2)',
    description: 'En la cripta hay cuatro antorchas rúnicas de izquierda a derecha con pesos exponenciales: 8, 4, 2 y 1.',
    question: 'El encantamiento activa el siguiente estado binario:\n[Antorcha 8: Apagada (0)]\n[Antorcha 4: Encendida (1)]\n[Antorcha 2: Encendida (1)]\n[Antorcha 1: Apagada (0)]\n¿Cuál es el valor decimal resultante al sumar únicamente las antorchas encendidas (0 1 1 0)?',
    options: [
      { id: 'opt_a', label: '6', isCorrect: true },
      { id: 'opt_b', label: '7', isCorrect: false },
      { id: 'opt_c', label: '12', isCorrect: false },
      { id: 'opt_d', label: '3', isCorrect: false }
    ],
    hint: 'Suma exclusivamente los valores de las antorchas que tienen fuego encendido: 4 + 2.',
    explanation: '¡Magistral! Has convertido el número binario 0110 a su valor decimal 6. El sistema binario es el lenguaje nativo con el que operan todos los transistores del mundo.'
  },
  {
    id: 10,
    slug: 'formula',
    title: 'La Fórmula Encantada',
    type: 'ordering_steps',
    icon: 'Workflow',
    durationSecs: 50,
    tiSkill: 'Pipelines & Dependencia de Tareas',
    description: 'Un ritual de transmutación requiere cuatro fases estrictas. Si una fase se adelanta a sus dependencias, el caldero explota.',
    question: 'Reglas de dependencia del grimorio:\n- Fase A: Decantar el elixir final (exige que el caldero ya haya hervido).\n- Fase B: Pesar los reactivos en seco (no requiere nada previo).\n- Fase C: Disolver la mezcla (exige tener los reactivos previamente pesados).\n- Fase D: Encender la llama y hervir (debe hacerse inmediatamente tras disolver la mezcla).\n¿Cuál es el único orden válido para que el proceso no colapse?',
    options: [
      { id: 'opt_a', label: 'Pesar ➔ Disolver ➔ Hervir ➔ Decantar', isCorrect: true },
      { id: 'opt_b', label: 'Pesar ➔ Hervir ➔ Disolver ➔ Decantar', isCorrect: false },
      { id: 'opt_c', label: 'Disolver ➔ Pesar ➔ Hervir ➔ Decantar', isCorrect: false },
      { id: 'opt_d', label: 'Decantar ➔ Hervir ➔ Disolver ➔ Pesar', isCorrect: false }
    ],
    hint: 'Identifica la tarea inicial independiente (Fase B: Pesar) y sigue la cadena de dependencias lógicas hasta la fase final de decantación.',
    explanation: '¡Brillante! En la ingeniería de software, esto se conoce como Ordenamiento Topológico en Grafos Acíclicos (DAGs) y Pipelines de CI/CD: cada tarea depende de que su prerrequisito haya finalizado con éxito.'
  }
];
