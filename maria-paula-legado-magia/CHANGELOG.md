# CHANGELOG
## [0.3.1] — Auditoría artística
- Hallazgos: sprite plano sin contorno ni brazos y con una pierna que desaparecía al caminar; props diminutos sin sombra; suelos vacíos; Gran Comedor frío y sin identidad; sin viñeta ni detalles de suelo.
- Mejorado (solo arte, sin cambiar lógica ni mapas funcionales): ArtKit (contorno y sombreado, sombras de contacto, viñeta, 7 decals, 9 props nuevos, farol/locomotora/mesa larga rediseñados), SpriteFactory (sprite del jugador rehecho + animación idle), Player (reproduce idle y sombra), BaseWorldScene.buildDecor (decals, sombras, balanceo, pulso de luces, viñeta), maps.js (más decorado por capítulo conservando su identidad; Gran Comedor con camino de alfombra roja y candelabros, Gryffindor con ventanales y alfombra dorada, Pociones con runas y barriles).
- Pruebas: 27 comprobaciones de ejecución (nueva: animación de reposo y sombra), integración ampliada (decals válidos). Sin errores de consola. 0 líneas ejecutables sin comentario.
## [0.3.0] — Fase 3: Arte y escenarios
- Añadido: ArtKit (texturas, 26 props, luces, partículas, cielo con castillo), los 7 capítulos como mapas explorables conectados, `buildDecor`, 5 escenas nuevas, tests/preview.mjs (vista previa PNG).
- Modificado sin quitar nada: maps.js (Ch1 y Ch2 migrados al nuevo formato conservando sus interactuables), BaseWorldScene (+buildDecor, muros por tema, muros ocultos), main.js, ChapterScenes.
- Pruebas: 26 comprobaciones de ejecución (los 7 capítulos cargan pobladas y sin errores), integración ampliada (props existentes, entradas libres de obstáculos, conexiones recíprocas).
- Límite conocido: el arte es procedural, no pixel art premium; ver PROJECT_ARCHITECTURE.md §7.
## [0.2.1] — Auditoría técnica
- Corregido: guardados válidos en JSON pero inválidos (`"abc"`, `null`, arreglo, otra versión) se cargaban como estado; ahora SaveManager valida el esquema y los rechaza.
- Corregido: Continuar con guardado corrupto dejaba el estado a medias; ahora reinicia limpio. Una escena guardada desconocida cae en el Capítulo 1 en vez de lanzar error.
- Corregido: pulsar el botón táctil E sin objeto cerca dejaba la pulsación pendiente y abría un diálogo al acercarse después.
- Corregido: el jugador se dibujaba detrás de los muros al pasar por su lado sur (profundidad medida desde el centro; ahora desde los pies).
- Corregido: escena y posición se escribían directo en `GameState.data`; ahora usan `GameState.set` (emite STATE_CHANGED) y no se autoguarda durante una transición.
- Añadido: package.json, tests/runtime.mjs (12 comprobaciones con Phaser real en jsdom) y casos de guardado inválido en integration.mjs.
- Verificado sin pérdidas: Fases 1 y 2 intactas (menú, GameState, SaveManager, movimiento, mapas, portales, diálogo, autoguardado). 293 líneas ejecutables, 0 sin comentario. Sin referencias rotas ni assets externos faltantes.
## [0.2.0] — Fase 2: Motor y movimiento
- Añadido: Player (4 direcciones, caminar, correr), InputManager (teclado + joystick/botones táctiles), BaseWorldScene (colisiones, cámara, portales, interactuables, diálogo provisional, autoguardado), mapas Ch1_Station y Ch2_Path conectados, Movement.js, SpriteFactory.js (arte provisional).
- Modificado sin quitar nada: Config.js (+PLAYER), main.js (+2 escenas), MenuScene (Nueva partida/Continuar ahora entran al mapa guardado o Capítulo 1).
- Pruebas: tests/integration.mjs (guardado, error de JSON corrupto, movimiento, mapas y portales). Regresión de Fase 1 verificada con tests/check.mjs.
## [0.1.0] — Fase 1: Arquitectura y estructura
- Estructura de carpetas según sección 16 del prompt, más `vendor/` y `tests/`.
- Phaser 3.80.1 instalado localmente y configurado (pixel art, escala FIT, física Arcade).
- Núcleo: Config, EventBus, GameState, SaveManager.
- Escenas Boot y Menu (Nueva partida, Continuar).
- Documentación: PROJECT_ARCHITECTURE.md con cobertura completa del prompt.
- Verificación: `node tests/check.mjs` pasa en todos los módulos.
