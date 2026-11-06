import { EventBus, EVENTS } from './EventBus.js'; // Para avisar cambios a la UI y sistemas

const initialState = () => ({ // Fábrica del estado inicial (evita compartir referencias entre partidas)
  version: 1, // Versión del esquema, útil para migrar guardados
  scene: null, // Clave del escenario actual
  position: { x: 0, y: 0 }, // Posición del personaje
  chapter: 0, // Capítulo en curso (0 = aún no empieza)
  quests: {}, // Misiones por id: { status, progress }
  inventory: [], // Objetos: mágicos, libros, ingredientes, regalos, cartas, recuerdos
  discoveredZones: [], // Zonas visibles en el mapa
  flags: {}, // Eventos narrativos y conversaciones importantes
  giftsOpened: [], // Ids de regalos abiertos
  photoTaken: false, // Si ya se generó la fotografía grupal
  freeRoam: false, // Se activa tras la celebración
  house: null // Casa asignada (será 'Gryffindor' por obligación narrativa)
}); // Fin de initialState

class GameStateClass { // Única fuente de verdad del estado del juego (regla 7 del prompt)
  constructor() { this.data = initialState(); } // Arranca con estado limpio
  reset() { this.data = initialState(); EventBus.emit(EVENTS.STATE_CHANGED, this.data); } // Nueva partida
  load(saved) { this.data = { ...initialState(), ...saved }; EventBus.emit(EVENTS.STATE_CHANGED, this.data); } // Carga fusionando campos nuevos
  set(key, value) { this.data[key] = value; EventBus.emit(EVENTS.STATE_CHANGED, this.data); } // Cambia un campo y notifica
  setFlag(name, value = true) { this.data.flags[name] = value; EventBus.emit(EVENTS.STATE_CHANGED, this.data); } // Marca un evento narrativo
  hasFlag(name) { return !!this.data.flags[name]; } // Consulta un evento narrativo
} // Fin de la clase

export const GameState = new GameStateClass(); // Instancia única exportada (singleton de módulo)
