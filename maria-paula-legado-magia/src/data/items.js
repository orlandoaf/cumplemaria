export const TYPES = { magico: 'Objetos mágicos', libro: 'Libros', ingrediente: 'Ingredientes', regalo: 'Regalos', carta: 'Cartas', recuerdo: 'Recuerdos' }; // Categorías del inventario (sección 12)
const I = (name, type) => ({ name, type }); // Atajo para definir un objeto
export const ITEMS = { // Catálogo de objetos del juego
  carta_admision: I('Carta de admisión', 'carta'), objeto_perdido: I('Bufanda extraviada', 'recuerdo'), cromo_mago: I('Cromo de mago', 'recuerdo'), // Capítulo 1
  amuleto_bosque: I('Amuleto del bosque', 'magico'), pluma_plata: I('Pluma de plata', 'magico'), orbe_musgo: I('Orbe de musgo', 'magico'), flor_luminosa: I('Flor luminosa', 'recuerdo'), // Capítulo 2
  moneda_suerte: I('Moneda de la suerte', 'recuerdo'), // Recompensa del Capítulo 3
  libro_1: I('Tomo antiguo I', 'libro'), libro_2: I('Tomo antiguo II', 'libro'), libro_3: I('Tomo antiguo III', 'libro'), marcapaginas: I('Marcapáginas encantado', 'recuerdo'), tinta_brillante: I('Tinta brillante', 'magico'), grimorio_olvidado: I('Grimorio olvidado', 'libro'), pergamino_descifrado: I('Mensaje descifrado', 'carta'), // Capítulo 4
  raiz_luna: I('Raíz de luna', 'ingrediente'), hoja_plata: I('Hoja de plata', 'ingrediente'), polvo_estrella: I('Polvo de estrella', 'ingrediente'), petalo_fuego: I('Pétalo de fuego', 'ingrediente'), escama_lago: I('Escama de lago', 'ingrediente'), baya_sombra: I('Baya de sombra', 'ingrediente'), // Ingredientes del Capítulo 5
  pocion_luz: I('Poción de Luz Dorada', 'magico'), pocion_turbia: I('Poción turbia', 'magico') // Resultados del minijuego
}; // Fin ITEMS
