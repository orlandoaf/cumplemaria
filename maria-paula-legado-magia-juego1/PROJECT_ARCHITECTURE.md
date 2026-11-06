# PROJECT_ARCHITECTURE.md — MARÍA PAULA: EL LEGADO DE LA MAGIA

## Visión general
RPG 3D para navegador (Three.js r150, WebAudio, Canvas 2D). Estética pixel-art premium
cálida: personajes chibi low-poly con túnicas y sombreros de colores, piedra medieval,
ventanales góticos, velas, globos y luz dorada (inspirado en la imagen de referencia
de la fiesta de cumpleaños en el Gran Comedor).

## Estructura de carpetas
```
/                      index.html · README.md · PROJECT_ARCHITECTURE.md · CHANGELOG.md
/assets               poster.png (menú/OG) · favicon.png   — recursos generados
/css                  style.css                            — toda la interfaz
/data                 config.js                            — ÚNICA fuente de textos:
                                                             cartas, discurso del Sombrero,
                                                             diálogos de amigos, regalos
/src
  /core               engine.js (renderer, helpers, FX, Área, glowTexture)
                      director.js (goChapter, Builders, extendBuilder)
  /systems            ui.js (HUD, diálogos, modal, carta, banner, paneles)
                      game.js (Game.flags, misiones, inventario, mapa)
  /characters         character.js (makeCharacter, animChar, Player, NPC,
                      scanInteract, resolveColliders, updatePlayer)
  /scenes             station.js (Cap.1) · path.js (Cap.2) · castle.js (Cap.3)
                      library.js (Cap.4) · potions.js (Cap.5) · greathall.js (Cap.6)
                      commonroom.js (Cap.7) · enrichment.js (props extra y secretos)
  /utils              (reservado)
```
Scripts clásicos (no ES modules) para que funcione con doble clic vía file://.
El orden de carga en index.html respeta las dependencias.

## Dependencias entre módulos
- config.js: sin dependencias.
- engine.js: THREE (CDN). Expone: renderer, scene, camera, M/box/cyl/put, textSprite,
  FX (burst/update), Area (clear/hemi/dir/point, colliders, interact, npcs, anim), glowTexture.
- ui.js: el(), toast, fade, showBanner, showLetter, showModal, closeModal, Dlg, paneles,
  AudioSys, Keys, Touch, Save. Llama a Game/checkPartyProgress en tiempo de ejecución.
- character.js: usa engine (Area, FX, textSprite) y ui (Dlg, el). Expone Player,
  makeNPC, talkNPC, scanInteract, doInteract, resolveColliders, updatePlayer.
- game.js: Game.flags (única fuente de verdad del estado), setMission/setLocation,
  markTalked, invAdd/invAddOnce, quest/questDone, renderQuests/Inventory/Map.
- director.js: Builders {}, goChapter(n), extendBuilder(n,fn).
- scenes/*: registran Builders[n] y definen la lógica narrativa de su capítulo.
- enrichment.js: decora Builders[1..7] con props, personajes y secretos.
- main.js: bucle, menús, arranque. Depende de todo lo anterior.

## Variables de estado (Game.flags)
intro, gryffindor, surprise, photo, letter, wish, free, chapter,
gifts[], inv[], talked[], quests{}, orbs, books, potion, runa.

## Eventos narrativos clave
- Carta de aceptación → Cap.1. Hablar con Elia → Cap.2.
- 3 orbes + runa (acertijo estatua) → Cap.3 → puerta Biblioteca → Cap.4.
- 3 libros + palabra clave "vela" → Cap.5.
- Minijuego de poción (orden exacto) → Cap.6.
- Interactuar con el Sombrero → discurso → ¡GRYFFINDOR! → Cap.7.
- Cruzar el centro de la sala → secuencia ¡SORPRESA! → fiesta libre.
- Foto grupal (cámara mágica): captura real del canvas → PNG descargable.

## Funcionalidades terminadas
Los 7 capítulos explorables, colisiones, cámara seguidora, correr, diálogos,
misiones, inventario, mapa, guardado automático (localStorage), audio generativo
por escenario, controles táctiles, ceremonia del Sombrero, sorpresa con los 6 amigos
con diálogos propios, 5 regalos, pastel con deseo, foto grupal PNG, carta final,
exploración libre, 8+ secretos coleccionables.

## Funcionalidades pendientes / mejoras futuras
- Sprites de animación por frames (hoy animación procedural por código).
- Más variedad de minijuegos y jefes de acertijo.
- Internacionalización.
- Tests automatizados con Puppeteer.

## Errores conocidos
- Los regalos ya abiertos conservan la tapa cerrada al recargar el capítulo
  (el estado se guarda; la animación de apertura no se reaplica).
- La música generativa es deliberadamente minimalista (WebAudio puro).
