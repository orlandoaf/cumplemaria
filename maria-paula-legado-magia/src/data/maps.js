const seg = (L, g) => g ? [[0, g[0]], [g[1], L]].filter(s => s[1] > s[0]) : [[0, L]]; // Tramos de un borde descontando la salida
const edge = (m, e) => ({ n: { x: e.at, y: 0, w: e.len, h: 12 }, s: { x: e.at, y: m.h - 12, w: e.len, h: 12 }, w: { x: 0, y: e.at, w: 12, h: e.len }, e: { x: m.w - 12, y: e.at, w: 12, h: e.len } })[e.side]; // Zona de portal por lado
const build = m => { // Genera muros perimetrales y portales a partir de las salidas
  const g = {}, T = m.sky || 24, W = []; (m.exits || []).forEach(e => { g[e.side] = [e.at, e.at + e.len]; }); // Huecos por lado
  seg(m.w, g.n).forEach(([a, b]) => W.push({ x: a, y: 0, w: b - a, h: T, hide: !!m.sky })); // Borde norte (oculto si hay cielo)
  seg(m.w, g.s).forEach(([a, b]) => W.push({ x: a, y: m.h - 24, w: b - a, h: 24 })); // Borde sur
  seg(m.h, g.w).forEach(([a, b]) => W.push({ x: 0, y: a, w: 24, h: b - a })); // Borde oeste
  seg(m.h, g.e).forEach(([a, b]) => W.push({ x: m.w - 24, y: a, w: 24, h: b - a })); // Borde este
  m.walls = W; m.portals = (m.exits || []).map(e => ({ ...edge(m, e), to: e.to, spawn: e.spawn, side: e.side })); return m; // Entrega el mapa completo
}; // Fin build
export const MAPS = { // Datos de los 7 capítulos (decor: [prop, x, y-base]; fx: partículas; ambient: [color, opacidad])
  Ch1_Station: build({ name: 'Estación del Expreso', w: 640, h: 360, ground: 'cobble', wall: 'brick', spawn: { x: 60, y: 180 }, ambient: ['#1b2a4a', 0.2], // Estación al atardecer
    exits: [{ side: 'e', at: 130, len: 100, to: 'Ch2_Path', spawn: { x: 60, y: 220 } }], // Salida al camino
    decor: [['train', 150, 92], ['lamp', 320, 112], ['lamp', 520, 112], ['lamp', 320, 310], ['bench', 430, 120], ['bench', 540, 300], ['sign', 330, 260], ['luggage', 242, 174], ['luggage', 500, 215], ['crate', 575, 120], ['crate', 593, 120], ['barrel', 80, 300], ['barrel', 104, 308], ['barrel', 62, 326]], decals: [['pebble', 30], ['crack', 12], ['puddle', 3]], // Locomotora, faroles, bancas y equipaje
    fx: [{ t: 'steam', x: 40, y: 70, w: 70 }, { t: 'steam', x: 190, y: 70, w: 50, c: 0xdddddd }], // Vapor de la locomotora
    interactables: [{ x: 230, y: 150, w: 24, h: 24, lines: ['Un equipaje con una etiqueta: "M. P."', '(Los objetos reales llegan en la Fase 4.)'] }] }), // Objeto de prueba
  Ch2_Path: build({ name: 'Camino al castillo', w: 800, h: 400, sky: 90, ground: 'grass', wall: 'hedge', spawn: { x: 60, y: 220 }, ambient: ['#1a2a40', 0.16], // Bosque con castillo lejano
    exits: [{ side: 'w', at: 170, len: 100, to: 'Ch1_Station', spawn: { x: 590, y: 180 } }, { side: 'e', at: 170, len: 100, to: 'Ch3_Castle', spawn: { x: 60, y: 300 } }], // Estación y castillo
    decor: [['tree', 130, 170], ['tree', 210, 340], ['tree', 330, 150], ['tree', 460, 350], ['tree', 560, 160], ['tree', 700, 150], ['tree', 730, 350], ['rock', 270, 250], ['rock', 520, 270], ['lake', 620, 370], ['lamp', 160, 280], ['lamp', 420, 290], ['bush', 100, 130], ['bush', 250, 118], ['bush', 420, 128], ['bush', 640, 122], ['bush', 130, 352], ['bush', 380, 345]], decals: [['tuft', 80], ['pebble', 14], ['petal', 24]], // Bosque, rocas, lago y faroles
    fx: [{ t: 'fireflies', x: 40, y: 110, w: 720, h: 260 }, { t: 'leaves', x: 40, y: 100, w: 400, h: 40 }, { t: 'motes', x: 545, y: 300, w: 150, h: 60, c: 0xffffff }], // Luciérnagas y hojas
    interactables: [{ x: 600, y: 250, w: 24, h: 24, lines: ['A lo lejos se adivina la silueta del castillo...'] }] }), // Mensaje de prueba
  Ch3_Castle: build({ name: 'Castillo de Hogwarts', w: 800, h: 480, ground: 'flag', wall: 'brick', spawn: { x: 60, y: 300 }, ambient: ['#101830', 0.24], // Patio y pasillos
    exits: [{ side: 'w', at: 270, len: 80, to: 'Ch2_Path', spawn: { x: 740, y: 220 } }, { side: 'n', at: 360, len: 80, to: 'Ch6_GreatHall', spawn: { x: 400, y: 420 } }, { side: 'e', at: 270, len: 80, to: 'Ch4_Library', spawn: { x: 60, y: 250 } }, { side: 's', at: 360, len: 80, to: 'Ch5_Potions', spawn: { x: 320, y: 60 } }], // Cuatro conexiones
    decor: [['torch', 120, 54], ['torch', 260, 54], ['torch', 540, 54], ['torch', 680, 54], ['painting', 190, 66], ['painting', 330, 66], ['painting', 470, 66], ['painting', 610, 66], ['door', 130, 70], ['armor', 100, 150], ['armor', 700, 150], ['armor', 100, 410], ['armor', 700, 410], ['stairs', 640, 220], ['pillar', 210, 235], ['pillar', 210, 405], ['pillar', 590, 235], ['pillar', 590, 405], ['runner', 400, 460], ['barrel', 60, 430], ['barrel', 84, 440]], decals: [['crack', 24], ['moss', 12], ['pebble', 10]], // Antorchas, cuadros, armaduras y escalera
    fx: [{ t: 'motes', x: 60, y: 60, w: 680, h: 380, c: 0xaad4ff }], // Polvo mágico
    interactables: [{ x: 318, y: 40, w: 24, h: 24, lines: ['El cuadro te sigue con la mirada y susurra: "Busca el Gran Comedor, hacia el norte."', '(Diálogos completos de cuadros: Fase 4-5.)'] }] }), // Cuadro que habla
  Ch4_Library: build({ name: 'Biblioteca Encantada', w: 640, h: 400, ground: 'wood', wall: 'dwall', spawn: { x: 60, y: 250 }, ambient: ['#2a1a08', 0.26], // Biblioteca cálida
    exits: [{ side: 'w', at: 200, len: 90, to: 'Ch3_Castle', spawn: { x: 740, y: 310 } }], // Regreso al castillo
    decor: [['shelf', 90, 80], ['shelf', 160, 80], ['shelf', 230, 80], ['shelf', 300, 80], ['shelf', 370, 80], ['shelf', 440, 80], ['shelf', 510, 80], ['shelf', 300, 220], ['shelf', 380, 220], ['shelf', 460, 220], ['shelf', 540, 220], ['table', 250, 340], ['table', 450, 350], ['candle', 250, 312], ['candle', 450, 322], ['book', 320, 170], ['book', 500, 150], ['book', 420, 280], ['chandelier', 320, 165], ['rug', 350, 372], ['crate', 70, 350], ['barrel', 90, 365]], decals: [['paper', 16], ['crack', 6]], // Estanterías, mesas, velas y libros flotantes
    fx: [{ t: 'motes', x: 60, y: 60, w: 520, h: 300 }], // Polvo dorado
    interactables: [{ x: 276, y: 176, w: 48, h: 44, lines: ['Los lomos de los libros brillan débilmente...', '(Búsqueda de los tres libros antiguos: Fase 4.)'] }] }), // Estantería
  Ch5_Potions: build({ name: 'Aula de Pociones', w: 640, h: 360, ground: 'flag', wall: 'brick', spawn: { x: 320, y: 60 }, ambient: ['#0a2a20', 0.24], // Laboratorio verdoso
    exits: [{ side: 'n', at: 280, len: 80, to: 'Ch3_Castle', spawn: { x: 400, y: 430 } }], // Regreso al castillo
    decor: [['shelf', 120, 76], ['shelf', 200, 76], ['shelf', 440, 76], ['shelf', 520, 76], ['cauldron', 200, 210], ['cauldron', 320, 210], ['cauldron', 440, 210], ['table', 200, 290], ['table', 320, 290], ['table', 440, 290], ['plant', 70, 300], ['plant', 570, 300], ['plant', 570, 110], ['rune', 200, 216, 0x7dff7d], ['rune', 320, 216, 0xc07dff], ['rune', 440, 216, 0x7dd0ff], ['barrel', 70, 120], ['barrel', 94, 130], ['crate', 580, 230]], decals: [['puddle', 6], ['crack', 10], ['moss', 8]], // Estantes, calderos, mesas y plantas
    fx: [{ t: 'steam', x: 190, y: 190, w: 20, c: 0x7dff7d }, { t: 'steam', x: 310, y: 190, w: 20, c: 0xc07dff }, { t: 'steam', x: 430, y: 190, w: 20, c: 0x7dd0ff }], // Vapores de colores
    interactables: [{ x: 308, y: 186, w: 24, h: 24, lines: ['El caldero burbujea con un brillo violeta.', '(Minijuego de la poción: Fase 4.)'] }] }), // Caldero
  Ch6_GreatHall: build({ name: 'Gran Comedor', w: 800, h: 480, ground: 'flag', wall: 'brick', spawn: { x: 400, y: 420 }, ambient: ['#2a1630', 0.2], // Salón majestuoso
    exits: [{ side: 's', at: 360, len: 80, to: 'Ch3_Castle', spawn: { x: 400, y: 60 } }, { side: 'e', at: 190, len: 100, to: 'Ch7_Gryffindor', spawn: { x: 60, y: 240 } }], // Castillo y Gryffindor
    decor: [['banner', 100, 70], ['banner', 300, 70], ['banner', 500, 70], ['banner', 700, 70], ['hall_table', 250, 190], ['hall_table', 250, 350], ['hall_table', 550, 190], ['hall_table', 550, 350], ['hat', 400, 92], ['candle', 150, 110], ['candle', 260, 130], ['candle', 340, 100], ['candle', 460, 110], ['candle', 560, 130], ['candle', 650, 105], ['candle', 220, 280], ['candle', 580, 290], ['runner', 400, 450], ['pillar', 90, 170], ['pillar', 90, 380], ['pillar', 710, 130], ['pillar', 710, 400], ['chandelier', 250, 150], ['chandelier', 550, 150], ['chandelier', 400, 205]], decals: [['crack', 16], ['pebble', 8]], // Estandartes, mesas, sombrero y velas flotantes
    fx: [{ t: 'motes', x: 60, y: 40, w: 680, h: 200, c: 0xfff0b0 }], // Techo mágico
    interactables: [{ x: 390, y: 68, w: 20, h: 24, lines: ['El Sombrero Seleccionador parece dormitar...', '(La ceremonia llega en la Fase 5.)'] }] }), // Sombrero
  Ch7_Gryffindor: build({ name: 'Sala Común de Gryffindor', w: 800, h: 440, ground: 'carpet', wall: 'dwall', spawn: { x: 60, y: 240 }, ambient: ['#3a1008', 0.2], // Sala cálida
    exits: [{ side: 'w', at: 190, len: 100, to: 'Ch6_GreatHall', spawn: { x: 740, y: 240 } }], // Regreso al comedor
    decor: [['fireplace', 400, 90], ['banner', 200, 70], ['banner', 600, 70], ['sofa', 300, 190], ['sofa', 500, 190], ['table', 400, 310], ['cake', 400, 302], ['gift', 240, 340], ['gift', 560, 340], ['gift', 640, 270], ['torch', 120, 54], ['torch', 680, 54], ['window', 300, 74], ['window', 500, 74], ['rug', 400, 270, 0xc8962a]], // Chimenea, sofás, pastel y regalos
    fx: [{ t: 'embers', x: 380, y: 60, w: 40 }, { t: 'motes', x: 60, y: 60, w: 680, h: 320, c: 0xffc07a }], // Brasas y motas cálidas
    interactables: [{ x: 390, y: 280, w: 20, h: 22, lines: ['Un pastel te espera en la mesa...', '(La sorpresa completa: Fases 6-7.)'] }] }) // Pastel
}; // Fin MAPS

const npc = (id, name, x, y, robe, scarf, hair, o = {}) => ({ kind: 'npc', id, name, x, y, w: 22, h: 26, look: { robe, scarf, hair }, ...o }); // Atajo para definir un NPC
const orb = (id, item, x, y, tint, o = {}) => ({ kind: 'item', id, item, x, y, w: 18, h: 18, tint, ...o }); // Atajo para un objeto recogible
const EXTRA = { // Contenido de la Fase 4 por capítulo: misión, interacciones y puertas con requisito
  Ch1_Station: { quest: 'q1', gates: { e: { req: 'q:q1', hint: 'Aún debes encontrar al guía. Revisa tu equipaje y habla con él.' } }, interactables: [], things: [ // Capítulo 1
    { kind: 'talk', id: 'luggage', script: 'luggage', x: 242, y: 164, w: 26, h: 22 }, // Equipaje con la carta
    npc('guia', 'Guía', 585, 150, '#2f6a4f', '#e0b030', '#c8c8c8', { script: 'guide' }), // Guía del andén
    npc('est1', 'Estudiante', 370, 215, '#3a5a8a', '#3a8a5a', '#2a2a2a', { lines: ['Estudiante: ¡Es mi primer año! Dicen que el castillo cambia de lugar las escaleras.', 'Estudiante: El guía está cerca de la salida este.'] }), // Estudiante 1
    npc('est2', 'Estudiante', 560, 250, '#7a3a6a', '#d0a030', '#8a4a20', { script: 'student2' }), // Estudiante con bufanda perdida
    orb('bufanda', 'objeto_perdido', 440, 318, 0xff8080, { lines: ['Una bufanda olvidada junto a un banco. Alguien la estará buscando.'] }), // Objeto perdido
    { kind: 'talk', id: 'letrero', x: 330, y: 248, w: 22, h: 26, lines: ['Letrero: Expreso Mágico. Próximo destino: el castillo, al final del sendero del bosque.'] }] }, // Letrero
  Ch2_Path: { quest: 'q2', gates: { e: { req: 'q:q2', hint: 'El camino sigue cerrado: recupera los tres objetos y resuelve el acertijo del guardabosques.' } }, things: [ // Capítulo 2
    orb('amuleto', 'amuleto_bosque', 500, 345, 0xffd27a, { progress: 'q2', lines: ['Un amuleto reluce entre las rocas de la orilla del lago.'] }), // Objeto 1
    orb('pluma', 'pluma_plata', 56, 118, 0xd0e0ff, { progress: 'q2', lines: ['Rincón escondido entre los arbustos: una pluma de plata brilla en el suelo.'] }), // Objeto 2 (zona oculta)
    orb('orbe', 'orbe_musgo', 300, 335, 0x7dff7d, { progress: 'q2', lines: ['Un orbe cubierto de musgo late suavemente bajo un árbol.'] }), // Objeto 3
    orb('flor', 'flor_luminosa', 750, 360, 0xff9ad0, { lines: ['Zona oculta: una flor luminosa crece donde casi nadie mira. ¡Pequeña recompensa por explorar!'] }), // Recompensa oculta
    npc('guardabosques', 'Guardabosques', 640, 215, '#4a5a2a', '#8a5a24', '#6a4a2a', { script: 'ranger' })] }, // Guardabosques
  Ch3_Castle: { quest: 'q3', gates: { e: { req: 'q:q3', hint: 'Antes de ir a la biblioteca, averigua dónde está el Gran Comedor.' }, s: { req: 'q:q4', hint: 'Primero descifra el mensaje de la biblioteca.' }, n: { req: 'q:q5', hint: 'El Gran Comedor abrirá sus puertas cuando prepares tu poción.' } }, interactables: [], things: [ // Capítulo 3
    npc('prefecta', 'Prefecta', 330, 335, '#5a2a2a', '#c0c0c0', '#3a2a1a', { progress: 'q3', lines: ['Prefecta: ¿Buscas el Gran Comedor? Está al norte, pero sus puertas solo se abren a quien ya demostró su valía.', 'Prefecta: Consulta los retratos: saben más de lo que aparentan.'] }), // Prefecta
    { kind: 'talk', id: 'retrato1', x: 190, y: 52, w: 26, h: 28, progress: 'q3', lines: ['Retrato del Mago Sabio: Primero la biblioteca, luego las pociones, y al final la gran sala. Así se hace.'] }, // Retrato 1
    { kind: 'talk', id: 'retrato2', x: 330, y: 52, w: 26, h: 28, progress: 'q3', lines: ['Retrato de la Dama del Lago: El cuadro te sigue con la mirada y susurra: "Busca el Gran Comedor, hacia el norte."'] }, // Retrato 2
    { kind: 'talk', id: 'retrato3', x: 470, y: 52, w: 26, h: 28, lines: ['Retrato del Caballero Distraído: ¿Has visto mi caballo? Creo que lo dejé en el patio...'] }, // Retrato 3
    { kind: 'talk', id: 'retrato4', x: 610, y: 52, w: 26, h: 28, lines: ['Retrato del Cocinero: Si buscas la cena, sigue el olor a pastel de calabaza.'] }] }, // Retrato 4
  Ch4_Library: { quest: 'q4', interactables: [], things: [ // Capítulo 4
    orb('tomo1', 'libro_1', 320, 170, 0xff8080, { art: 'decor', progress: 'q4', lines: ['Un libro flotante se posa en tus manos: "Tomo antiguo I".'] }), // Libro 1 (flotante)
    orb('tomo2', 'libro_2', 500, 150, 0xff8080, { art: 'decor', progress: 'q4', lines: ['Otro libro desciende suavemente: "Tomo antiguo II".'] }), // Libro 2
    orb('tomo3', 'libro_3', 420, 280, 0xff8080, { art: 'decor', progress: 'q4', lines: ['Un tercer libro baja del aire: "Tomo antiguo III".'] }), // Libro 3
    orb('marca', 'marcapaginas', 590, 350, 0xffd27a, { lines: ['Un marcapáginas encantado brilla entre las mesas.'] }), // Coleccionable
    orb('tinta', 'tinta_brillante', 110, 300, 0x80c0ff, { lines: ['Un tintero de tinta brillante, olvidado en el suelo.'] }), // Coleccionable
    orb('grimorio', 'grimorio_olvidado', 582, 130, 0xc07dff, { lines: ['Zona secreta: tras la última estantería hay un grimorio olvidado.'] }), // Zona secreta
    { kind: 'talk', id: 'atril', script: 'atril', x: 300, y: 200, w: 48, h: 44 }, // Atril del acertijo
    npc('biblio', 'Bibliotecaria', 180, 345, '#4a3a6a', '#d0b060', '#b0b0b0', { lines: ['Bibliotecaria: Silencio, por favor. Tres tomos antiguos flotan por la sala; reúnelos y llévalos al atril.', 'Bibliotecaria: Y no olvides mirar tras las estanterías...'] })] }, // Bibliotecaria
  Ch5_Potions: { quest: 'q5', interactables: [], things: [ // Capítulo 5
    orb('ing1', 'hoja_plata', 120, 112, 0xd0e0ff), orb('ing2', 'raiz_luna', 200, 112, 0xe0d0ff), orb('ing3', 'polvo_estrella', 440, 112, 0xffe080), orb('ing4', 'petalo_fuego', 520, 112, 0xff7a40), orb('ing5', 'escama_lago', 580, 165, 0x60c0ff), orb('ing6', 'baya_sombra', 100, 316, 0x8060c0), // Seis ingredientes
    { kind: 'talk', id: 'receta', x: 200, y: 268, w: 40, h: 22, lines: ['Libro de recetas: "Poción de Luz Dorada".', '"Primero, la hoja que brilla como la plata. Luego, la raíz que crece bajo la luna. Por último, el polvo que cae del cielo."'] }, // Pista
    { kind: 'talk', id: 'caldero', script: 'cauldron', x: 320, y: 198, w: 28, h: 24 }, // Caldero (minijuego)
    npc('profe', 'Profesor de Pociones', 500, 255, '#2a4a3a', '#a0c040', '#4a4a4a', { lines: ['Profesor: Hoy prepararemos una Poción de Luz Dorada. Reúne ingredientes por el aula y sigue la receta.', 'Profesor: Ojo: el orden importa. Una mala mezcla puede volar el caldero.'] })] }, // Profesor
  Ch6_GreatHall: { quest: 'q6', gates: { e: { req: 'f:sorted', hint: 'Las puertas se abrirán tras la ceremonia de selección. (Llega en la Fase 5)' } } } // Capítulo 6
}; // Fin EXTRA
Object.entries(EXTRA).forEach(([k, e]) => { const m = MAPS[k]; m.quest = e.quest; m.things = e.things || []; if (e.interactables) m.interactables = e.interactables; m.portals.forEach(p => { const g = e.gates && e.gates[p.side]; if (g) Object.assign(p, g); }); }); // Fusiona el contenido en cada mapa
Object.values(MAPS).forEach(m => { m.things = m.things || []; }); // Todo mapa tiene lista de interacciones (aunque vacía)
