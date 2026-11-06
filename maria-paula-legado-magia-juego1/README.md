# MARÍA PAULA: EL LEGADO DE LA MAGIA

Videojuego RPG 3D (Three.js) con estética pixel-art premium cálida inspirada en la imagen de
referencia: personajes chibi con túnicas y sombrarios de colores, piedra medieval, ventanales
góticos, velas, globos y luz dorada.

## Cómo jugar
1. Abre `index.html` en un navegador moderno (Chrome/Edge/Firefox). Requiere internet la
   primera vez (Three.js desde CDN). Funciona con doble clic, sin servidor.
2. Menú: **Nueva partida** o **Continuar** (guardado automático en el navegador).

## Controles
- WASD / Flechas: moverse · Shift: correr
- E: interactuar / avanzar diálogo · Espacio: avanzar diálogo
- I: inventario · J: misiones · M: mapa · ESC: pausa
- Móviles: joystick virtual + botones táctiles

## Contenido
- 7 capítulos explorables conectados con misiones, acertijos y minijuegos.
- Ceremonia del Sombrero con discurso completo y selección de Gryffindor.
- Sorpresa de cumpleaños: 6 amigos con diálogos únicos, 5 regalos, pastel con deseo,
  fotografía grupal descargable en PNG (capturada de la escena 3D real) y carta final.
- Exploración libre tras el final + 8 secretos coleccionables repartidos por los escenarios.

## Editar textos
Todos los diálogos y mensajes viven en `data/config.js` (INTRO_LETTER, SORTING_SPEECH,
FRIENDS, GIFTS, FINAL_LETTER). No hace falta tocar la lógica.

## Arquitectura
Ver `PROJECT_ARCHITECTURE.md`. Módulos en `/src`, textos en `/data`, recursos en `/assets`,
estilos en `/css`. Cada archivo está comentado línea a línea.

## Historial de cambios
Ver `CHANGELOG.md`.
