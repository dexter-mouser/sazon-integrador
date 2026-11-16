// Lógica del semáforo de aportes (sin vista)

const NUTRIENTES = [
  { clave: 'sodio', nombre: 'Sodio' },
  { clave: 'grasas', nombre: 'Grasas totales' },
]

const UNIDADES_POR_DEFECTO = { sodio: 'mg', grasas: 'g' }

const NIVELES = {
  alto: {
    nivel: 'alerta',
    etiqueta: 'Aporte alto',
    explicacion: 'El aporte alcanzó o superó el umbral alto definido para esta receta.',
  },
  moderado: {
    nivel: 'alerta',
    etiqueta: 'Aporte moderado',
    explicacion: 'El aporte alcanzó el umbral moderado; se recomienda revisar la cantidad.',
  },
  normal: {
    nivel: 'ok',
    etiqueta: 'Dentro del nivel esperado',
    explicacion: 'El aporte se encuentra por debajo del umbral moderado.',
  },
}

const MENSAJES_ESTADO = {
  alerta: 'Se encontraron aportes nutricionales moderados o altos.',
  ok: 'Los aportes evaluados están dentro del nivel esperado.',
}

const formateador = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })

export const formatoNumero = (valor) => formateador.format(valor)

export const tieneUmbralModerado = (umbralModerado) =>
  umbralModerado !== null && Number.isFinite(umbralModerado)

function obtenerNivel(valor, umbralAlto, umbralModerado) {
  if (valor >= umbralAlto) return NIVELES.alto
  if (tieneUmbralModerado(umbralModerado) && valor >= umbralModerado) return NIVELES.moderado
  return NIVELES.normal
}

function crearIndicador(nutriente, regla, valorRecibido) {
  const valor = Number(valorRecibido)
  const umbralAlto = Number(regla?.alto)
  const umbralModerado = regla?.moderado == null ? null : Number(regla.moderado)

  // Un indicador solo se presenta cuando el servicio entregó datos y un umbral alto válido.
  if (
    !regla ||
    valorRecibido == null ||
    !Number.isFinite(valor) ||
    !Number.isFinite(umbralAlto) ||
    umbralAlto < 0
  ) {
    return null
  }

  return {
    ...nutriente,
    valor,
    unidad: regla.unidad || UNIDADES_POR_DEFECTO[nutriente.clave],
    ...obtenerNivel(valor, umbralAlto, umbralModerado),
    umbralModerado,
    umbralAlto,
  }
}

export function calcularIndicadores(reglas, totales) {
  return NUTRIENTES
    .map((nutriente) => crearIndicador(nutriente, reglas?.[nutriente.clave], totales?.[nutriente.clave]))
    .filter(Boolean)
}

export function obtenerMensajeEstado(indicadores) {
  if (indicadores.length === 0) return ''
  const hayAlerta = indicadores.some((indicador) => indicador.nivel === 'alerta')
  return hayAlerta ? MENSAJES_ESTADO.alerta : MENSAJES_ESTADO.ok
}
