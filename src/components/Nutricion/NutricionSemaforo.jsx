import "./NutricionSemaforo.css";


function NutricionSemaforo({
  plato = null,
  totales = null,
  reglasNutricionales: reglasRecibidas = null,
  titulo = 'Semáforo de aportes nutricionales',
}) {
  const reglas = reglasRecibidas || plato?.reglasNutricionales || null
  const nutrientes = [
    { clave: 'sodio', nombre: 'Sodio', valor: totales?.sodio },
    { clave: 'grasas', nombre: 'Grasas totales', valor: totales?.grasas },
  ]

  const formatoNumero = (valor) =>
    new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(valor)

  const indicadores = nutrientes
    .map((nutriente) => {
      const regla = reglas?.[nutriente.clave]
      const valor = Number(nutriente.valor)
      const umbralAlto = Number(regla?.alto)
      const umbralModerado = regla?.moderado == null ? null : Number(regla.moderado)

      // Un indicador solo se presenta cuando el servicio entregó datos y un umbral alto válido.
      if (
        !regla ||
        nutriente.valor == null ||
        !Number.isFinite(valor) ||
        !Number.isFinite(umbralAlto) ||
        umbralAlto < 0
      ) {
        return null
      }

      let nivel = 'ok'
      let etiqueta = 'Dentro del nivel esperado'
      let explicacion = 'El aporte se encuentra por debajo del umbral moderado.'

      if (valor >= umbralAlto) {
        nivel = 'alerta'
        etiqueta = 'Aporte alto'
        explicacion = 'El aporte alcanzó o superó el umbral alto definido para esta receta.'
      } else if (umbralModerado !== null && Number.isFinite(umbralModerado) && valor >= umbralModerado) {
        nivel = 'alerta'
        etiqueta = 'Aporte moderado'
        explicacion = 'El aporte alcanzó el umbral moderado; se recomienda revisar la cantidad.'
      }

      return {
        ...nutriente,
        valor,
        unidad: regla.unidad || (nutriente.clave === 'sodio' ? 'mg' : 'g'),
        nivel,
        etiqueta,
        explicacion,
        umbralModerado,
        umbralAlto,
      }
    })
    .filter(Boolean)

  const hayReglas = reglas && (reglas.sodio || reglas.grasas)

  return (
    <section
      className="nutricion-semaforo w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-emerald-900/60 dark:bg-sazon-verdeNutresaCard sm:p-6"
      aria-labelledby="nutricion-semaforo-titulo"
    >

      <header className="mb-5">
        <p className="mb-1 font-mono-tag text-xs font-bold uppercase tracking-wider text-sazon-verdeHoja">
          Análisis de receta
        </p>
        <h2
          id="nutricion-semaforo-titulo"
          className="nutricion-semaforo__encabezado m-0 font-poppins text-xl font-bold sm:text-2xl"
        >
          {titulo}
        </h2>
        <p className="nutricion-semaforo__ayuda mb-0 mt-2 text-sm">
          Los indicadores se determinan con los umbrales enviados por el servicio de nutrición.
        </p>
      </header>

      {!hayReglas ? (
        <p className="rounded-xl border border-slate-200 p-4 text-sm dark:border-emerald-900/60" role="status">
          No hay reglas de validación nutricional disponibles para esta receta.
        </p>
      ) : indicadores.length === 0 ? (
        <p className="rounded-xl border border-slate-200 p-4 text-sm dark:border-emerald-900/60" role="status">
          Las reglas están disponibles, pero faltan valores o umbrales válidos para mostrar los indicadores.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="list" aria-label="Indicadores de sodio y grasas">
          {indicadores.map((indicador) => (
            <article
              key={indicador.clave}
              className={`nutricion-semaforo__indicador ${indicador.nivel === 'alerta' ? 'nutricion-semaforo-alerta' : 'nutricion-semaforo-ok'
                }`}
              role="listitem"
              aria-label={`${indicador.nombre}: ${indicador.etiqueta}. Valor ${formatoNumero(indicador.valor)} ${indicador.unidad}.`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="m-0 font-poppins text-base font-bold">{indicador.nombre}</h3>
                <span className="nutricion-semaforo__estado inline-flex items-center text-xs">
                  <span className="nutricion-semaforo__punto" aria-hidden="true" />
                  {indicador.etiqueta}
                </span>
              </div>

              <p className="mb-1 font-mono-tag text-2xl font-bold">
                {formatoNumero(indicador.valor)}{' '}
                <span className="text-sm font-medium">{indicador.unidad}</span>
              </p>
              <p className="nutricion-semaforo__ayuda mb-3 text-sm">{indicador.explicacion}</p>

              <dl className="grid grid-cols-2 gap-2 border-t border-current/15 pt-3 text-xs">
                {indicador.umbralModerado !== null && Number.isFinite(indicador.umbralModerado) && (
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
            </article>
          ))}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {indicadores.some((indicador) => indicador.nivel === 'alerta')
          ? 'Se encontraron aportes nutricionales moderados o altos.'
          : indicadores.length > 0
            ? 'Los aportes evaluados están dentro del nivel esperado.'
            : ''}
      </span>
    </section>
  )
}

export default NutricionSemaforo