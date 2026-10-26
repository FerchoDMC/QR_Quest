-- ============================================================================
-- MIGRACIÓN 04: DATOS INICIALES (SEED) - 10 DESAFÍOS Y 6 COMODINES
-- Proyecto: El Desafío Mágico de TI - Portal Institucional UIDE Loja
-- Fase: 1 - Infraestructura de Base de Datos
-- Autor: Antigravity Architect
-- Fecha: 22 de Octubre de 2026
-- ============================================================================

-- 1. POBLADO DE LOS 6 COMODINES MÁGICOS
INSERT INTO public.wildcards (slug, name, type, emoji, short_desc, description, is_active)
VALUES 
    ('escudo', 'Escudo de Protección', 'defensive', '🛡️', 'Absorbe 1 error sin descontar vidas', 'El Escudo Mágico te protege de un error de encantamiento. Si fallas una respuesta, el intento no se descontará.', true),
    ('ayuda_mago', 'Ayuda del Mago', 'social', '🧙', 'Pide auxilio a alguien en el campus', 'Una misión social colaborativa: encuentra a alguien en la feria con una característica específica para resolver el misterio juntos.', true),
    ('sabiduria', 'Poción de Sabiduría', 'logic', '🧪', 'Descarta 2 opciones incorrectas (50/50)', 'El caldero de la verdad disuelve dos respuestas erróneas, dejándote con solo dos alternativas.', true),
    ('giratiempo', 'Giratiempo', 'time', '⏳', 'Agrega +20 segundos al contador del reto', 'Gira el reloj mágico para retroceder el tiempo y ganar 20 segundos adicionales de análisis.', true),
    ('fenix', 'Fénix Salvador', 'retry', '🔥', 'Otorga 1 intento extraordinario de rescate', 'Si has agotado todos tus intentos en un desafío, el Fénix renace de las cenizas otorgándote un último intento de rescate por 60 puntos.', true),
    ('felix', 'Felix Felicis', 'special', '✨', 'Super-pista o recicla un comodín agotado', 'La suerte líquida de Hogwarts te permite consultar la pista oculta del grimorio o reactivar un comodín que ya hayas consumido.', true)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name,
    type = EXCLUDED.type,
    emoji = EXCLUDED.emoji,
    short_desc = EXCLUDED.short_desc,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- 2. POBLADO DE LOS 10 DESAFÍOS OFICIALES
-- Notar que 'options' NO incluye 'isCorrect'; la respuesta correcta se almacena exclusivamente en 'correct_option_id'
INSERT INTO public.challenges (
    slug, title, type, icon, duration_secs, ti_skill, 
    description, question, options, correct_option_id, hint, explanation, is_active
) VALUES 
    (
        'runas', 
        'El Enigma de las Runas', 
        'sequence', 
        'Sparkles', 
        45, 
        'Reconocimiento de Patrones Complejos',
        'Descifra la regla oculta que gobierna esta secuencia de polígonos sagrados.',
        'Observa la progresión de glifos en el altar. Cada figura geométrica guarda una relación estricta con la siguiente. ¿Cuál es el glifo que debe ocupar la quinta ranura para equilibrar el encantamiento?',
        '[{"id": "opt_a", "label": "Hexágono rúnico"}, {"id": "opt_b", "label": "Heptagrama místico"}, {"id": "opt_c", "label": "Círculo oracular"}, {"id": "opt_d", "label": "Rombo elemental"}]'::jsonb,
        'opt_b',
        'Observa el número de lados o vértices de cada figura geométrica en la secuencia: triángulo (3), cuadrilátero (4), pentágono (5), hexágono (6)... ¿Qué figura tiene la cantidad siguiente (7)?',
        '¡Excelente deducción! En programación y Ciencia de Datos, el reconocimiento de patrones es la base de la Inteligencia Artificial y la visión por computadora para predecir series y clasificar información.',
        true
    ),
    (
        'pocion', 
        'La Poción Correcta', 
        'logic_deduction', 
        'FlaskConical', 
        60, 
        'Deducción Lógica & Filtrado de Datos',
        'En el laboratorio hay cuatro elixires de distintos colores. Solo uno cura el encantamiento sin ser letal.',
        'El pergamino del boticario contiene tres condiciones indispensables: 1. El antídoto despide vapor plateado constante. 2. Los elixires de color verde y ámbar provocan parálisis inmediata. 3. El frasco de tonalidad azul zafiro contiene veneno destilado de basilisco. ¿Cuál elixir debes verter en el caldero?',
        '[{"id": "opt_a", "label": "Elixir Esmeralda (Verde)"}, {"id": "opt_b", "label": "Elixir Zafiro (Azul)"}, {"id": "opt_c", "label": "Elixir Amatista Púrpura"}, {"id": "opt_d", "label": "Elixir Ámbar Dorado"}]'::jsonb,
        'opt_c',
        'Descarta paso a paso: elimina los frascos prohibidos por la condición 2 (verde y ámbar) y el veneno de la condición 3 (azul). ¿Cuál es el único que queda con vapor activo?',
        '¡Perfecto! Acabas de ejecutar mentalmente un filtro booleano condicional (WHERE color NOT IN (verde, ámbar, azul) AND vapor = true), tal como lo hacen las consultas a bases de datos en SQL.',
        true
    ),
    (
        'hechizo', 
        'El Hechizo Lógico', 
        'conditional', 
        'Wand2', 
        45, 
        'Lógica Condicional (Compuertas Lógicas)',
        'La cripta de los secretos está protegida por dos runas elementales: SOL y LUNA.',
        'El guardián de piedra recita el enigma: La luz solar despierta a las bestias si la Luna también se encuentra encendida. Pero si la Luna reposa en el abismo, la luz solar es la única llave que disuelve el cerrojo. La oscuridad total jamás abrirá este umbral. ¿Qué estado rúnico abre la cripta?',
        '[{"id": "opt_a", "label": "Sol inactivo y Luna inactiva"}, {"id": "opt_b", "label": "Sol activo y Luna activa"}, {"id": "opt_c", "label": "Sol activo y Luna inactiva"}, {"id": "opt_d", "label": "Sol inactivo y Luna activa"}]'::jsonb,
        'opt_c',
        'Busca la única condición donde la luz del Sol esté encendida pero la Luna esté apagada para evitar que las bestias despierten.',
        '¡Exacto! Esta combinación representa la compuerta lógica AND-NOT en circuitos electrónicos y estructuras IF / ELSE en desarrollo de software.',
        true
    ),
    (
        'tablero', 
        'El Tablero Encantado', 
        'matrix', 
        'Grid3x3', 
        45, 
        'Matrices y Coordenadas Vectoriales',
        'Un mapa de baldosas encantadas en cuadrícula de 3x3 esconde una trampa mortal.',
        'El peón mágico se encuentra en el origen [1, 1] (fila 1, columna 1). El encantamiento de teletransporte ordena dos desplazamientos vectoriales consecutivos: Avanzar 2 posiciones hacia el Sur (filas abajo) y luego 1 posición hacia el Este (columnas a la derecha). ¿En qué casilla descansará el peón?',
        '[{"id": "opt_a", "label": "Casilla [2, 3]"}, {"id": "opt_b", "label": "Casilla [3, 1]"}, {"id": "opt_c", "label": "Casilla [3, 2]"}, {"id": "opt_d", "label": "Casilla [1, 3]"}]'::jsonb,
        'opt_c',
        'Suma a la fila inicial: 1 + 2 = Fila 3. Suma a la columna inicial: 1 + 1 = Columna 2. Une ambas coordenadas.',
        '¡Brillante! El manejo de matrices bidimensionales [i, j] y planos cartesianos es esencial para la programación de videojuegos, gráficos 3D y renderizado de interfaces.',
        true
    ),
    (
        'llave', 
        'La Llave del Tesoro', 
        'cryptography', 
        'KeyRound', 
        45, 
        'Ciberseguridad & Autenticación',
        'Frente a ti reposa el gran cofre de las reliquias. Cuatro llaves con símbolos grabados cuelgan de la pared.',
        'El pergamino de autenticación indica: La cerradura rechaza metales maleables como el oro y la plata. El cobre se oxida con el vapor de azufre del cofre. Solo la llave forjada con el elemento que da vida a los circuitos inteligentes resistirá el campo de fuerza. ¿Cuál llave abre el cerrojo?',
        '[{"id": "opt_a", "label": "La Llave de Oro Alquímico"}, {"id": "opt_b", "label": "La Llave de Silicio Luminoso"}, {"id": "opt_c", "label": "La Llave de Plata Lunar"}, {"id": "opt_d", "label": "La Llave de Cobre Rúnico"}]'::jsonb,
        'opt_b',
        'Descarta el oro, la plata y el cobre según las advertencias del pergamino. Piensa en el material semiconductor esencial de los chips informáticos.',
        '¡Correcto! El silicio es el elemento fundamental con el que se fabrican los procesadores y microchips del mundo digital. Además, la autenticación de llaves representa la criptografía moderna.',
        true
    ),
    (
        'memoria', 
        'El Espejo de la Memoria', 
        'memory', 
        'Layers', 
        45, 
        'Memoria Caché & Gestión de RAM',
        'El espejo del sabio refleja una secuencia de 4 reliquias mágicas durante unos instantes antes de desvanecerse.',
        'El espejo mostró en orden estricto: Fénix de Fuego, Caldero de Bronce, Varita de Sauco y Grimorio Ancestral. Si una ráfaga de viento desordena las cartas en tu mente, ¿cuál es la secuencia cronológica exacta que debes recitar?',
        '[{"id": "opt_a", "label": "Fénix ➔ Caldero ➔ Varita ➔ Grimorio"}, {"id": "opt_b", "label": "Caldero ➔ Fénix ➔ Grimorio ➔ Varita"}, {"id": "opt_c", "label": "Grimorio ➔ Varita ➔ Caldero ➔ Fénix"}, {"id": "opt_d", "label": "Fénix ➔ Varita ➔ Caldero ➔ Grimorio"}]'::jsonb,
        'opt_a',
        'Recuerda el orden de aparición inicial: el ave que arde, el recipiente de pociones, el instrumento del mago y finalmente el libro de hechizos.',
        '¡Memoria implacable! Los sistemas informáticos dependen de la Memoria RAM y la memoria Caché de alta velocidad para retener y procesar secuencias de datos inmediatas sin demoras.',
        true
    ),
    (
        'alfabeto', 
        'El Alfabeto Secreto', 
        'cypher', 
        'Binary', 
        45, 
        'Criptografía Clásica & Cifrado',
        'Un pergamino cifrado contiene un mensaje del Gran Maestre encriptado con una tabla de correspondencia.',
        'La tabla de runas traduce: ᚛ = D, ᚐ = A, ᚈ = T, ᚑ = O, ᚄ = S. En el muro de la biblioteca aparece grabado el siguiente enigma: ᚛ - ᚐ - ᚈ - ᚑ - ᚄ. ¿Qué palabra sagrada del mundo mágico y computacional se forma al descifrar el mensaje?',
        '[{"id": "opt_a", "label": "D - A - T - O - S"}, {"id": "opt_b", "label": "R - E - D - E - S"}, {"id": "opt_c", "label": "C - L - A - V - E"}, {"id": "opt_d", "label": "B - I - T - E - S"}]'::jsonb,
        'opt_a',
        'Sustituye símbolo por símbolo según la tabla: el primer glifo es D, el segundo es A, el tercero es T, el cuarto es O y el quinto es S.',
        '¡Descifrado con maestría! Acabas de aplicar un algoritmo de sustitución criptográfica, principio fundamental de la Ciberseguridad para proteger contraseñas y comunicaciones bancarias.',
        true
    ),
    (
        'laberinto', 
        'El Laberinto Mágico', 
        'algorithm', 
        'Compass', 
        45, 
        'Algoritmos de Navegación Espacial',
        'Un gólem encantado debe atravesar un laberinto de setos mágicos desde la entrada hasta el portal.',
        'El mapa muestra un camino recto de 2 pasos hacia el Norte, un giro obligatorio de 90 grados a la derecha hacia un pasaje libre, y luego avanzar 1 paso más hacia el portal. ¿Cuál es el conjunto exacto de instrucciones algorítmicas que debes programar en el gólem?',
        '[{"id": "opt_a", "label": "Avanzar 1 ➔ Girar Izquierda ➔ Avanzar 2"}, {"id": "opt_b", "label": "Avanzar 2 ➔ Girar Derecha ➔ Avanzar 1"}, {"id": "opt_c", "label": "Avanzar 3 ➔ Girar Derecha ➔ Retroceder 1"}, {"id": "opt_d", "label": "Girar Derecha ➔ Avanzar 2 ➔ Girar Izquierda"}]'::jsonb,
        'opt_b',
        'Sigue la ruta en orden: primero el gólem avanza 2 casillas al frente, luego rota 90° a la derecha y finalmente da 1 paso adelante para cruzar el portal.',
        '¡Excelente! Un algoritmo es una serie ordenada y finita de pasos e instrucciones lógicas para resolver un problema, la piedra angular del desarrollo de software.',
        true
    ),
    (
        'codigo', 
        'El Código del Mago', 
        'binary', 
        'Flame', 
        45, 
        'Aritmética Binaria & Arquitectura',
        'Cuatro antorchas sagradas están alineadas frente a la puerta del templo, cada una con un valor de poder: 8, 4, 2 y 1.',
        'Las antorchas encendidas representan el valor 1 (activo) y las apagadas el 0 (inactivo). La puerta del templo muestra el estado: [Apagada, Encendida, Encendida, Apagada] que corresponde al código binario 0 1 1 0. Sumando los valores de las antorchas encendidas (4 + 2), ¿cuál es el número decimal que abre la puerta?',
        '[{"id": "opt_a", "label": "4"}, {"id": "opt_b", "label": "5"}, {"id": "opt_c", "label": "6"}, {"id": "opt_d", "label": "12"}]'::jsonb,
        'opt_c',
        'Las antorchas tienen los valores posicionales 8, 4, 2 y 1. Si solo están encendidas la segunda (4) y la tercera (2), suma: 4 + 2 = ?',
        '¡Exacto! El sistema binario (0 y 1) es el lenguaje natural que entienden las computadoras. Cada antorcha encendida o apagada es un Bit de información.',
        true
    ),
    (
        'formula', 
        'La Fórmula Encantada', 
        'pipeline', 
        'GitMerge', 
        45, 
        'Pipelines de CI/CD & Grafos Acíclicos',
        'El maestro alquimista exige preparar el elixir de la sabiduría siguiendo estrictamente el orden de dependencias de la receta.',
        'Las reglas de alquimia dictan: 1. No se puede decantar antes de hervir. 2. Los ingredientes deben pesarse antes de disolverlos. 3. Para hervir la mezcla, primero debe estar completamente disuelta. ¿Cuál es el orden secuencial correcto de este pipeline de preparación?',
        '[{"id": "opt_a", "label": "Pesar ➔ Disolver ➔ Hervir ➔ Decantar"}, {"id": "opt_b", "label": "Hervir ➔ Pesar ➔ Disolver ➔ Decantar"}, {"id": "opt_c", "label": "Disolver ➔ Pesar ➔ Decantar ➔ Hervir"}, {"id": "opt_d", "label": "Decantar ➔ Hervir ➔ Disolver ➔ Pesar"}]'::jsonb,
        'opt_a',
        'Comienza por el paso fundamental previo: primero pesas los reactivos, luego los disuelves, después los sometes al fuego (hervir) y finalmente filtras el resultado (decantar).',
        '¡Impecable! En ingeniería de software moderna, esto se conoce como Pipeline de Integración y Despliegue Continuo (CI/CD) o DAG (Grafo Acíclico Dirigido), donde cada fase depende del éxito de la anterior.',
        true
    )
ON CONFLICT (slug) DO UPDATE 
SET title = EXCLUDED.title,
    type = EXCLUDED.type,
    icon = EXCLUDED.icon,
    duration_secs = EXCLUDED.duration_secs,
    ti_skill = EXCLUDED.ti_skill,
    description = EXCLUDED.description,
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    correct_option_id = EXCLUDED.correct_option_id,
    hint = EXCLUDED.hint,
    explanation = EXCLUDED.explanation,
    is_active = EXCLUDED.is_active;
