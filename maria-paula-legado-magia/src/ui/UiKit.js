export const txt = (s, x, y, t, o = {}) => s.add.text(x, y, t, { fontFamily: 'Georgia, serif', fontSize: '11px', color: '#3b2a14', resolution: 2, ...o }); // Texto nítido con el estilo del juego
export const panel = (s, c, x, y, w, h) => { // Panel de pergamino claro con borde marrón y filete dorado
  const a = s.add.rectangle(x, y, w, h, 0xf3e6c4).setOrigin(0).setStrokeStyle(2, 0x8a5a24); // Fondo y borde
  c.add([a, s.add.rectangle(x + 3, y + 3, w - 6, h - 6).setOrigin(0).setStrokeStyle(1, 0xe0b030)]); return a; // Filete interior
}; // Fin panel
