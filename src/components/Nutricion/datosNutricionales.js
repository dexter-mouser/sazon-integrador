export const datosNutricionales = {
  plato: {
    nombre: 'Receta de ejemplo',
    reglasNutricionales: {
      sodio: {
        moderado: 1200,
        alto: 2000,
        unidad: 'mg',
      },
      grasas: {
        moderado: 15,
        alto: 25,
        unidad: 'g',
      },
    },
  },

  totales: {
    sodio: 1450,
    grasas: 18,
  },

  avisos: [
    {
      id: 'sodio-meta-comida',
      tipo: 'advertencia',
      titulo: 'Revisa tu consumo de sodio',
      mensaje: 'Esta receta supera tu meta de sodio por comida.',
      sugerencia: 'Reemplazar la Ranchera por su versión reducida en sodio.',
    },
  ],
}
