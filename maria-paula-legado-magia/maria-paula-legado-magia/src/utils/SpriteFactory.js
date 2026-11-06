export function makeTextures(scene) { // Genera texturas por código (provisional; el arte definitivo es Fase 3)
  if (scene.textures.exists('player')) return; // Evita regenerar al cambiar de escena
  const tile = (key, base, dots) => { // Crea una textura de suelo 32x32 con motas
    const c = scene.textures.createCanvas(key, 32, 32); const g = c.getContext(); // Lienzo y contexto 2D
    g.fillStyle = base; g.fillRect(0, 0, 32, 32); // Color base
    dots.forEach(([x, y, col]) => { g.fillStyle = col; g.fillRect(x, y, 2, 2); }); // Motas de detalle
    c.refresh(); // Sube la textura a la GPU
  }; // Fin tile
  tile('ground_stone', '#8a8478', [[3, 5, '#6f6a60'], [20, 9, '#a39d90'], [11, 24, '#6f6a60'], [27, 27, '#a39d90']]); // Adoquín
  tile('ground_grass', '#4f8a3a', [[4, 6, '#3c6e2c'], [22, 12, '#6aa84f'], [12, 26, '#3c6e2c'], [28, 4, '#6aa84f']]); // Pasto
  tile('stone', '#5a5249', [[4, 4, '#463f38'], [18, 14, '#6e655a'], [8, 24, '#463f38']]); // Muro
  const W = 16, H = 24, dirs = ['down', 'left', 'right', 'up']; // Tamaño de cuadro y filas por dirección
  const c = scene.textures.createCanvas('player', W * 4, H * 4); const g = c.getContext(); // Hoja 4 cols x 4 filas
  const px = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); }; // Dibuja un rectángulo de píxeles
  const O = '#1a1420', Hc = '#5a3820', Hh = '#7a5030', Sk = '#e8c29a', Sd = '#c99a74', Rb = '#2d2540', Rh = '#40355a', Sc = '#b0222c', Go = '#f0c030', Sz = '#14101a', Lg = '#241c2e'; // Paleta de María Paula
  dirs.forEach((d, row) => { for (let f = 0; f < 4; f++) { // Por cada dirección y cuadro
    const ox = f * W, oy = row * H, b = f === 2 ? 1 : 0, sw = f === 1 ? 1 : f === 3 ? -1 : 0, P = []; // Origen, rebote del cuerpo y paso (-1,0,1)
    const A = (x, y, w, h, c) => P.push([d === 'left' ? 16 - x - w : x, y, w, h, c]); // Añade una pieza (espejada si mira a la izquierda)
    if (d === 'down' || d === 'up') { // Vista frontal o trasera
      A(5, 19, 3, 4 - (sw > 0 ? 1 : 0), Lg); A(9, 19, 3, 4 - (sw < 0 ? 1 : 0), Lg); A(5, 22 - (sw > 0 ? 1 : 0), 3, 2, Sz); A(9, 22 - (sw < 0 ? 1 : 0), 3, 2, Sz); // Piernas con paso y zapatos
      A(3, 11 + b, 10, 8, Rb); A(2, 17 + b, 12, 3, Rb); A(4, 12 + b, 2, 6, Rh); // Túnica, vuelo y reflejo
      const aL = b + (sw > 0 ? -1 : sw < 0 ? 1 : 0), aR = b + (sw < 0 ? -1 : sw > 0 ? 1 : 0); // Balanceo de brazos
      A(1, 12 + aL, 2, 6, Rb); A(13, 12 + aR, 2, 6, Rb); A(1, 17 + aL, 2, 2, Sk); A(13, 17 + aR, 2, 2, Sk); // Brazos y manos
      A(4, 10 + b, 8, 3, Sc); A(4, 11 + b, 8, 1, Go); A(6, 13 + b, 2, 5, Sc); A(6, 16 + b, 2, 1, Go); // Bufanda de Gryffindor con cola
      if (d === 'down') { A(4, 4 + b, 8, 7, Sk); A(3, 1 + b, 10, 5, Hc); A(3, 5 + b, 2, 4, Hc); A(11, 5 + b, 2, 4, Hc); A(5, 2 + b, 4, 1, Hh); A(6, 7 + b, 1, 2, Sz); A(9, 7 + b, 1, 2, Sz); A(7, 9 + b, 2, 1, Sd); } // Cara de frente
      else { A(4, 4 + b, 8, 7, Hc); A(3, 1 + b, 10, 9, Hc); A(5, 3 + b, 6, 1, Hh); A(6, 10 + b, 4, 1, Sk); } // Nuca (cabello)
    } else { // Vista lateral (derecha; la izquierda se espeja)
      A(6 - sw * 2, 19, 3, 4, Lg); A(8 + sw * 2, 19, 3, 4, Lg); A(6 - sw * 2, 22, 4, 2, Sz); A(8 + sw * 2, 22, 4, 2, Sz); // Piernas en zancada
      A(4, 11 + b, 8, 8, Rb); A(3, 17 + b, 10, 3, Rb); A(5, 12 + b, 2, 6, Rh); // Túnica
      A(6 - sw, 12 + b, 3, 6, Rb); A(6 - sw, 17 + b, 3, 2, Sk); // Brazo que se balancea
      A(4, 10 + b, 8, 3, Sc); A(4, 11 + b, 8, 1, Go); A(3, 12 + b, 2, 5, Sc); // Bufanda con cola al viento
      A(5, 4 + b, 7, 7, Sk); A(4, 1 + b, 8, 5, Hc); A(4, 5 + b, 3, 5, Hc); A(6, 2 + b, 4, 1, Hh); A(10, 7 + b, 1, 2, Sz); A(12, 8 + b, 1, 1, Sd); // Cabeza de perfil
    } // Fin vistas
    g.fillStyle = O; P.forEach(([x, y, w, h]) => g.fillRect(ox + x - 1, oy + y - 1, w + 2, h + 2)); // Contorno de 1 px
    P.forEach(([x, y, w, h, c]) => { g.fillStyle = c; g.fillRect(ox + x, oy + y, w, h); }); // Relleno por capas
    c.add(row * 4 + f, 0, ox, oy, W, H); // Registra el cuadro numerado
  } }); // Fin bucles
  c.refresh(); // Sube la hoja
  dirs.forEach((d, row) => { // Crea animaciones por dirección
    scene.anims.create({ key: 'walk-' + d, frames: [1, 0, 3, 0].map(f => ({ key: 'player', frame: row * 4 + f })), frameRate: 8, repeat: -1 }); // Caminar
    scene.anims.create({ key: 'run-' + d, frames: [1, 0, 3, 0].map(f => ({ key: 'player', frame: row * 4 + f })), frameRate: 13, repeat: -1 }); // Correr (más rápido)
    scene.anims.create({ key: 'idle-' + d, frames: [0, 2].map(f => ({ key: 'player', frame: row * 4 + f })), frameRate: 2, repeat: -1 }); // Respirar en reposo
  }); // Fin animaciones
} // Fin makeTextures
