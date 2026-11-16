import {
  calcularIndicadores,
  formatoNumero,
  obtenerMensajeEstado,
  tieneUmbralModerado,
} from './nutricionSemaforoLogica'

// Tarjeta de un nutriente con su nivel y umbrales
function IndicadorNutriente({ indicador }) {
  return (
    <li
      className={`nutricion-semaforo__indicador nutricion-semaforo-${indicador.nivel}`}
      aria-label={`${indicador.nombre}: ${indicador.etiqueta}. Valor ${formatoNumero(indicador.valor)} ${indicador.unidad}.`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="m-0 font-poppins text-base font-bold">{indicador.nombre}</h4>
        <span className="nutricion-semaforo__estado inline-flex items-center text-xs">
          <span className="nutricion-semaforo__punto" aria-hidden="true" />
          {indicador.etiqueta}
        </span>
      </div>

      <p className="nutricion-semaforo__valor mb-1 font-mono-tag font-bold">
        {formatoNumero(indicador.valor)}{' '}
        <span className="text-sm font-medium">{indicador.unidad}</span>
      </p>
      <p className="nutricion-semaforo__ayuda mb-3 text-sm">{indicador.explicacion}</p>

      <dl className="nutricion-semaforo__umbrales grid grid-cols-2 gap-2 pt-3 text-xs">
        {tieneUmbralModerado(indicador.umbralModerado) && (
          <div>
            <dt className="nutricion-semaforo__ayuda">Umbral moderado</dt>
            <dd className="m-0 font-mono-tag font-bold">
              {formatoNumero(indicador.umbralModerado)} {indicador.unidad}
            </dd>
          </div>
        )}
        <div>
          <dt className="nutricion-semaforo__ayuda">Umbral alto</dt>
          <dd className="m-0 font-mono-tag font-bold">
            {formatoNumero(indicador.umbralAlto)} {indicador.unidad}
          </dd>
        </div>
      </dl>
    </li>
  )
}

// Mensaje cuando faltan reglas o datos
function AvisoSemaforo({ texto }) {
  return (
    <p className="nutricion-semaforo__aviso text-sm" role="status">
      {texto}
    </p>
  )
}

function NutricionSemaforo({
  plato = null,
  totales = null,
  reglasNutricionales: reglasRecibidas = null,
  titulo = 'Semáforo de aportes nutricionales',
}) {
  const reglas = reglasRecibidas || plato?.reglasNutricionales || null
  const indicadores = calcularIndicadores(reglas, totales)
  const hayReglas = reglas && (reglas.sodio || reglas.grasas)

  let contenido = (
    <ul className="nutricion-semaforo__lista grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Indicadores de sodio y grasas">
      {indicadores.map((indicador) => (
        <IndicadorNutriente key={indicador.clave} indicador={indicador} />
      ))}
    </ul>
  )
  if (!hayReglas) {
    contenido = <AvisoSemaforo texto="No hay reglas de validación nutricional disponibles para esta receta." />
  } else if (indicadores.length === 0) {
    contenido = <AvisoSemaforo texto="Las reglas están disponibles, pero faltan valores o umbrales válidos para mostrar los indicadores." />
  }

  return (
    <section className="nutricion-semaforo w-full" aria-labelledby="nutricion-semaforo-titulo">
      <header className="mb-5">
        <p className="nutricion-semaforo__etiqueta mb-1 font-mono-tag text-xs font-bold uppercase tracking-wider">
          Análisis de receta
        </p>
        <h3
          id="nutricion-semaforo-titulo"
          className="nutricion-semaforo__encabezado m-0 font-poppins font-bold"
        >
          {titulo}
        </h3>
        <p className="nutricion-semaforo__ayuda mb-0 mt-2 text-sm">
          Los indicadores se determinan con los umbrales enviados por el servicio de nutrición.
        </p>
      </header>

      {contenido}

      <span className="sr-only" aria-live="polite">
        {obtenerMensajeEstado(indicadores)}
      </span>
    </section>
  )
}

export default NutricionSemaforo
