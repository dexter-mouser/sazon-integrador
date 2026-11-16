import { useEffect, useRef, useState } from 'react'
import NutricionSemaforo from './NutricionSemaforo'
import NutricionAvisos from './NutricionAvisos'
import { nutricionServicio, EVENTO_PERFIL_ACTUALIZADO } from './nutricionServicio'

// Tiempo de espera para agrupar varios cambios seguidos en un solo cálculo
const ESPERA_MS = 300

// HU 4.2.3 - Semáforo y avisos sincronizados con el perfil alimentario activo
function NutricionSemaforoSincronizado({ plato = null, totales = null, avisosIniciales = [] }) {
  const [analisis, setAnalisis] = useState(null)
  const [estado, setEstado] = useState('cargando') // cargando | listo | actualizando | error

  const ultimaFirma = useRef(null)
  const idSolicitud = useRef(0)
  const temporizador = useRef(null)

  useEffect(() => {
    let estaVigente = true

    const recalcular = async () => {
      // Cada petición lleva un número; solo la más reciente puede actualizar la vista
      idSolicitud.current += 1
      const miId = idSolicitud.current

      try {
        const resultado = await nutricionServicio.analizarPlatoConPerfil(plato, totales)
        if (!estaVigente || miId !== idSolicitud.current) return

        // Si nada cambió realmente, no se vuelve a pintar la vista
        if (resultado.firma !== ultimaFirma.current) {
          ultimaFirma.current = resultado.firma
          setAnalisis(resultado)
        }
        setEstado('listo')
      } catch (error) {
        console.error('Error al sincronizar las alertas con el perfil:', error)
        if (estaVigente && miId === idSolicitud.current) {
          setEstado('error')
        }
      }
    }

    const programarRecalculo = () => {
      clearTimeout(temporizador.current)
      temporizador.current = setTimeout(recalcular, ESPERA_MS)
    }

    // Disparador: se ejecuta cuando el perfil o las metas cambian
    const alCambiarPerfil = () => {
      setEstado('actualizando')
      programarRecalculo()
    }

    window.addEventListener(EVENTO_PERFIL_ACTUALIZADO, alCambiarPerfil)
    recalcular()

    return () => {
      estaVigente = false
      clearTimeout(temporizador.current)
      window.removeEventListener(EVENTO_PERFIL_ACTUALIZADO, alCambiarPerfil)
    }
  }, [plato, totales])

  if (estado === 'error') {
    return (
      <div className="space-y-4">
        <p
          role="alert"
          className="rounded-xl border border-slate-200 p-4 text-sm dark:border-emerald-900/60"
        >
          No se pudieron actualizar las alertas con tu perfil alimentario. Se muestran las
          recomendaciones por defecto.
        </p>
        <NutricionSemaforo plato={plato} totales={totales} />
        <NutricionAvisos avisos={avisosIniciales} />
      </div>
    )
  }

  if (!analisis) {
    return (
      <p role="status" className="rounded-xl border border-slate-200 p-4 text-sm dark:border-emerald-900/60">
        Cargando alertas nutricionales…
      </p>
    )
  }

  return (
    <div className="space-y-4" aria-busy={estado === 'actualizando'}>
      <NutricionSemaforo
        plato={plato}
        totales={totales}
        reglasNutricionales={analisis.reglas}
      />

      <NutricionAvisos avisos={analisis.avisos} />

      <span className="sr-only" role="status" aria-live="polite">
        {estado === 'actualizando' ? 'Actualizando alertas según tu perfil…' : ''}
      </span>
    </div>
  )
}

export default NutricionSemaforoSincronizado