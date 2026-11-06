'use strict';
/* ############################################################
   CONFIGURACIÓN NARRATIVA — Edita aquí los textos del juego
   ############################################################ */
const INTRO_LETTER = {
  title: 'CARTA DE ACEPTACIÓN',
  body: `<p>Estimada señorita <b>María Paula</b>:</p>
  <p>Nos complace informarle que ha sido aceptada en la <b>Escuela de Magia y Hechicería de Hogwarts</b>.</p>
  <p>El curso comienza el 1 de septiembre. El Expreso parte de la estación a las 11 en punto. No olvide su equipaje… ni su magia.</p>
  <p style="text-align:right">Atentamente,<br><b>Minerva McGonagall</b><br>Directora adjunta</p>`
};

const SORTING_SPEECH = [
  {who:'Sombrero Seleccionador', text:'¡Vaya, vaya! ¡Qué tenemos aquí! Una mente brillante, un corazón enorme y un espíritu imposible de ignorar.'},
  {who:'Sombrero Seleccionador', text:'Eres amable, dulce y cariñosa, pero también tienes una chispa de alegría que ilumina cualquier lugar al que llegas.'},
  {who:'Sombrero Seleccionador', text:'Eres divertida, graciosa, espontánea… tienes esa maravillosa capacidad de convertir lo ordinario en un recuerdo inolvidable.'},
  {who:'Sombrero Seleccionador', text:'Veo inteligencia, creatividad, curiosidad y una gran sensibilidad. Eres decidida, valiente, perseverante… mucho más fuerte de lo que imaginas.'},
  {who:'Sombrero Seleccionador', text:'Sabes escuchar, tienes empatía, eres leal con quienes quieres y no temes defender aquello en lo que crees.'},
  {who:'Sombrero Seleccionador', text:'También encuentro una personalidad auténtica, una sonrisa contagiosa, una imaginación extraordinaria… una luz propia que no necesita permiso para brillar.'},
  {who:'Sombrero Seleccionador', text:'¡Una combinación extraordinaria! Pero hay algo que destaca por encima de todo: tu corazón y tu valentía.'},
  {who:'Sombrero Seleccionador', text:'¡No hay ninguna duda! ¡GRYFFINDOR!'}
];

const FRIENDS = {
  orlando:      {name:'Orlando',        robe:0x23232e, trim:0x27408b, hair:0x241505, hat:{c:0x27408b, tip:true},
    lines:[{who:'Orlando', text:'¡Por fin llegaste! Nos tomó más trabajo organizar esta sorpresa que aprender todos los hechizos de Hogwarts. ¡Feliz cumpleaños!'}],
    extra:[{who:'Orlando', text:'¿Viste los regalos de la mesa? Cada uno tiene su propia magia. ¡Ábrelos todos!'}]},
  marce:        {name:'Marce',          robe:0x33202a, trim:0x8b1a1a, hair:0x6b3a10, hat:null,
    lines:[{who:'Marce', text:'¡Feliz cumpleaños! Hoy la magia está completamente de tu lado. Espero que este nuevo año esté lleno de aventuras maravillosas.'}],
    extra:[{who:'Marce', text:'El pastel lo vigilé yo personalmente. Ningún fantasma se atrevió a acercarse, te lo prometo.'}]},
  mariaangelica:{name:'María Angélica', robe:0x2a2033, trim:0xd4af37, hair:0x8a4a1a, hat:{c:0x2e8b57, tip:true},
    lines:[{who:'María Angélica', text:'¡Te mereces un día tan maravilloso como tú! Nunca pierdas esa alegría que te hace tan especial.'}],
    extra:[{who:'María Angélica', text:'Cuando el Sombrero gritó Gryffindor, todos lo supimos: siempre fuiste de aquí.'}]},
  yus:          {name:'Yus',            robe:0x1f2a24, trim:0xc0392b, hair:0x101010, hat:{c:0xe67e22, tip:true},
    lines:[{who:'Yus', text:'¡Que nunca te falten motivos para sonreír, personas que te quieran y aventuras por vivir!'}],
    extra:[{who:'Yus', text:'¿Ya viste la cámara mágica junto al cartel? Tenemos que tomarnos la foto grupal.'}]},
  mauro:        {name:'Mauro',          robe:0x2e2a1f, trim:0x8b6914, hair:0x3a2a10, hat:null,
    lines:[{who:'Mauro', text:'¡Espero que hayas guardado espacio para el pastel! Porque tenemos una misión muy importante: ¡comérnoslo todo!'}],
    extra:[{who:'Mauro', text:'Yo propuse guardar el doble de porciones. Fue aprobado por unanimidad.'}]},
  jeisson:      {name:'Jeisson',        robe:0x242433, trim:0xd4af37, hair:0x1a1a1a, hat:{c:0x8e44ad, tip:true},
    lines:[{who:'Jeisson', text:'¡Bienvenida a Gryffindor! Aunque creo que ya eras parte de esta casa desde antes de llegar.'}],
    extra:[{who:'Jeisson', text:'Hay una carta esperándote en la mesita roja. No digas que no te avisé.'}]}
};

const FINAL_LETTER = {
  title:'UNA CARTA PARA MARÍA PAULA',
  body:`<p>Querida María Paula:</p>
  <p>Hoy Hogwarts tiene algo especial que celebrar, y no es precisamente la llegada de una nueva estudiante. Es el cumpleaños de una persona maravillosa.</p>
  <p>Queremos recordarte lo mucho que vales y lo especial que eres para quienes tenemos la fortuna de compartir contigo.</p>
  <p>Que nunca pierdas esa sonrisa, tu dulzura, tu alegría y esa manera tan tuya de hacer que los momentos se conviertan en recuerdos inolvidables.</p>
  <p>Que tengas el valor de perseguir tus sueños, la fuerza para superar cualquier obstáculo y la curiosidad para seguir descubriendo todas las maravillas que la vida tiene preparadas para ti.</p>
  <p>Recuerda que no necesitas magia para ser extraordinaria, porque hay algo en ti que ya hace que el mundo sea un poquito más bonito.</p>
  <p>Hoy celebramos tu vida, tu amistad y todas las aventuras que todavía nos quedan por compartir.</p>
  <p>Con mucho cariño,</p>
  <p><b>Orlando, Marce, María Angélica, Yus, Mauro, Jeisson y todos tus amigos.</b></p>
  <p style="text-align:center"><b>¡FELIZ CUMPLEAÑOS!</b></p>`
};

const GIFTS = [
  {name:'Carta dorada',      ico:'✉', msg:'Una carta escrita a mano: "Cada año a tu lado es nuestro hechizo favorito. ¡Feliz cumpleaños!"'},
  {name:'Felicidad embotellada', ico:'⚗', msg:'Un frasco que brilla con luz dorada. La etiqueta dice: "Se fabrica cada vez que sonríes."'},
  {name:'Fotografía encantada',   ico:'▣', msg:'Una fotografía donde tus amigos te saludan y hacen muecas. Se mueve y todo.'},
  {name:'Bufanda tejida a mano',  ico:'≈', msg:'Una bufanda en rojo y dorado, tejida con el patrón de Gryffindor. Abraza calientita.'},
  {name:'Boleto de recuerdo',     ico:'✦', msg:'Un boleto del Expreso de Hogwarts con la fecha de hoy: "Validez: para siempre. Destino: felicidad."'}
];

