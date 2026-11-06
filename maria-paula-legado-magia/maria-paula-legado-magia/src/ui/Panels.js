import { txt, panel } from './UiKit.js'; // Estilo común
import { GameState } from '../core/GameState.js'; // Estado
import { ITEMS, TYPES } from '../data/items.js'; // Objetos
import { QUESTS } from '../data/quests.js'; // Misiones

const NODES = { Ch1_Station: [60, 150, 'Estación'], Ch2_Path: [140, 150, 'Camino'], Ch3_Castle: [240, 150, 'Castillo'], Ch4_Library: [340, 150, 'Biblioteca'], Ch5_Potions: [240, 215, 'Pociones'], Ch6_GreatHall: [240, 85, 'Gran Comedor'], Ch7_Gryffindor: [340, 85, 'Gryffindor'] }; // Posición de cada zona en el mapa
const LINKS = [['Ch1_Station', 'Ch2_Path'], ['Ch2_Path', 'Ch3_Castle'], ['Ch3_Castle', 'Ch4_Library'], ['Ch3_Castle', 'Ch5_Potions'], ['Ch3_Castle', 'Ch6_GreatHall'], ['Ch6_GreatHall', 'Ch7_Gryffindor']]; // Caminos entre zonas

export class Panels { // Inventario, registro de misiones y mapa
  constructor(scene) { this.s = scene; this.open = null; this.c = scene.add.container(0, 0).setScrollFactor(0).setDepth(4100).setVisible(false); } // Contenedor oculto
  show(kind) { // Abre un panel
    this.close(); const s = this.s, c = this.c; this.open = kind; c.setVisible(true); // Reinicia y muestra
    panel(s, c, 20, 14, 440, 240).setInteractive().on('pointerdown', () => this.close()); // Fondo (tocar cierra)
    c.add(txt(s, 32, 20, { inv: 'Inventario', quests: 'Registro de misiones', map: 'Mapa de exploración' }[kind], { fontSize: '14px', fontStyle: 'bold', color: '#7a1f2a' })); // Título
    c.add(txt(s, 32, 238, 'Pulsa la misma tecla o toca para cerrar', { fontSize: '9px' })); // Ayuda
    const L = kind === 'inv' ? this.inv() : kind === 'quests' ? this.quests() : null; // Líneas según el panel
    if (L) { const h = Math.ceil(L.length / 2); [L.slice(0, h), L.slice(h)].forEach((col, i) => c.add(txt(s, 32 + i * 215, 42, col.join('\n'), { fontSize: '10px', wordWrap: { width: 205 }, lineSpacing: 2 }))); } else this.map(); // Dos columnas o mapa
  } // Fin show
  close() { this.open = null; this.c.setVisible(false); this.c.removeAll(true); } // Cierra y limpia
  inv() { // Inventario agrupado por tipo
    const out = []; Object.entries(TYPES).forEach(([t, name]) => { const ids = GameState.data.inventory.filter(i => ITEMS[i] && ITEMS[i].type === t); if (ids.length) { out.push('◆ ' + name); ids.forEach(i => out.push('   ' + ITEMS[i].name)); } }); // Encabezado y objetos
    return out.length ? out : ['Aún no llevas nada contigo.']; // Vacío
  } // Fin inv
  quests() { // Misiones iniciadas
    const out = []; Object.entries(QUESTS).forEach(([id, q]) => { const st = GameState.data.quests[id]; if (!st) return; const done = st.status === 'done'; out.push((done ? '✔ ' : '• ') + q.name, '   ' + q.objective, '   Progreso: ' + st.progress + '/' + q.goal + (done ? '' : '  ·  Premio: ' + q.reward.text), ''); }); // Cuatro líneas por misión
    return out.length ? out : ['Todavía no tienes misiones.']; // Vacío
  } // Fin quests
  map() { // Mapa esquemático de zonas descubiertas
    const s = this.s, c = this.c, g = s.add.graphics(), found = GameState.data.discoveredZones; c.add(g); // Gráficos
    g.lineStyle(3, 0x8a5a24); LINKS.forEach(([a, b]) => { if (found.includes(a) && found.includes(b)) g.lineBetween(NODES[a][0] + 40, NODES[a][1] + 12, NODES[b][0] + 40, NODES[b][1] + 12); }); // Caminos conocidos
    Object.entries(NODES).forEach(([k, [x, y, n]]) => { const ok = found.includes(k), here = s.scene.key === k; g.fillStyle(ok ? 0xe0b030 : 0xc9bfa5).fillRect(x, y, 80, 24).lineStyle(2, here ? 0xa8232b : 0x8a5a24).strokeRect(x, y, 80, 24); c.add(txt(s, x + 40, y + 12, ok ? n : '?', { fontSize: '10px' }).setOrigin(0.5)); if (here) c.add(txt(s, x + 40, y - 8, '▼ Estás aquí', { fontSize: '9px', color: '#a8232b' }).setOrigin(0.5)); }); // Zonas y marcador
  } // Fin map
} // Fin Panels
