// Barra de progreso de calorías frente a la meta diaria (HU 4.5.2)
const ETIQUETAS_ESTADO = {
  'en-curso': 'En curso',
  cerca: 'Cerca de la meta',
  cumplida: 'Meta cumplida',
  excedida: 'Meta superada',
}

const formatoNumero = (valor) => new Intl.NumberFormat('es-CO').format(valor)

function NutricionMetaBarra({ progreso }) {
  const { meta, consumidas, porcentaje, porcentajeBarra, estado } = progreso

  return (
    <div className="nutricion-meta-barra">
      <div className="nutricion-meta-barra-encabezado">
        <span id="nutricion-meta-barra-titulo">Progreso de calorías</span>
        <span className="nutricion-meta-barra-estado">
          <span className="nutricion-meta-barra-punto" aria-hidden="true" />
          {ETIQUETAS_ESTADO[estado]} · {porcentaje}%
        </span>
      </div>

      <div
        className="nutricion-meta-barra-pista"
        role="progressbar"
        aria-labelledby="nutricion-meta-barra-titulo"
        aria-valuemin={0}
        aria-valuemax={meta}
        aria-valuenow={Math.min(consumidas, meta)}
        aria-valuetext={`${formatoNumero(consumidas)} de ${formatoNumero(meta)} kcal, ${porcentaje}%. ${ETIQUETAS_ESTADO[estado]}.`}
      >
        <div className="nutricion-meta-barra-relleno" style={{ width: `${porcentajeBarra}%` }} />
      </div>

      <div className="nutricion-meta-barra-escala" aria-hidden="true">
        <span>0 kcal</span>
        <span>{formatoNumero(meta)} kcal</span>
      </div>
    </div>
  )
}

export default NutricionMetaBarra
