export const C = { w: '#7a4a24', W: '#4e2f16', s: '#8a8478', S: '#4a443d', r: '#a8232b', g: '#e0b030', G: '#3f7a30', b: '#2b3f7a', k: '#1e1a1f', p: '#6b3fa0', t: '#d8c9a0', m: '#9aa5ad', u: '#2f6fa0', o: '#e8741c', h: '#f4ecd8', n: '#4a2f1d', q: '#e87aa0' }; // Paleta compartida de props
const sh = (c, a) => { const n = parseInt(c.slice(1), 16); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, v + a)).toString(16).padStart(2, '0')).join(''); }; // Aclara/oscurece un color hex
export const rng = s => () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; // Aleatorio determinista (arte idéntica en cada carga)
// Props: w,h tamaño; s=[fracción de ancho, alto] de colisión en la base; g=[color, radio] de brillo; f=flota; bg=cuelga de la pared; r=rectángulos [x,y,w,h,color]
export const PROPS = { // Catálogo de props dibujables por código
  train: { w: 240, h: 64, s: [0.95, 12], r: () => [[18, 0, 14, 14, 'S'], [14, 0, 22, 3, 'k'], [196, 2, 40, 12, 'S'], [0, 10, 240, 42, 'k'], [0, 14, 240, 6, 'r'], [190, 13, 50, 3, 'g'], [0, 50, 240, 4, 'S'], [6, 54, 228, 4, 'k'], ...Array.from({ length: 8 }, (_, i) => [12 + i * 28, 24, 18, 14, 'g']), ...Array.from({ length: 10 }, (_, i) => [8 + i * 24, 56, 8, 8, 'S'])] }, // Locomotora con chimenea y cabina
  lamp: { w: 12, h: 46, s: [0.7, 6], g: ['#ffcf70', 52], r: () => [[5, 14, 2, 30, 'k'], [3, 42, 6, 4, 'S'], [2, 6, 8, 8, 'g'], [3, 7, 6, 6, 'h'], [1, 4, 10, 2, 'k'], [4, 2, 4, 2, 'k']] }, // Farol con cristal
  torch: { w: 10, h: 26, g: ['#ff9a30', 44], bg: 1, r: () => [[4, 10, 2, 16, 'W'], [3, 6, 4, 5, 'o'], [4, 3, 2, 4, 'g']] }, // Antorcha de pared
  bench: { w: 36, h: 18, s: [0.9, 8], r: () => [[2, 6, 32, 4, 'w'], [2, 10, 32, 2, 'W'], [4, 12, 3, 6, 'W'], [29, 12, 3, 6, 'W']] }, // Banca
  luggage: { w: 18, h: 14, s: [0.9, 8], r: () => [[1, 3, 16, 11, 'w'], [1, 6, 16, 2, 'g'], [7, 1, 4, 3, 'k']] }, // Maleta
  sign: { w: 16, h: 30, r: () => [[7, 8, 2, 22, 'W'], [1, 2, 14, 9, 't'], [3, 5, 10, 1, 'k']] }, // Letrero
  tree: { w: 40, h: 56, s: [0.3, 8], r: () => [[17, 34, 6, 22, 'W'], [2, 18, 36, 16, 'G'], [4, 6, 32, 14, 'G'], [8, 2, 24, 10, 'G']] }, // Árbol
  rock: { w: 20, h: 14, s: [0.9, 8], r: () => [[2, 4, 16, 10, 'm'], [5, 1, 10, 5, 'm']] }, // Roca
  lake: { w: 160, h: 80, s: [1, 50], r: () => [[0, 0, 160, 80, 'u'], [20, 20, 16, 2, 'h'], [90, 40, 20, 2, 'h'], [50, 60, 14, 2, 'h'], [120, 14, 12, 2, 'h']] }, // Lago
  armor: { w: 16, h: 34, s: [0.9, 8], r: () => [[4, 2, 8, 7, 'm'], [3, 9, 10, 14, 'm'], [4, 23, 3, 11, 'm'], [9, 23, 3, 11, 'm'], [2, 10, 2, 10, 'm'], [12, 10, 2, 10, 'm'], [7, 4, 2, 2, 'k']] }, // Armadura
  painting: { w: 24, h: 28, bg: 1, r: () => [[0, 0, 24, 28, 'g'], [2, 2, 20, 24, 'b'], [6, 8, 12, 12, 'p'], [9, 4, 6, 6, 't']] }, // Cuadro
  stairs: { w: 48, h: 40, s: [0.9, 12], r: () => [[0, 24, 48, 16, 's'], [4, 16, 40, 8, 's'], [8, 8, 32, 8, 's'], [12, 0, 24, 8, 's']] }, // Escalera de piedra
  door: { w: 24, h: 36, bg: 1, r: () => [[0, 0, 24, 36, 'W'], [2, 2, 20, 32, 'w'], [17, 18, 2, 2, 'g']] }, // Puerta
  shelf: { w: 48, h: 56, s: [0.9, 8], r: () => { const c = ['r', 'b', 'G', 'p', 'g'], q = rng(7), o = [[0, 0, 48, 56, 'W'], [2, 2, 44, 52, 'w']]; for (let y = 0; y < 3; y++) for (let x = 0; x < 7; x++) o.push([4 + x * 6, 6 + y * 17, 5, 13, c[(q() * 5) | 0]]); return o; } }, // Estantería con libros
  book: { w: 12, h: 10, f: 1, r: () => [[0, 2, 12, 8, 'r'], [1, 0, 10, 2, 't'], [5, 2, 2, 8, 'g']] }, // Libro flotante
  table: { w: 48, h: 24, s: [0.9, 8], r: () => [[0, 4, 48, 6, 'w'], [2, 10, 4, 14, 'W'], [42, 10, 4, 14, 'W']] }, // Mesa
  candle: { w: 6, h: 14, f: 1, g: ['#ffd27a', 30], r: () => [[2, 5, 2, 9, 'h'], [2, 2, 2, 3, 'o']] }, // Vela flotante
  cauldron: { w: 24, h: 24, s: [0.9, 8], g: ['#7dff7d', 34], r: () => [[2, 6, 20, 16, 'k'], [0, 4, 24, 4, 'S'], [3, 6, 18, 3, 'G'], [4, 22, 3, 2, 'k'], [17, 22, 3, 2, 'k']] }, // Caldero
  plant: { w: 16, h: 20, r: () => [[5, 12, 6, 8, 'w'], [2, 2, 12, 12, 'G'], [5, 0, 6, 6, 'G']] }, // Planta
  hall_table: { w: 120, h: 36, s: [0.95, 12], r: () => [[0, 2, 120, 5, 'w'], [2, 7, 4, 13, 'W'], [114, 7, 4, 13, 'W'], [40, 7, 4, 13, 'W'], [76, 7, 4, 13, 'W'], [10, 0, 6, 2, 'g'], [50, 0, 6, 2, 'g'], [90, 0, 6, 2, 'g'], [4, 22, 112, 4, 'w'], [8, 26, 4, 8, 'W'], [108, 26, 4, 8, 'W'], [58, 26, 4, 8, 'W']] }, // Mesa larga con banca
  banner: { w: 16, h: 40, bg: 1, r: () => [[0, 0, 16, 36, 'r'], [2, 0, 12, 3, 'g'], [6, 8, 4, 12, 'g'], [0, 36, 4, 4, 'r'], [12, 36, 4, 4, 'r']] }, // Estandarte
  hat: { w: 20, h: 24, f: 1, s: [0.8, 8], r: () => [[2, 16, 16, 6, 'n'], [5, 6, 10, 12, 'n'], [8, 0, 5, 8, 'n'], [7, 12, 2, 2, 'k'], [12, 12, 2, 2, 'k']] }, // Sombrero Seleccionador
  fireplace: { w: 56, h: 46, s: [0.9, 10], g: ['#ff8a30', 70], r: () => [[0, 0, 56, 46, 'S'], [8, 8, 40, 38, 'k'], [12, 28, 32, 18, 'o'], [18, 22, 20, 10, 'g']] }, // Chimenea
  sofa: { w: 44, h: 22, s: [0.9, 8], r: () => [[0, 0, 44, 10, 'r'], [0, 8, 44, 10, 'r'], [0, 14, 6, 8, 'W'], [38, 14, 6, 8, 'W']] }, // Sofá
  cake: { w: 20, h: 18, g: ['#ffb347', 24], r: () => [[2, 8, 16, 10, 'h'], [2, 8, 16, 3, 'q'], [4, 2, 2, 6, 't'], [9, 2, 2, 6, 't'], [14, 2, 2, 6, 't'], [4, 0, 2, 2, 'o'], [9, 0, 2, 2, 'o'], [14, 0, 2, 2, 'o']] }, // Pastel
  gift: { w: 14, h: 14, s: [0.9, 6], r: () => [[1, 3, 12, 11, 'b'], [6, 3, 2, 11, 'g'], [1, 7, 12, 2, 'g'], [4, 0, 6, 4, 'g']] }, // Regalo
  pillar: { w: 18, h: 60, s: [0.8, 8], r: () => [[0, 0, 18, 6, 's'], [3, 6, 12, 48, 's'], [0, 54, 18, 6, 's'], [5, 6, 2, 48, 'm']] }, // Columna de piedra
  crate: { w: 16, h: 16, s: [0.9, 8], r: () => [[0, 0, 16, 16, 'w'], [0, 0, 16, 2, 'W'], [0, 14, 16, 2, 'W'], [0, 0, 2, 16, 'W'], [14, 0, 2, 16, 'W'], [3, 7, 10, 2, 'W']] }, // Caja de madera
  barrel: { w: 14, h: 18, s: [0.9, 6], r: () => [[1, 0, 12, 18, 'w'], [0, 3, 14, 12, 'w'], [0, 4, 14, 2, 'S'], [0, 12, 14, 2, 'S'], [3, 0, 2, 18, 'W']] }, // Barril con aros
  bush: { w: 24, h: 16, s: [0.8, 6], sw: 1, r: () => [[2, 4, 20, 12, 'G'], [0, 8, 24, 8, 'G'], [6, 0, 12, 8, 'G'], [8, 2, 3, 2, 'o'], [15, 6, 3, 2, 'q']] }, // Arbusto con flores
  window: { w: 22, h: 30, bg: 1, g: ['#9ab8ff', 40], r: () => [[0, 0, 22, 30, 'W'], [2, 2, 18, 26, 'b'], [10, 2, 2, 26, 'W'], [2, 14, 18, 2, 'W'], [4, 4, 5, 8, 'm']] }, // Ventanal con luz de luna
  chandelier: { w: 30, h: 26, air: 1, f: 1, g: ['#ffd27a', 56], r: () => [[14, 0, 2, 8, 'k'], [4, 8, 22, 3, 'g'], [2, 10, 4, 4, 'g'], [24, 10, 4, 4, 'g'], [13, 12, 4, 6, 'g'], [5, 5, 2, 4, 'h'], [13, 5, 2, 4, 'h'], [23, 5, 2, 4, 'h'], [5, 3, 2, 2, 'o'], [13, 3, 2, 2, 'o'], [23, 3, 2, 2, 'o']] }, // Candelabro colgante
  rug: { w: 96, h: 48, fl: 1, r: () => [[0, 0, 96, 48, 'g'], [3, 3, 90, 42, 'r'], [8, 8, 80, 32, 'g'], [10, 10, 76, 28, 'r'], [40, 18, 16, 12, 'g']] }, // Alfombra
  runner: { w: 48, h: 300, fl: 1, r: () => [[0, 0, 48, 300, 'g'], [3, 0, 42, 300, 'r'], [7, 0, 2, 300, 'g'], [39, 0, 2, 300, 'g'], ...Array.from({ length: 7 }, (_, i) => [18, 18 + i * 40, 12, 12, 'g'])] }, // Camino de alfombra
  rune: { w: 56, h: 14, fl: 1, a: 0.85, r: () => { const o = []; for (let y = 0; y < 14; y++) { const h = Math.round(28 * Math.sqrt(1 - Math.pow((y - 6.5) / 7, 2))); o.push([28 - h, y, 2, 1, 'p'], [28 + h - 2, y, 2, 1, 'p']); if (y === 0 || y === 13) o.push([28 - h, y, h * 2, 1, 'p']); } o.push([24, 6, 8, 2, 'g']); return o; } } // Círculo rúnico
}; // Fin PROPS
export const FX = { // Presets de partículas ambientales (config de Phaser)
  steam: f => ({ x: { min: f.x, max: f.x + f.w }, y: f.y, lifespan: 2200, speedY: { min: -22, max: -10 }, speedX: { min: -6, max: 6 }, scale: { start: 1.6, end: 3.5 }, alpha: { start: 0.5, end: 0 }, frequency: 150, tint: f.c || 0xffffff }), // Vapor
  fireflies: f => ({ x: { min: f.x, max: f.x + f.w }, y: { min: f.y, max: f.y + f.h }, lifespan: 3500, speed: { min: 4, max: 12 }, angle: { min: 0, max: 360 }, alpha: { start: 0.9, end: 0 }, frequency: 300, tint: 0xe8ff7a, blendMode: 'ADD' }), // Luciérnagas
  motes: f => ({ x: { min: f.x, max: f.x + f.w }, y: { min: f.y, max: f.y + f.h }, lifespan: 4000, speed: { min: 3, max: 9 }, angle: { min: 0, max: 360 }, alpha: { start: 0.7, end: 0 }, frequency: 350, tint: f.c || 0xffd27a, blendMode: 'ADD' }), // Motas de luz/polvo mágico
  embers: f => ({ x: { min: f.x, max: f.x + f.w }, y: f.y, lifespan: 1500, speedY: { min: -30, max: -12 }, speedX: { min: -8, max: 8 }, alpha: { start: 1, end: 0 }, frequency: 120, tint: 0xff9a40, blendMode: 'ADD' }), // Brasas
  leaves: f => ({ x: { min: f.x, max: f.x + f.w }, y: { min: f.y, max: f.y + f.h }, lifespan: 6000, speedX: { min: 10, max: 25 }, speedY: { min: 8, max: 16 }, alpha: { start: 0.9, end: 0 }, frequency: 600, tint: 0xc08a30 }) // Hojas
}; // Fin FX
function tile(scene, key, base, fn, seed) { // Textura de suelo/muro 32x32 con ruido y patrón
  const c = scene.textures.createCanvas(key, 32, 32), g = c.getContext(), r = rng(seed); // Lienzo, contexto y aleatorio
  g.fillStyle = base; g.fillRect(0, 0, 32, 32); // Color base
  for (let i = 0; i < 90; i++) { g.fillStyle = sh(base, (r() < 0.5 ? -1 : 1) * (8 + r() * 14)); g.fillRect((r() * 32) | 0, (r() * 32) | 0, 2, 2); } // Ruido de dos tonos
  fn(g, r, (d) => sh(base, d)); c.refresh(); // Patrón propio y subida a la textura
} // Fin tile
export function makeArt(scene) { // Genera todo el arte procedural (una sola vez)
  if (scene.textures.exists('cobble')) return; // Evita regenerar
  tile(scene, 'cobble', '#8a8478', (g, r, d) => { g.fillStyle = d(-40); [0, 16].forEach(y => g.fillRect(0, y, 32, 1)); g.fillRect(8, 0, 1, 16); g.fillRect(24, 16, 1, 16); }, 1); // Adoquín
  tile(scene, 'grass', '#4f8a3a', (g, r) => { ['#f4e04d', '#e8e8f8', '#f4e04d'].forEach(c => { g.fillStyle = c; g.fillRect((r() * 30) | 0, (r() * 30) | 0, 2, 2); }); }, 2); // Pasto con flores
  tile(scene, 'wood', '#8a5a30', (g, r, d) => { g.fillStyle = d(-45); [0, 8, 16, 24].forEach(y => g.fillRect(0, y, 32, 1)); g.fillRect(10, 0, 1, 8); g.fillRect(22, 8, 1, 8); g.fillRect(6, 16, 1, 8); g.fillRect(26, 24, 1, 8); }, 3); // Tablones
  tile(scene, 'flag', '#6e6a66', (g, r, d) => { g.fillStyle = d(-35); g.fillRect(0, 15, 32, 2); g.fillRect(15, 0, 2, 32); }, 4); // Losas
  tile(scene, 'brick', '#5a4a44', (g, r, d) => { g.fillStyle = d(-40); [0, 8, 16, 24].forEach((y, i) => { g.fillRect(0, y + 7, 32, 1); g.fillRect(i % 2 ? 8 : 16, y, 1, 8); g.fillRect(i % 2 ? 24 : 0, y, 1, 8); }); }, 5); // Muro de ladrillo
  tile(scene, 'dwall', '#3d2614', (g, r, d) => { g.fillStyle = d(-25); [0, 8, 16, 24].forEach(x => g.fillRect(x, 0, 1, 32)); }, 6); // Muro de madera oscura
  tile(scene, 'carpet', '#8f1d24', (g, r, d) => { g.fillStyle = '#e0b030'; g.fillRect(0, 0, 32, 2); g.fillRect(0, 30, 32, 2); g.fillRect(14, 14, 4, 4); g.fillRect(12, 16, 8, 0); g.fillStyle = d(-30); g.fillRect(0, 2, 32, 1); g.fillRect(0, 29, 32, 1); }, 8); // Alfombra roja con detalles dorados (Gryffindor)
  tile(scene, 'hedge', '#244a22', (g, r, d) => { g.fillStyle = d(30); for (let i = 0; i < 14; i++) g.fillRect((r() * 30) | 0, (r() * 30) | 0, 3, 2); }, 7); // Seto/arboleda
  const dot = scene.textures.createCanvas('dot', 4, 4), d = dot.getContext(); d.fillStyle = '#fff'; d.fillRect(1, 0, 2, 4); d.fillRect(0, 1, 4, 2); dot.refresh(); // Punto de partícula
  const gl = scene.textures.createCanvas('glow', 64, 64), q = gl.getContext(), gr = q.createRadialGradient(32, 32, 0, 32, 32, 32); // Textura de luz radial
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = gr; q.fillRect(0, 0, 64, 64); gl.refresh(); // Degradado
  const mk = (key, w, h, fn) => { const c = scene.textures.createCanvas(key, w, h); fn(c.getContext('2d')); c.refresh(); }; // Crea una textura pequeña con una función de dibujo
  mk('sh', 32, 8, g => { const r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, 'rgba(0,0,0,1)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.scale(1, 0.25); g.fillStyle = r; g.fillRect(0, 0, 32, 32); }); // Sombra de contacto elíptica
  mk('vig', 480, 270, g => { const r = g.createRadialGradient(240, 135, 100, 240, 135, 300); r.addColorStop(0, 'rgba(0,0,0,0)'); r.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = r; g.fillRect(0, 0, 480, 270); }); // Viñeta de cámara
  mk('d_tuft', 8, 6, g => { g.fillStyle = '#2f6a28'; [[1, 2, 1, 4], [3, 0, 1, 6], [5, 1, 1, 5], [7, 3, 1, 3]].forEach(a => g.fillRect(...a)); g.fillStyle = '#7ab85a'; g.fillRect(3, 0, 1, 2); g.fillRect(5, 1, 1, 1); }); // Mata de pasto
  mk('d_pebble', 6, 4, g => { g.fillStyle = '#6a665e'; g.fillRect(0, 1, 4, 3); g.fillStyle = '#7a756c'; g.fillRect(4, 0, 2, 2); g.fillStyle = '#9a958a'; g.fillRect(1, 1, 2, 1); }); // Piedrecitas
  mk('d_crack', 12, 8, g => { g.fillStyle = '#3a352f'; [[0, 3, 3, 1], [3, 4, 3, 1], [6, 3, 2, 1], [8, 2, 2, 1], [10, 1, 2, 1], [5, 5, 1, 2]].forEach(a => g.fillRect(...a)); }); // Grieta
  mk('d_moss', 10, 6, g => { g.fillStyle = '#3f6a2c'; g.fillRect(1, 2, 8, 3); g.fillRect(3, 1, 4, 1); g.fillStyle = '#6c9a48'; g.fillRect(3, 2, 2, 1); g.fillRect(6, 3, 2, 1); }); // Musgo
  mk('d_puddle', 14, 8, g => { g.fillStyle = 'rgba(60,100,140,0.55)'; g.fillRect(3, 0, 8, 1); g.fillRect(1, 1, 12, 6); g.fillRect(3, 7, 8, 1); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(4, 2, 3, 1); }); // Charco
  mk('d_paper', 8, 6, g => { g.fillStyle = '#efe6cc'; g.fillRect(0, 0, 8, 6); g.fillStyle = '#8a7a5a'; g.fillRect(1, 2, 5, 1); g.fillRect(1, 4, 4, 1); }); // Pergamino suelto
  mk('d_petal', 4, 4, g => { g.fillStyle = '#f0a0c0'; g.fillRect(1, 0, 2, 4); g.fillRect(0, 1, 4, 2); g.fillStyle = '#fff'; g.fillRect(1, 1, 1, 1); }); // Pétalo
  Object.entries(PROPS).forEach(([k, p]) => { // Pinta cada prop con contorno, luz arriba y sombra abajo/derecha
    const c = scene.textures.createCanvas('p_' + k, p.w + 2, p.h + 2), g = c.getContext(), R = p.r(); // Lienzo con 1 px de margen para el contorno
    if (!p.fl) { g.fillStyle = '#14101a'; R.forEach(([x, y, w, h]) => g.fillRect(x, y, w + 2, h + 2)); } // Contorno oscuro (no en alfombras)
    R.forEach(([x, y, w, h, col]) => { const b = C[col]; g.fillStyle = b; g.fillRect(x + 1, y + 1, w, h); if (h > 3 && w > 2) { g.fillStyle = sh(b, 28); g.fillRect(x + 1, y + 1, w, 1); g.fillStyle = sh(b, -30); g.fillRect(x + 1, y + h, w, 1); if (h > 6 && w > 4) { g.fillStyle = sh(b, -16); g.fillRect(x + w, y + 1, 1, h - 1); } } }); // Relleno + realce + sombras
    c.refresh(); // Sube el prop
  }); // Fin props
  const f = scene.textures.createCanvas('castle_far', 800, 90), g = f.getContext(), sk = g.createLinearGradient(0, 0, 0, 90); // Fondo lejano del Capítulo 2
  sk.addColorStop(0, '#3a4a7a'); sk.addColorStop(1, '#f0a870'); g.fillStyle = sk; g.fillRect(0, 0, 800, 90); // Cielo al atardecer
  g.fillStyle = '#4a5a7a'; g.beginPath(); g.moveTo(0, 90); [[0, 60], [80, 35], [160, 58], [260, 28], [360, 56], [460, 38], [560, 60], [680, 30], [800, 55]].forEach(p => g.lineTo(p[0], p[1])); g.lineTo(800, 90); g.fill(); // Montañas
  g.fillStyle = '#262a42'; [[560, 42, 70, 48], [546, 24, 14, 66], [630, 20, 14, 70], [578, 14, 16, 30], [600, 30, 22, 14]].forEach(a => g.fillRect(...a)); // Muros y torres del castillo
  [[553, 14], [637, 10], [583, 4]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x - 6, y + 10); g.lineTo(x + 6, y + 10); g.lineTo(x, y - 8); g.fill(); }); // Techos puntiagudos
  g.fillStyle = '#ffd27a'; [[586, 52], [602, 58], [550, 40], [634, 36], [582, 22]].forEach(([x, y]) => g.fillRect(x, y, 3, 5)); // Ventanas encendidas
  f.refresh(); // Sube el fondo
} // Fin makeArt
