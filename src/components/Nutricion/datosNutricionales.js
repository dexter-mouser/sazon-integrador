// Datos simulados de la receta (mientras no haya base de datos ni API)

export const datosNutricionales = {
  plato: {
    nombre: 'Perro caliente con Ranchera',

    // Límites de sodio y grasas para esta receta
    reglasNutricionales: {
      sodio: { moderado: 1200, alto: 2000, unidad: 'mg' },
      grasas: { moderado: 15, alto: 25, unidad: 'g' },
    },

    // "contiene" dice qué lleva cada ingrediente: lactosa, gluten o carne
    ingredientes: [
      { nombre: 'Salchicha Ranchera', contiene: ['carne'] },
      { nombre: 'Pan para perro caliente', contiene: ['gluten'] },
      { nombre: 'Queso rallado', contiene: ['lactosa'] },
      { nombre: 'Salsa de tomate', contiene: [] },
    ],
  },

  // Lo que aporta la receta completa
  totales: {
    sodio: 700,
    grasas: 18,
  },

  // Avisos que se muestran solo si el servicio falla
  avisos: [
    {
      id: 'aviso-general',
      tipo: 'informacion',
      titulo: 'No pudimos revisar tu perfil',
      mensaje: 'Mostramos recomendaciones generales para esta receta.',
      sugerencia: 'Revisa el sodio y las grasas antes de prepararla.',
    },
  ],
}