import { ITEMS } from './items.js'; // Nombres de ingredientes para el minijuego
export const ING = ['raiz_luna', 'hoja_plata', 'polvo_estrella', 'petalo_fuego', 'escama_lago', 'baya_sombra']; // Ingredientes del Capítulo 5
export const RECIPE = ['hoja_plata', 'raiz_luna', 'polvo_estrella']; // Receta correcta, en orden
export const REQUIRED = { ranger: ['amuleto_bosque', 'pluma_plata', 'orbe_musgo'], atril: ['libro_1', 'libro_2', 'libro_3'], cauldron: ING }; // Objetos que deben existir en el mundo para poder avanzar
// Guiones: cada uno recibe un contexto c con say, ask, give, take, has, flag, setFlag, done, complete
export const SCRIPTS = { // Catálogo de guiones por nombre
  luggage: async c => { // Revisar el equipaje
    if (c.has('carta_admision')) return c.say(['Tu equipaje está en orden: ropa, un caldero pequeño y una lechuza de peluche.']); // Ya revisado
    await c.say(['Abres tu baúl con cuidado.', 'Entre tus cosas encuentras un sobre sellado con cera: tu carta de admisión.']); c.give('carta_admision'); // Primera vez
  }, // Fin luggage
  guide: async c => { // El guía del andén
    if (c.done('q1')) return c.say(['Guía: Sigue el sendero hacia el este. ¡El castillo te espera!']); // Misión ya hecha
    if (!c.has('carta_admision')) return c.say(['Guía: ¿Eres la nueva alumna? Necesito ver tu carta de admisión.', 'Guía: Revisa tu equipaje y vuelve conmigo.']); // Falta la carta
    await c.say(['Guía: ¡Ahí estás! Déjame ver esa carta... Todo en orden, María Paula.', 'Guía: El castillo queda al final del sendero del bosque. Yo te abro el camino.']); c.complete('q1'); // Completa
  }, // Fin guide
  student2: async c => { // Estudiante que perdió su bufanda
    if (c.flag('scarf_returned')) return c.say(['Estudiante: ¡Gracias otra vez por mi bufanda!']); // Ya entregada
    if (!c.has('objeto_perdido')) return c.say(['Estudiante: ¡Perdí mi bufanda en el andén! Si la ves, avísame.']); // Pide ayuda
    await c.say(['Estudiante: ¡Mi bufanda! Gracias. Toma, un cromo de mago coleccionable.']); c.take('objeto_perdido'); c.give('cromo_mago'); c.setFlag('scarf_returned'); // Entrega y recompensa
  }, // Fin student2
  ranger: async c => { // Guardabosques y acertijo
    if (c.done('q2')) return c.say(['Guardabosques: Que el bosque te acompañe hasta el castillo.']); // Hecho
    const n = REQUIRED.ranger.filter(i => c.has(i)).length; // Objetos recuperados
    if (!c.flag('ranger_met')) { await c.say(['Guardabosques: Alguien dejó caer tres objetos mágicos por el sendero: un amuleto, una pluma y un orbe.', 'Guardabosques: Tráemelos y te dejaré pasar... después de un acertijo.']); c.setFlag('ranger_met'); } // Presentación
    if (n < 3) return c.say(['Guardabosques: Te faltan ' + (3 - n) + ' objeto(s). Explora bien: algunos se esconden en rincones.']); // Faltan objetos
    await c.say(['Guardabosques: ¡Los tienes todos! Ahora mi acertijo:', 'Guardabosques: "Cuanto más me quitas, más grande soy."']); // Plantea
    const k = await c.ask('¿Qué soy?', ['Una sombra', 'Un hoyo', 'Un río']); // Respuesta
    if (k === 1) { await c.say(['Guardabosques: ¡Exacto! Un hoyo crece cuanto más tierra le quitas. Puedes pasar.']); c.complete('q2'); } // Correcto
    else await c.say(['Guardabosques: No exactamente. Piensa en algo que crece cuando le quitas cosas.']); // Incorrecto
  }, // Fin ranger
  atril: async c => { // Acertijo de la biblioteca
    if (c.done('q4')) return c.say(['El atril brilla: el mensaje ya está descifrado.']); // Hecho
    const miss = REQUIRED.atril.filter(i => !c.has(i)).length; // Tomos que faltan
    if (miss) return c.say(['Un atril antiguo con símbolos que brillan sin sentido.', 'Necesitas los tres tomos antiguos para descifrarlo (te faltan ' + miss + ').']); // Aún no
    await c.say(['Los tres tomos vibran y sus pistas se ordenan sobre el atril:', 'Tomo I: "Todo hechizo que abre comienza con AL."', 'Tomo II: "Lo que une el principio y el final es OHOMO."', 'Tomo III: "Y cierra con RA, como el eco de una puerta."']); // Pistas
    const k = await c.ask('¿Qué dice el mensaje mágico?', ['ALOHOMORA', 'RAOHOMOAL', 'OHOMOALRA']); // Respuesta
    if (k === 0) { await c.say(['Las letras brillan: el mensaje queda descifrado.', 'Una pista más: la biblioteca guarda otros secretos para quien explora.']); c.complete('q4'); } // Correcto
    else await c.say(['Las letras se desordenan. Relee las pistas: ¿cómo empieza, qué va en medio y cómo termina?']); // Incorrecto
  }, // Fin atril
  cauldron: async c => { // Minijuego de la poción
    if (c.done('q5')) return c.say(['El caldero burbujea tranquilo. Ya tienes tu poción.']); // Hecho
    const mine = ING.filter(i => c.has(i)); // Ingredientes que lleva
    if (mine.length < 3) return c.say(['Un caldero vacío. Necesitas al menos tres ingredientes: explora el aula.']); // Faltan
    await c.say(['Vas a preparar la Poción de Luz Dorada.', 'Elige tres ingredientes, en el orden correcto. El libro de recetas puede ayudarte.']); // Intro
    const pick = []; for (let s = 1; s <= 3; s++) { const o = mine.filter(i => !pick.includes(i)); pick.push(o[await c.ask('Paso ' + s + ' de 3: ¿qué añades?', o.map(i => ITEMS[i].name))]); } // Tres decisiones
    const hits = pick.filter(p => RECIPE.includes(p)).length; // Aciertos de ingrediente
    if (pick.every((p, i) => p === RECIPE[i])) { await c.say(['¡El caldero se llena de una luz dorada perfecta!', 'Obtienes una Poción de Luz Dorada.']); c.give('pocion_luz'); c.setFlag('potion', 'perfect'); c.complete('q5'); } // Perfecta
    else if (hits >= 2) { await c.say(['La mezcla burbujea y queda turbia, pero estable.', 'Obtienes una poción turbia: no es perfecta, pero sirve.']); c.give('pocion_turbia'); c.setFlag('potion', 'decent'); c.complete('q5'); } // Aceptable
    else await c.say(['¡PUF! El caldero suelta una nube de humo negro y la mezcla se arruina.', 'Los ingredientes siguen contigo: inténtalo otra vez.']); // Fracaso (se puede repetir)
  } // Fin cauldron
}; // Fin SCRIPTS
