export function computeVelocity(dir, running, walk = 70, run = 120) { // Convierte dirección en velocidad (función pura, testeable)
  const len = Math.hypot(dir.x, dir.y); // Magnitud del vector de entrada
  if (len === 0) return { vx: 0, vy: 0 }; // Sin entrada: quieto
  const speed = running ? run : walk; // Elige caminar o correr
  return { vx: (dir.x / len) * speed, vy: (dir.y / len) * speed }; // Normaliza para que la diagonal no sea más rápida
} // Fin computeVelocity

export function facingFrom(dir, prev = 'down') { // Decide hacia dónde mira el personaje
  if (dir.x === 0 && dir.y === 0) return prev; // Sin entrada conserva la orientación
  if (Math.abs(dir.x) > Math.abs(dir.y)) return dir.x > 0 ? 'right' : 'left'; // Predomina horizontal
  return dir.y > 0 ? 'down' : 'up'; // Predomina vertical
} // Fin facingFrom
