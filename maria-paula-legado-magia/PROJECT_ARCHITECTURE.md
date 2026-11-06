# PROJECT_ARCHITECTURE — María Paula: El Legado de la Magia

## 1. Arquitectura general
RPG 2D top-down, Phaser 3.80.1 (local en `vendor/`), JS con módulos ES nativos, sin bundler. Resolución lógica 480x270, escalado FIT, `pixelArt` activo, física Arcade sin gravedad.
Flujo: `index.html` → `main.js` → `Boot` → `Menu` → capítulos 1–7 (Fase 2–3). Comunicación entre módulos solo por `EventBus` y estado solo en `GameState`.

## 2. Dependencias
| Dependencia | Versión | Uso | Licencia |
|---|---|---|---|
| Phaser | 3.80.1 | Motor (render, input, física, audio, escenas) | MIT (`vendor/PHASER_LICENSE.md`) |
| Node (solo desarrollo) | ≥18 | `tests/check.mjs` (sintaxis) | — |
| Audio/arte | Por definir | Originales, generados por código o libre uso (Fase 3) | Documentar cada recurso aquí |
Para ejecutar: servir la carpeta por HTTP (`python3 -m http.server 8000`); los módulos ES no cargan con `file://`.

## 3. Módulos (estado Fase 1)
- `src/core/Config.js` ajustes del motor, claves de escena, registro de 7 capítulos. HECHO
- `src/core/EventBus.js` bus de eventos y catálogo `EVENTS`. HECHO
- `src/core/GameState.js` única fuente de verdad. HECHO
- `src/core/SaveManager.js` localStorage con try/catch. HECHO
- `src/scenes/BootScene.js`, `MenuScene.js` (Nueva partida, Continuar). HECHO
- `src/utils/Movement.js` velocidad normalizada y orientación (puras, con pruebas). HECHO (Fase 2)
- `src/utils/SpriteFactory.js` texturas y animaciones provisionales generadas por código. HECHO, ARTE PROVISIONAL (definitivo en Fase 3)
- `src/systems/InputManager.js` WASD/flechas, SHIFT, E, ESPACIO, joystick virtual y botones E/RUN en móvil. HECHO
- `src/characters/Player.js` María Paula: 4 direcciones, caminar, correr, reposo, colisión en pies. HECHO (faltan interacción, celebración, sorpresa y descanso animados)
- `src/scenes/BaseWorldScene.js` mapa genérico: suelo, muros, cámara, portales, zonas interactuables, diálogo provisional, autoguardado. HECHO
- `src/scenes/ChapterScenes.js` Ch1_Station y Ch2_Path conectados por portales. HECHO (mapas base)
- `src/data/maps.js` datos de mapas. HECHO
- `src/utils/ArtKit.js` (Fase 3) arte procedural: 9 texturas de suelo/muro con ruido, 26 props con luz/sombra, textura de luz, partículas (vapor, luciérnagas, motas, brasas, hojas) y cielo con castillo. HECHO
- `src/data/maps.js` ahora define los 7 capítulos (muros y portales se generan desde `exits`; decorado desde `decor`). HECHO
- `BaseWorldScene.buildDecor` props con colisión, luces parpadeantes, flotación, partículas y atmósfera. HECHO
- Auditoría artística (0.3.1): contorno automático y sombreado de props, sombras de contacto, viñeta de cámara, 7 detalles de suelo repartidos (`decals`), 9 props nuevos (columna, caja, barril, arbusto, ventanal, candelabro, alfombra, camino de alfombra, círculo rúnico), sprite de María Paula rehecho (contorno, brazos, bufanda con cola, zancada, 4 vistas, respiración en reposo), balanceo de árboles/arbustos, parpadeo y pulso de luces, destellos sobre el lago.
- Conexiones: Ch1↔Ch2↔Ch3; Ch3↔Ch4, Ch3↔Ch5, Ch3↔Ch6; Ch6↔Ch7 (todas abiertas; el bloqueo por misiones es Fase 4-5).
- Carpetas vacías: `ui`, `assets/*`.

## 4. Variables de estado (`GameState.data`)
scene, position, chapter, quests, inventory, discoveredZones, flags, giftsOpened, photoTaken, freeRoam, house.

## 5. Plan técnico: cobertura del prompt maestro (nada omitido)
| Sección del prompt | Funcionalidad | Fase | Módulo previsto |
|---|---|---|---|
| 3 Arte | Pixel art premium, luces, partículas, vegetación animada, transiciones | 3 | `assets/*`, `systems/Lighting`, `systems/Particles` |
| 4 Protagonista | Sprite, 4 direcciones, caminar, correr, interactuar, celebrar, sorpresa, descanso, detalles Gryffindor | 2–3 | `characters/Player` |
| 5 Cap.1 Carta y tren | Animación de carta, estación, guía, objeto perdido | 3–5 | `scenes/Ch1_Station` |
| 5 Cap.2 Camino | 3 objetos mágicos, acertijo, zonas ocultas | 3–4 | `scenes/Ch2_Path` |
| 5 Cap.3 Castillo | Zonas conectadas, cuadros con diálogo, escaleras mágicas, buscar Gran Comedor | 3–4 | `scenes/Ch3_Castle` |
| 5 Cap.4 Biblioteca | 3 libros antiguos, acertijo real, coleccionables, zonas secretas | 3–4 | `scenes/Ch4_Library` |
| 5 Cap.5 Pociones | Minijuego de ingredientes y secuencia con resultado variable | 4 | `systems/PotionGame` |
| 5 Cap.6 Gran Comedor | Cinemática, discurso, Gryffindor obligatorio, destellos, aplausos, emblema | 5 | `scenes/Ch6_GreatHall`, `systems/Cinematics` |
| 6 Cap.7 Sorpresa | Secuencia de 11 pasos, cartel animado, 6 amigos únicos + extras, diálogos en config | 6 | `scenes/Ch7_Gryffindor`, `data/dialogues.js` |
| 7 Regalos | 5 tipos, brillo, ventana animada | 6 | `systems/Gifts` |
| 8 Pastel | Velas, fuego, escena del deseo | 6 | `systems/Cake` |
| 9 Fotografía | Cuenta de 3 s, captura real del canvas, PNG descargable | 6 | `systems/PhotoBooth` |
| 10 Carta final | Papel envejecido, sello de cera, reconsulta desde inventario | 6 | `ui/LetterView` |
| 11 Exploración libre | Modo post-final con diálogos extra y secretos | 6–7 | `GameState.freeRoam` |
| 12 Sistema RPG | Movimiento, interacciones, misiones, inventario, mapa, guardado | 2–4 | `systems/*`, `ui/*` |
| 13 Controles | WASD/flechas, E, ESPACIO, SHIFT, M, I, J, ESC, joystick virtual móvil | 2 | `systems/Input` |
| 14 Audio | Música por escenario, efectos, volumen y silencio, solo recursos libres u originales | 3–6 | `systems/AudioManager` |
| 15 UI | Menú (Nueva, Continuar, Controles, Créditos), HUD, pausa, diálogos | 2–4 | `ui/*` |
| 17–20 Calidad | Comentarios por línea, pruebas, PROJECT_ARCHITECTURE y CHANGELOG | Todas | `tests/` |

## 6. Decisiones técnicas
- Sin emojis ni rectángulos como sprites: el arte se generará en Fase 3 con sprites propios (pixel art generado por código en Canvas hacia spritesheets, o recursos de libre uso con licencia registrada).
- Diálogos y misiones en `src/data/` separados de la lógica; textos del prompt (discurso, cartas, diálogos de amigos) se copian literalmente.
- Fotografía: `renderer.snapshot` / `game.canvas.toDataURL` sobre la escena real.

## 7. Funcionalidades pendientes
Hecho: Fases 1–3 (motor, movimiento, 7 mapas explorables con arte procedural). Pendiente de ARTE: tras la auditoría 0.3.1 el arte procedural es coherente pero sigue siendo intermedio, NO el pixel art premium del prompt (los círculos rúnicos de Pociones se ven tenues; los suelos aún tienen áreas amplias vacías). Falta puente de piedra y criaturas (Cap. 2), cuadros y libros con animación propia, sprites distintos para NPC y amigos, y las animaciones interactuar/celebrar/sorpresa/descanso. Opción recomendada: reemplazar `ArtKit` por hojas de sprites de libre uso o dibujadas a mano manteniendo `PROPS`/`maps.js`. Pendiente de sistemas: teclas M/I/J/ESC, misiones, inventario, acertijos, minijuego, diálogo real, audio, ceremonia, sorpresa, regalos, pastel, fotografía, carta, exploración libre, Controles/Créditos.

## 8. Errores conocidos
Ninguno abierto. Auditoría 0.2.1: ver CHANGELOG. Pruebas: `npm install` y `npm test` (sintaxis, integración, y ejecución real de Phaser 3.80.1 en jsdom: arranque, colisión, diálogo, portal, guardado, Continuar, guardado inválido).
Limitaciones: el render gráfico (WebGL/Canvas), el joystick táctil real y el aspecto visual NO se probaron; hay que verlos en un navegador. Phaser corre en modo HEADLESS en las pruebas.
