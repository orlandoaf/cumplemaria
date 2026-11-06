import { GameState } from '../core/GameState.js'; // Estado único
import { EventBus, EVENTS } from '../core/EventBus.js'; // Avisos
import { QUESTS } from '../data/quests.js'; // Registro de misiones
import { Inventory } from './Inventory.js'; // Recompensas

export const Quests = { // Misiones: estado, progreso y recompensa (lógica pura, probada en Node)
  state(id) { return GameState.data.quests[id] || null; }, // Estado guardado de una misión
  start(id) { if (!QUESTS[id] || this.state(id)) return false; GameState.data.quests[id] = { status: 'active', progress: 0 }; EventBus.emit(EVENTS.QUEST_UPDATED, id); return true; }, // Inicia si no existía
  progress(id, n = 1) { const q = this.state(id); if (!q || q.status !== 'active') return false; q.progress = Math.min(QUESTS[id].goal, q.progress + n); EventBus.emit(EVENTS.QUEST_UPDATED, id); return q.progress >= QUESTS[id].goal; }, // Avanza; true si llegó a la meta
  complete(id) { const q = this.state(id); if (!q || q.status === 'done') return []; q.status = 'done'; q.progress = QUESTS[id].goal; const got = QUESTS[id].reward.items.filter(i => Inventory.add(i)); EventBus.emit(EVENTS.QUEST_UPDATED, id); return got; }, // Cierra y entrega recompensa
  isDone(id) { const q = this.state(id); return !!q && q.status === 'done'; }, // ¿Completada?
  current() { const ids = Object.keys(QUESTS).filter(i => this.state(i) && this.state(i).status === 'active'); return ids.length ? ids[ids.length - 1] : null; }, // Misión activa más reciente (para el HUD)
  check(req) { if (!req) return true; const [t, k] = req.split(':'); return t === 'q' ? this.isDone(k) : !!GameState.data.flags[k]; } // Requisito 'q:id' o 'f:bandera'
}; // Fin Quests
