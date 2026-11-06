import { createCanvas } from 'canvas'; import fs from 'fs'; // Vista previa offline del arte (no es el juego en vivo)
const store = {}; const scene = { anims: { create() {} }, textures: { exists: k => !!store[k], createCanvas: (k, w, h) => { const c = createCanvas(w, h); store[k] = c; return { getContext: () => c.getContext('2d'), refresh() {}, add() {} }; } } }; // Escena simulada
const { makeArt, PROPS } = await import('../src/utils/ArtKit.js'); const { MAPS } = await import('../src/data/maps.js'); const { makeTextures } = await import('../src/utils/SpriteFactory.js'); // Módulos reales
makeArt(scene); makeTextures(scene); // Genera texturas con el mismo código del juego
const rg = s => () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; // Aleatorio determinista (igual que ArtKit)
const render = key => { const m = MAPS[key], c = createCanvas(m.w, m.h), g = c.getContext('2d'); g.imageSmoothingEnabled = false; // Lienzo del mapa
  const fill = (tex, x, y, w, h) => { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); for (let yy = y - (y % 32); yy < y + h; yy += 32) for (let xx = x - (x % 32); xx < x + w; xx += 32) g.drawImage(store[tex], xx, yy); g.restore(); }; // Rellena con textura
  fill(m.ground, 0, 0, m.w, m.h); if (m.sky) g.drawImage(store.castle_far, 0, 0); // Suelo y cielo
  if (store.d_tuft) (m.decals || []).forEach(([k, n], j) => { const r = rg(j + 11); for (let i = 0; i < n; i++) g.drawImage(store['d_' + k], 30 + r() * (m.w - 60), 40 + r() * (m.h - 80)); }); // Detalles de suelo
  m.walls.filter(r => !r.hide).forEach(r => fill(m.wall, r.x, r.y, r.w, r.h)); // Muros
  [...m.decor].sort((a, b) => (PROPS[a[0]].fl ? -2e3 : PROPS[a[0]].bg ? -1e3 : a[2]) - (PROPS[b[0]].fl ? -2e3 : PROPS[b[0]].bg ? -1e3 : b[2])).forEach(([k, x, y]) => { const p = PROPS[k]; if (store['sh']) { g.globalAlpha = 0.35; if (!p.bg && !p.fl && !p.f) g.drawImage(store.sh, x - p.w * 0.45, y - 4, p.w * 0.9, 8); g.globalAlpha = 1; } if (p.g) { const gr = g.createRadialGradient(x, y - p.h * 0.6, 0, x, y - p.h * 0.6, p.g[1]); gr.addColorStop(0, p.g[0] + 'aa'); gr.addColorStop(1, p.g[0] + '00'); g.fillStyle = gr; g.fillRect(x - p.g[1], y - p.h * 0.6 - p.g[1], p.g[1] * 2, p.g[1] * 2); } g.drawImage(store['p_' + k], x - p.w / 2 - 1, y - p.h - 1); }); // Props con sombra y luz
  g.fillStyle = m.ambient[0] + Math.round(m.ambient[1] * 255).toString(16).padStart(2, '0'); g.fillRect(0, 0, m.w, m.h); // Atmósfera
  if (store.vig) { g.globalAlpha = 0.9; g.drawImage(store.vig, 0, 0, m.w, m.h); g.globalAlpha = 1; } return c; }; // Viñeta
const keys = (process.argv[2] || 'Ch1_Station,Ch5_Potions,Ch6_GreatHall').split(','), cs = keys.map(render), out = createCanvas(1600, 900), o = out.getContext('2d'); o.fillStyle = '#fff'; o.fillRect(0, 0, 1600, 900); // Composición
const pos = [[0, 0], [810, 0], [0, 450], [810, 450]]; cs.forEach((c, i) => { const s = Math.min(790 / c.width, 430 / c.height); o.drawImage(c, pos[i][0], pos[i][1], c.width * s, c.height * s); }); // Dibuja cada mapa
const pl = store.player; if (pl) { o.imageSmoothingEnabled = false; o.drawImage(pl, 830, 470, 64 * 6, 96 * 6); } // Hoja del jugador ampliada x6 (4 filas: abajo, izq, der, arriba)
fs.writeFileSync(process.argv[3] || '/tmp/audit.png', out.toBuffer('image/png')); // Guarda la imagen
