import { PLAYER } from '../core/Config.js'; // Velocidades
import { computeVelocity, facingFrom } from '../utils/Movement.js'; // Lógica pura de movimiento

export class Player extends Phaser.Physics.Arcade.Sprite { // Protagonista María Paula
  constructor(scene, x, y, input) { // Escena, posición y gestor de entrada
    super(scene, x, y, 'player', 0); // Sprite con el cuadro 0 de la hoja
    scene.add.existing(this); scene.physics.add.existing(this); // Lo registra en render y física
    this.ctrl = input; this.facing = 'down'; this.frozen = false; // Entrada, orientación y bloqueo (diálogos)
    if (scene.textures.exists('sh')) this.shadow = scene.add.image(x, y + 11, 'sh').setAlpha(0.45); // Sombra de contacto
    this.setCollideWorldBounds(true); this.body.setSize(10, 8).setOffset(3, 16); // Colisión solo en los pies
  } // Fin constructor
  update() { // Se llama cada fotograma
    const dir = this.frozen ? { x: 0, y: 0 } : this.ctrl.vector; // Sin movimiento si está en diálogo
    const run = this.ctrl.running, { vx, vy } = computeVelocity(dir, run, PLAYER.WALK, PLAYER.RUN); // Velocidad según entrada
    this.setVelocity(vx, vy); this.facing = facingFrom(dir, this.facing); // Aplica y actualiza orientación
    if (vx || vy) this.anims.play((run ? 'run-' : 'walk-') + this.facing, true); // Anima si se mueve
    else this.anims.play('idle-' + this.facing, true); // Respira en reposo mirando a la dirección
    this.setDepth(this.y + 12); if (this.shadow) this.shadow.setPosition(this.x, this.y + 11).setDepth(this.y + 11); // Profundidad y sombra que sigue // Ordenamiento por profundidad (delante/detrás)
  } // Fin update
} // Fin Player
