import './NutricionAvisos.css'

// Datos de cada tipo de aviso
const TIPOS = {
  advertencia: { simbolo: '⚠', nombre: 'Advertencia', rol: 'alert' },
  informacion: { simbolo: 'ℹ', nombre: 'Información', rol: 'status' },
}

// Una tarjeta de aviso
function TarjetaAviso({ aviso, id }) {
  const tipo = aviso.tipo === 'informacion' ? 'informacion' : 'advertencia'
  const { simbolo, nombre, rol } = TIPOS[tipo]
  const idTitulo = `nutricion-aviso-titulo-${id}`

  return (
    <article
      className={`nutricion-aviso-card nutricion-aviso-card--${tipo}`}
      role={rol}
      aria-labelledby={idTitulo}
    >
      {/* El icono es decorativo; el lector de pantalla lee el texto oculto del título */}
      <span className="nutricion-aviso-card__icono" aria-hidden="true">
        {simbolo}
      </span>

      <div className="nutricion-aviso-card__texto">
        <h4 id={idTitulo} className="nutricion-aviso-card__titulo font-poppins">
          <span className="sr-only">{nombre}: </span>
          {aviso.titulo || 'Revisa esta receta'}
        </h4>

        {aviso.mensaje && <p className="nutricion-aviso-card__mensaje">{aviso.mensaje}</p>}

        {aviso.sugerencia && (
          <p className="nutricion-aviso-card__sugerencia">
            <strong>Sugerencia:</strong> {aviso.sugerencia}
          </p>
        )}
      </div>
    </article>
  )
}

// Panel con todos los avisos
function NutricionAvisos({ avisos = [], titulo = 'Revisa' }) {
  // Solo se muestran los avisos que tengan mensaje o sugerencia
  const avisosValidos = Array.isArray(avisos)
    ? avisos.filter((aviso) => aviso && (aviso.mensaje || aviso.sugerencia))
    : []

  return (
    <section className="nutricion-aviso-panel" aria-labelledby="nutricion-avisos-titulo">
      <header className="nutricion-aviso-panel__encabezado">
        <h3 id="nutricion-avisos-titulo" className="font-poppins">
          {titulo}
        </h3>
        <p className="nutricion-aviso-panel__descripcion">
          Recomendaciones y advertencias según tu perfil alimentario y tus metas.
        </p>
      </header>

      {avisosValidos.length === 0 ? (
        <p className="nutricion-aviso-panel__vacio" role="status">
          No hay recomendaciones ni advertencias para esta receta.
        </p>
      ) : (
        <div className="nutricion-aviso-panel__lista">
          {avisosValidos.map((aviso, indice) => (
            <TarjetaAviso
              key={aviso.id || indice}
              id={aviso.id || indice}
              aviso={aviso}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default NutricionAvisos