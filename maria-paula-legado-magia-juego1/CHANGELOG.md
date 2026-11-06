# CHANGELOG.md

## v2.0 — 2026-11-06 · Iteración de arquitectura y enriquecimiento
### Added
- Arquitectura modular: proyecto dividido en /src (/core, /systems, /characters, /scenes),
  /data, /assets y /css, manteniendo compatibilidad file:// (scripts clásicos).
- data/config.js como única fuente editable de textos narrativos.
- enrichment.js: sistema extendBuilder para ampliar capítulos sin tocar su código.
- Nuevos personajes: boletero, vagonero y lechuza (Cap.1); estudiante perdido (Cap.2);
  retrato cotilla (Cap.3); estudiante dormido y escalera rodante (Cap.4); asistente (Cap.5);
  estudiantes paseantes (Cap.6); compañera deambulante (Cap.7). NPCs con patrullas (wanderNPC).
- Nuevos props: setas luminosas, alfombras, plantas, candelabros, banderines de casas,
  guirnaldas, espejo encantado, escalera rodante, más libros flotantes.
- Secretos coleccionables: Billete dorado (Cap.1), Perla del lago y Luz de luciérnagas (Cap.2),
  Guantelete sonriente (Cap.3), Mapa del Merodeador (Cap.4), Poción de la risa (Cap.5),
  Snitch dorada que vuela (Cap.6), Chocolate eterno, Pluma de lechuza, espejo y chimenea
  que habla (Cap.7).
- assets/poster.png (menú y OpenGraph) y assets/favicon.png generados.
- Documentación: PROJECT_ARCHITECTURE.md y CHANGELOG.md.

### Changed
- index.html reduce de ~91 KB a ~4.8 KB (solo estructura y carga de módulos).

### Fixed
- Recuperado el bloque de interacción (scanInteract/doInteract/resolveColliders)
  detectado como omitido durante la división automática.
