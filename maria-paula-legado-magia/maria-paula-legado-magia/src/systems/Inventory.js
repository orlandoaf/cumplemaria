import { GameState } from '../core/GameState.js'; // Estado único
import { EventBus, EVENTS } from '../core/EventBus.js'; // Avisos
import { ITEMS } from '../data/items.js'; // Catálogo

export const Inventory = { // Inventario sin duplicados (lógica pura, probada en Node)
  has(id) { return GameState.data.inventory.includes(id); }, // ¿Lo tiene?
  add(id) { if (!ITEMS[id]) throw new Error('Objeto desconocido: ' + id); if (this.has(id)) return false; GameState.data.inventory.push(id); EventBus.emit(EVENTS.ITEM_ADDED, id); return true; }, // Agrega una sola vez
  remove(id) { const i = GameState.data.inventory.indexOf(id); if (i < 0) return false; GameState.data.inventory.splice(i, 1); EventBus.emit(EVENTS.STATE_CHANGED, GameState.data); return true; }, // Quita un objeto entregado
  byType(type) { return GameState.data.inventory.filter(id => ITEMS[id] && ITEMS[id].type === type); } // Objetos de una categoría
}; // Fin Inventory
