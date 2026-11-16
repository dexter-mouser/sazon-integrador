// Servicio de nutrición (datos simulados mientras no haya API)
// Cada persona agrega sus funciones solo dentro de su sección.

/* 1 - Santiago Padilla */
/* Fin 1 */

/* 2 - Juan Camilo Valencia Estrada */
// HU 4.2.3 - Sincronización de alertas con el perfil activo

// Nombre del evento que avisa que el perfil o las metas cambiaron
export const EVENTO_PERFIL_ACTUALIZADO = 'sazon:perfil-alimentario-actualizado'

// Avisa a toda la página que el perfil cambió; nunca lanza error
function emitirCambioPerfil(origen) {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(EVENTO_PERFIL_ACTUALIZADO, {
          detail: { origen, momento: Date.now() },
        })
      )
    }
  } catch (error) {
    console.error('No se pudo emitir el evento de perfil actualizado:', error)
  }
}

// Envuelve una función de guardado: si guarda bien, emite el evento
function conAvisoDeCambio(funcion, origen) {
  return async (...argumentos) => {
    const resultado = await funcion(...argumentos)
    emitirCambioPerfil(origen)
    return resultado
  }
}

// Lee el sodio máximo diario guardado en el formulario del perfil (solo lectura)
function leerSodioMaximoGuardado() {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(CLAVE_METAS))
    const sodio = Number(guardado?.sodioMaximo)
    const esValido =
      Number.isFinite(sodio) &&
      sodio >= LIMITES_METAS.sodioMin &&
      sodio <= LIMITES_METAS.sodioMax
    return esValido ? sodio : null
  } catch {
    return null
  }
}

function crearAvisoPorNutriente({ clave, nombre, valor, regla, bajoEnSodio }) {
  if (!regla || !Number.isFinite(valor) || !Number.isFinite(Number(regla.alto))) return null

  const alto = Number(regla.alto)
  const moderado = regla.moderado == null ? null : Number(regla.moderado)

  if (valor >= alto) {
    return {
      id: `${clave}-alto`,
      tipo: 'advertencia',
      titulo: `Revisa tu consumo de ${nombre}`,
      mensaje:
        clave === 'sodio' && bajoEnSodio
          ? 'Esta receta supera tu meta de sodio por comida.'
          : `Esta receta supera el nivel alto de ${nombre}.`,
      sugerencia:
        clave === 'sodio'
          ? 'Reemplazar la Ranchera por su versión reducida en sodio.'
          : 'Prefiere cortes magros o preparaciones al horno o a la plancha.',
    }
  }

  if (moderado !== null && Number.isFinite(moderado) && valor >= moderado) {
    return {
      id: `${clave}-moderado`,
      tipo: 'advertencia',
      titulo: `Cuida tu consumo de ${nombre}`,
      mensaje: `Esta receta ya alcanza el nivel moderado de ${nombre}.`,
      sugerencia:
        clave === 'sodio'
          ? 'Reduce la sal añadida o elige ingredientes bajos en sodio.'
          : 'Reduce la cantidad de grasa o aceite al cocinar.',
    }
  }

  return null
}

// Calcula semáforo y avisos de un plato según el perfil alimentario activo.
// Es asíncrona para que más adelante pueda cambiarse por una petición real a la API.
async function analizarPlatoConPerfil(plato, totales) {
  if (!plato || typeof plato !== 'object') {
    throw new Error('Plato no válido para el análisis nutricional')
  }
  if (!totales || typeof totales !== 'object') {
    throw new Error('Totales nutricionales no válidos')
  }

  const perfil = leerPerfilGuardado()
  const activas = perfil.filter((item) => item.estaActivo).map((item) => item.nombre)
  const bajoEnSodio = activas.includes('Bajo en sodio')
  const sodioMaximo = leerSodioMaximoGuardado()

  const reglas = structuredClone(plato.reglasNutricionales || {})

  // Con "Bajo en sodio" activo, el umbral se ajusta a la meta diaria dividida en 3 comidas
  if (bajoEnSodio && sodioMaximo && reglas.sodio) {
    const metaPorComida = Math.round(sodioMaximo / 3)
    const altoBase = Number(reglas.sodio.alto)
    const alto = Number.isFinite(altoBase) ? Math.min(altoBase, metaPorComida) : metaPorComida
    reglas.sodio = { ...reglas.sodio, alto, moderado: Math.round(alto * 0.8) }
  }

  const avisos = [
    crearAvisoPorNutriente({
      clave: 'sodio',
      nombre: 'sodio',
      valor: Number(totales.sodio),
      regla: reglas.sodio,
      bajoEnSodio,
    }),
    crearAvisoPorNutriente({
      clave: 'grasas',
      nombre: 'grasas',
      valor: Number(totales.grasas),
      regla: reglas.grasas,
      bajoEnSodio,
    }),
  ].filter(Boolean)

  if (activas.length > 0) {
    avisos.push({
      id: 'perfil-activo',
      tipo: 'informacion',
      titulo: 'Perfil alimentario activo',
      mensaje: `Tus restricciones activas: ${activas.join(', ')}.`,
      sugerencia: 'Verifica los ingredientes antes de preparar la receta.',
    })
  }

  // La firma permite saber si el resultado cambió respecto al anterior
  const firma = JSON.stringify({ activas, sodioMaximo, totales, reglas })

  return { reglas, avisos, activas, firma }
}
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

const CLAVE_METAS = 'sazon-metas-nutricionales'

export const LIMITES_METAS = {
  caloriasMin: 1200,
  caloriasMax: 4000,
  sodioMin: 500,
  sodioMax: 2300,
  notasMax: 200,
}

export const METAS_INICIALES = { caloriasObjetivo: 2000, sodioMaximo: 1500, notas: '' }

// Valida las metas antes de guardarlas; lanza error si algo está fuera de rango
function validarMetas(metas) {
  const calorias = Number(metas.caloriasObjetivo)
  const sodio = Number(metas.sodioMaximo)
  const notas = String(metas.notas ?? '').trim()

  if (!Number.isInteger(calorias) || calorias < LIMITES_METAS.caloriasMin || calorias > LIMITES_METAS.caloriasMax) {
    throw new Error('Calorías objetivo fuera de rango')
  }
  if (!Number.isInteger(sodio) || sodio < LIMITES_METAS.sodioMin || sodio > LIMITES_METAS.sodioMax) {
    throw new Error('Sodio máximo fuera de rango')
  }
  if (notas.length > LIMITES_METAS.notasMax) {
    throw new Error('Notas demasiado largas')
  }
  return { caloriasObjetivo: calorias, sodioMaximo: sodio, notas }
}

async function guardarMetasNutricionales(metas) {
  const metasValidas = validarMetas(metas)
  sessionStorage.setItem(CLAVE_METAS, JSON.stringify(metasValidas))
  return metasValidas
}
/* Fin 3 */

/* 4 - Jose David Correa Builes */
/* Fin 4 */

/* 5 - José David Valencia Martínez */
const META_CALORIAS_POR_DEFECTO = 2000

// Porcentaje desde el cual se avisa que la meta está cerca
export const UMBRAL_META_CERCA = 80

// Consumo simulado del día mientras no haya API
const consumoDelDia = [
  { id: 1, momento: 'Desayuno', descripcion: 'Arepa con queso y café con leche', calorias: 420 },
  { id: 2, momento: 'Media mañana', descripcion: 'Fruta picada con yogur', calorias: 180 },
  { id: 3, momento: 'Almuerzo', descripcion: 'Pasta con salsa de tomate y pollo', calorias: 650 },
  { id: 4, momento: 'Algo', descripcion: 'Galletas de avena', calorias: 150 },
]

// Lee la meta de calorías guardada desde el formulario del perfil (solo lectura);
// si no existe o no es válida, usa la meta por defecto
function leerMetaCalorias() {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(CLAVE_METAS))
    const calorias = Number(guardado?.caloriasObjetivo)
    const esValida =
      Number.isInteger(calorias) &&
      calorias >= LIMITES_METAS.caloriasMin &&
      calorias <= LIMITES_METAS.caloriasMax
    if (esValida) {
      return { metaCalorias: calorias, esMetaPersonalizada: true }
    }
  } catch {
    // Dato dañado en la sesión: se usa la meta por defecto
  }
  return { metaCalorias: META_CALORIAS_POR_DEFECTO, esMetaPersonalizada: false }
}

async function obtenerResumenMetaDiaria() {
  const comidas = structuredClone(consumoDelDia)
  const caloriasConsumidas = comidas.reduce((total, comida) => total + comida.calorias, 0)
  return { ...leerMetaCalorias(), caloriasConsumidas, comidas }
}

// Valida los datos del resumen y calcula el avance frente a la meta.
// Devuelve esValido: false si la meta o el consumo no se pueden usar.
export function calcularProgresoCalorias(metaCalorias, caloriasConsumidas) {
  const meta = Number(metaCalorias)
  const consumidas = Number(caloriasConsumidas)
  const esValido =
    metaCalorias != null &&
    caloriasConsumidas != null &&
    Number.isFinite(meta) &&
    Number.isFinite(consumidas) &&
    meta > 0 &&
    consumidas >= 0

  if (!esValido) {
    return { esValido: false }
  }

  const porcentaje = Math.round((consumidas / meta) * 100)
  let estado = 'en-curso'
  if (consumidas > meta) {
    estado = 'excedida'
  } else if (consumidas === meta) {
    estado = 'cumplida'
  } else if (porcentaje >= UMBRAL_META_CERCA) {
    estado = 'cerca'
  }

  return {
    esValido: true,
    meta,
    consumidas,
    porcentaje,
    // La barra nunca se dibuja por fuera de su contenedor
    porcentajeBarra: Math.min(porcentaje, 100),
    restantes: Math.max(meta - consumidas, 0),
    excedente: Math.max(consumidas - meta, 0),
    estado,
  }
}
/* Fin 5 */

export const nutricionServicio = {
  obtenerPerfilAlimentario,
  // Estas dos avisan con un evento cuando guardan bien (HU 4.2.3)
  actualizarPerfilAlimentario: conAvisoDeCambio(actualizarPerfilAlimentario, 'restricciones'),
  guardarMetasNutricionales: conAvisoDeCambio(guardarMetasNutricionales, 'metas'),
  obtenerResumenMetaDiaria,
  analizarPlatoConPerfil,
}