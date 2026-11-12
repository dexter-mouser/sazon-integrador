import './NutricionAvisos.css'

function NutricionAvisos({ avisos = [], titulo = 'Revisa' }) {
  const avisosValidos = Array.isArray(avisos)
    ? avisos.filter((aviso) => aviso && (aviso.mensaje || aviso.sugerencia))
    : []

  return (
    <section
      className="nutricion-aviso-panel w-full"
      aria-labelledby="nutricion-avisos-titulo"
    >
      <header className="nutricion-aviso-panel__encabezado mb-3">
        <h2
          id="nutricion-avisos-titulo"
          className="m-0 font-poppins text-xl font-bold"
        >
          {titulo}
        </h2>
        <p className="nutricion-aviso-panel__descripcion mb-0 mt-1 text-sm">
          Recomendaciones y advertencias según la validación de tus metas nutricionales.
        </p>
      </header>

      {avisosValidos.length === 0 ? (
        <p className="nutricion-aviso-panel__vacio rounded-xl p-4 text-sm" role="status">
          No hay recomendaciones ni advertencias para esta receta.
        </p>
      ) : (
        <div className="nutricion-aviso-panel__lista grid grid-cols-1 gap-3">
          {avisosValidos.map((aviso, indice) => (
            <article
              key={aviso.id || `${aviso.tipo || 'aviso'}-${indice}`}
              className={`nutricion-aviso-card nutricion-aviso-card--${aviso.tipo === 'informacion' ? 'informacion' : 'advertencia'}`}
              role="alert"
              aria-live="assertive"
            >
              <div className="nutricion-aviso-card__contenido">
                <span className="nutricion-aviso-card__icono" aria-hidden="true">
                  {aviso.tipo === 'informacion' ? 'ℹ' : '⚠'}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="nutricion-aviso-card__titulo mb-1 mt-0 font-poppins text-base font-bold">
                    {aviso.titulo || 'Revisa esta receta'}
                  </h3>

                  {aviso.mensaje && (
                    <p className="nutricion-aviso-card__mensaje mb-2 mt-0 text-sm">
                      {aviso.mensaje}
                    </p>
                  )}

                  {aviso.sugerencia && (
                    <p className="nutricion-aviso-card__sugerencia mb-0 mt-0 text-sm">
                      <strong>Sugerencia:</strong> {aviso.sugerencia}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default NutricionAvisos
