import { useEffect, useState } from 'react'
import { nutricionServicio, calcularProgresoCalorias } from './nutricionServicio'
import NutricionMetaBarra from './NutricionMetaBarra'

const formatoNumero = (valor) => new Intl.NumberFormat('es-CO').format(valor)

const MENSAJES_ESTADO = {
  'en-curso': 'Vas bien: todavía tienes margen para tus próximas comidas.',
  cerca: 'Estás cerca de tu meta diaria. Elige porciones ligeras para lo que queda del día.',
  cumplida: 'Alcanzaste exactamente tu meta diaria de calorías.',
  excedida: 'Superaste tu meta diaria de calorías. Tenlo en cuenta en tu próxima comida.',
}

// Metas diarias de calorías: resumen de meta y consumo (HU 4.5.1),
// barra de progreso (HU 4.5.2) y validación de los datos (HU 4.5.3)
function NutricionMetas() {
  const [resumen, setResumen] = useState(null)
  const [estadoCarga, setEstadoCarga] = useState('cargando')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let estaVigente = true

    const cargarResumen = async () => {
      try {
        const datos = await nutricionServicio.obtenerResumenMetaDiaria()
        if (!estaVigente) return
        setResumen(datos)
        setEstadoCarga('listo')
      } catch (error) {
        console.error('Error al cargar las metas diarias:', error)
        if (estaVigente) setEstadoCarga('error')
      }
    }
    cargarResumen()

    return () => {
      estaVigente = false
    }
  }, [intento])

  // Vuelve a leer la meta, por ejemplo después de guardarla en el perfil
  const actualizar = () => {
    setEstadoCarga('cargando')
    setIntento((anterior) => anterior + 1)
  }

  const botonActualizar = (
    <button
      type="button"
      className="nutricion-meta-boton"
      onClick={actualizar}
      disabled={estadoCarga === 'cargando'}
    >
      {estadoCarga === 'cargando' ? 'Actualizando…' : 'Actualizar'}
    </button>
  )

  if (estadoCarga === 'error') {
    return (
      <div className="nutricion-meta-panel nutricion-meta-panel--error">
        <p role="alert" className="nutricion-meta-aviso">
          No se pudieron cargar tus metas diarias.
        </p>
        {botonActualizar}
      </div>
    )
  }

  if (!resumen) {
    return (
      <p role="status" className="nutricion-meta-panel">
        Cargando tus metas diarias…
      </p>
    )
  }

  const progreso = calcularProgresoCalorias(resumen.metaCalorias, resumen.caloriasConsumidas)

  if (!progreso.esValido) {
    return (
      <div className="nutricion-meta-panel nutricion-meta-panel--error">
        <p role="alert" className="nutricion-meta-aviso">
          Los datos de tu meta diaria no son válidos. Revisa tu meta de calorías en el perfil
          alimentario.
        </p>
        {botonActualizar}
      </div>
    )
  }

  const comidas = Array.isArray(resumen.comidas) ? resumen.comidas : []
  const seExcedio = progreso.estado === 'excedida'

  return (
    <div className={`nutricion-meta-panel nutricion-meta-panel--${progreso.estado}`}>
      <dl className="nutricion-meta-resumen">
        <div className="nutricion-meta-dato">
          <dt>Meta diaria</dt>
          <dd>
            {formatoNumero(progreso.meta)} <span className="nutricion-meta-unidad">kcal</span>
          </dd>
        </div>
        <div className="nutricion-meta-dato">
          <dt>Consumido hoy</dt>
          <dd>
            {formatoNumero(progreso.consumidas)} <span className="nutricion-meta-unidad">kcal</span>
          </dd>
        </div>
        <div
          className={
            seExcedio ? 'nutricion-meta-dato nutricion-meta-dato--excedido' : 'nutricion-meta-dato'
          }
        >
          <dt>{seExcedio ? 'Excedente' : 'Restante'}</dt>
          <dd>
            {formatoNumero(seExcedio ? progreso.excedente : progreso.restantes)}{' '}
            <span className="nutricion-meta-unidad">kcal</span>
          </dd>
        </div>
      </dl>

      <NutricionMetaBarra progreso={progreso} />

      <p role="status" className="nutricion-meta-aviso">
        {MENSAJES_ESTADO[progreso.estado]}
      </p>

      <h3 className="nutricion-meta-subtitulo">Consumo de hoy</h3>
      {comidas.length === 0 ? (
        <p className="nutricion-meta-nota">Aún no has registrado comidas hoy.</p>
      ) : (
        <ul className="nutricion-meta-comidas">
          {comidas.map((comida) => (
            <li key={comida.id} className="nutricion-meta-comida">
              <span>
                <strong>{comida.momento}</strong>
                <span className="nutricion-meta-comida-detalle">{comida.descripcion}</span>
              </span>
              <span className="nutricion-meta-comida-calorias">
                {formatoNumero(comida.calorias)} kcal
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="nutricion-meta-pie">
        <p className="nutricion-meta-nota">
          {resumen.esMetaPersonalizada
            ? 'Meta tomada de tu perfil alimentario.'
            : 'Meta por defecto. Guarda tus calorías objetivo en el perfil alimentario y pulsa Actualizar.'}
        </p>
        {botonActualizar}
      </div>
    </div>
  )
}

export default NutricionMetas
