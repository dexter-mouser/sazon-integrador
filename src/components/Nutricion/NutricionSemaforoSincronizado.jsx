import { useEffect, useRef, useState } from 'react'
import NutricionSemaforo from './NutricionSemaforo'
import NutricionAvisos from './NutricionAvisos'
import { nutricionServicio, EVENTO_PERFIL_ACTUALIZADO } from './nutricionServicio'

// Espera antes de recalcular, para juntar varios clics seguidos en un solo cálculo
const ESPERA_MS = 300

// HU 4.2.3 - Semáforo y avisos que se actualizan solos cuando cambia el perfil
function NutricionSemaforoSincronizado({ plato = null, totales = null, avisosIniciales = [] }) {
  const [analisis, setAnalisis] = useState(null)
  const [estado, setEstado] = useState('cargando') // cargando | listo | actualizando | error

  // Cuenta las peticiones: solo la última puede cambiar la pantalla
  const numeroDeSolicitud = useRef(0)
  const temporizador = useRef(null)

  useEffect(() => {
    let componenteActivo = true

    // Pide al servicio el análisis y guarda el resultado
    async function recalcular() {
      numeroDeSolicitud.current += 1
      const miNumero = numeroDeSolicitud.current

      try {
        const resultado = await nutricionServicio.analizarPlatoConPerfil(plato, totales)

        // Si el componente se cerró o llegó una respuesta más nueva, esta se ignora
        const esRespuestaVieja = miNumero !== numeroDeSolicitud.current
        if (!componenteActivo || esRespuestaVieja) return

        // Si el resultado es igual al anterior, se deja el anterior (no se repinta)
        setAnalisis((anterior) =>
          anterior && anterior.firma === resultado.firma ? anterior : resultado
        )
        setEstado('listo')
      } catch (error) {
        console.error('Error al sincronizar las alertas con el perfil:', error)
        if (componenteActivo && miNumero === numeroDeSolicitud.current) {
          setEstado('error')
        }
      }
    }

    // Se ejecuta cuando el perfil o las metas cambian
    function alCambiarPerfil() {
      setEstado('actualizando')
      clearTimeout(temporizador.current)
      temporizador.current = setTimeout(recalcular, ESPERA_MS)
    }

    window.addEventListener(EVENTO_PERFIL_ACTUALIZADO, alCambiarPerfil)
    recalcular() // primer cálculo al cargar la página

    // Al cerrar el componente se limpia todo
    return () => {
      componenteActivo = false
      clearTimeout(temporizador.current)
      window.removeEventListener(EVENTO_PERFIL_ACTUALIZADO, alCambiarPerfil)
    }
  }, [plato, totales])

  // Si algo falló, se muestran los avisos por defecto
  if (estado === 'error') {
    return (
      <div className="space-y-4">
        <p role="alert" className="nutricion-semaforo__aviso text-sm">
          No se pudieron actualizar las alertas con tu perfil alimentario. Se muestran las
          recomendaciones por defecto.
        </p>
        <NutricionSemaforo plato={plato} totales={totales} />
        <NutricionAvisos avisos={avisosIniciales} />
      </div>
    )
  }

  // Primera carga
  if (!analisis) {
    return (
      <p role="status" className="nutricion-semaforo__aviso text-sm">
        Cargando alertas nutricionales…
      </p>
    )
  }

  return (
    <div className="space-y-4" aria-busy={estado === 'actualizando'}>
      {/* Se ve mientras actualiza; el resto del tiempo solo lo lee el lector de pantalla */}
      <p
        role="status"
        className={estado === 'actualizando' ? 'nutricion-semaforo__ayuda text-sm' : 'sr-only'}
      >
        {estado === 'actualizando' ? 'Actualizando alertas según tu perfil…' : ''}
      </p>

      <NutricionSemaforo
        plato={plato}
        totales={totales}
        reglasNutricionales={analisis.reglas}
      />

      <NutricionAvisos avisos={analisis.avisos} />
    </div>
  )
}

export default NutricionSemaforoSincronizado