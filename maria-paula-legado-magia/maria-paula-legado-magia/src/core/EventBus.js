export const EventBus = new Phaser.Events.EventEmitter(); // Bus global: desacopla escenas, UI y sistemas
export const EVENTS = { // Catálogo único de nombres de evento (evita errores de tipeo)
  STATE_CHANGED: 'state:changed', // GameState notifica cualquier cambio
  SCENE_CHANGE: 'scene:change', // Solicita transición de capítulo
  QUEST_UPDATED: 'quest:updated', // Una misión cambió de estado o progreso
  ITEM_ADDED: 'inventory:added', // Se agregó un objeto al inventario
  DIALOGUE_START: 'dialogue:start', // Comienza un diálogo
  DIALOGUE_END: 'dialogue:end', // Termina un diálogo
  GAME_SAVED: 'save:done' // Guardado completado
}; // Fin de EVENTS
