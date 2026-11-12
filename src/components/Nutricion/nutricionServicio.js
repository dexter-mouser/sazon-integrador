// Servicio de nutrición (datos simulados mientras no haya API)
// Cada persona agrega sus funciones solo dentro de su sección.

/* 1 - Santiago Padilla */
/* Fin 1 */

/* 2 - Juan Camilo Valencia Estrada */
/* Fin 2 */

/* 3 - José Manuel Botero Giraldo */
const perfilAlimentario = [
  { id: 1, nombre: 'Sin lactosa', estaActivo: true },
  { id: 2, nombre: 'Vegetariano', estaActivo: false },
  { id: 3, nombre: 'Bajo en sodio', estaActivo: true },
  { id: 4, nombre: 'Sin gluten', estaActivo: false },
]

async function obtenerPerfilAlimentario() {
  return structuredClone(perfilAlimentario)
}
/* Fin 3 */

/* 4 - Jose David Correa Builes */
/* Fin 4 */

/* 5 - José David Valencia Martínez */
/* Fin 5 */

export const nutricionServicio = {
  obtenerPerfilAlimentario,
}
