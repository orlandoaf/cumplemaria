import { SAVE_KEY } from './Config.js'; // Clave de almacenamiento
import { GameState } from './GameState.js'; // Estado a guardar o restaurar
import { EventBus, EVENTS } from './EventBus.js'; // Para avisar del guardado

export const SaveManager = { // Módulo de persistencia con manejo de errores
  hasSave() { // Indica si existe una partida válida
    try { return !!localStorage.getItem(SAVE_KEY); } // Lee la clave
    catch (e) { console.warn('[Save] lectura bloqueada:', e); return false; } // Modo privado o permisos
  }, // Fin hasSave
  save() { // Guarda el estado actual
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(GameState.data)); EventBus.emit(EVENTS.GAME_SAVED); return true; } // Serializa y avisa
    catch (e) { console.warn('[Save] escritura fallida:', e); return false; } // Cuota llena o bloqueo
  }, // Fin save
  load() { // Restaura el estado guardado
    try { const raw = localStorage.getItem(SAVE_KEY); if (!raw) return false; const d = JSON.parse(raw); if (!d || typeof d !== 'object' || Array.isArray(d) || d.version !== 1) return false; GameState.load(d); return true; } // Parsea y aplica
    catch (e) { console.warn('[Save] guardado corrupto:', e); return false; } // JSON inválido
  }, // Fin load
  clear() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { console.warn('[Save] borrado fallido:', e); } } // Elimina el guardado
}; // Fin SaveManager
