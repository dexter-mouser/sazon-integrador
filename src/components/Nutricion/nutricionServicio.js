// Servicio de nutrición (datos simulados mientras no haya API)
// Cada persona agrega sus funciones solo dentro de su sección.

/* 1 - Santiago Padilla */
/* Fin 1 */

/* 2 - Juan Camilo Valencia Estrada */
/* Fin 2 */

/* 3 - José Manuel Botero Giraldo */
const CLAVE_PERFIL = 'sazon-perfil-alimentario'

const perfilInicial = [
  { id: 1, nombre: 'Sin lactosa', estaActivo: true },
  { id: 2, nombre: 'Vegetariano', estaActivo: false },
  { id: 3, nombre: 'Bajo en sodio', estaActivo: true },
  { id: 4, nombre: 'Sin gluten', estaActivo: false },
]

// Lee el perfil guardado en la sesión; si falta o está dañado, usa el inicial
function leerPerfilGuardado() {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(CLAVE_PERFIL))
    return Array.isArray(guardado) ? guardado : structuredClone(perfilInicial)
  } catch {
    return structuredClone(perfilInicial)
  }
}

async function obtenerPerfilAlimentario() {
  return leerPerfilGuardado()
}

async function actualizarPerfilAlimentario(idRestriccion, estaActivo) {
  const perfil = leerPerfilGuardado()
  const restriccion = perfil.find((item) => item.id === idRestriccion)
  if (!restriccion) {
    throw new Error(`Restricción ${idRestriccion} no existe`)
  }
  restriccion.estaActivo = Boolean(estaActivo)
  sessionStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil))
  return structuredClone(restriccion)
}
/* Fin 3 */

/* 4 - Jose David Correa Builes */
/* Fin 4 */

/* 5 - José David Valencia Martínez */
/* Fin 5 */

export const nutricionServicio = {
  obtenerPerfilAlimentario,
  actualizarPerfilAlimentario,
}
