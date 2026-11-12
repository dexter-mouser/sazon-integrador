import { useEffect, useState } from 'react'
import { nutricionServicio } from './nutricionServicio'

// Perfil alimentario: chips de restricciones y dietas (HU 4.3.1 y 4.3.2)
function NutricionPerfil() {
  const [restricciones, setRestricciones] = useState([])
  const [tieneError, setTieneError] = useState(false)
  const [idGuardando, setIdGuardando] = useState(null)
  const [avisoError, setAvisoError] = useState('')

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datos = await nutricionServicio.obtenerPerfilAlimentario()
        setRestricciones(Array.isArray(datos) ? datos : [])
      } catch (error) {
        console.error('Error al cargar el perfil alimentario:', error)
        setTieneError(true)
      }
    }
    cargarPerfil()
  }, [])

  const cambiarEstado = (idRestriccion, estaActivo) => {
    setRestricciones((anteriores) =>
      anteriores.map((item) =>
        item.id === idRestriccion ? { ...item, estaActivo } : item
      )
    )
  }

  // Cambio visual inmediato; si el servicio falla, se revierte
  const alternarRestriccion = async (restriccion) => {
    const nuevoEstado = !restriccion.estaActivo
    setAvisoError('')
    setIdGuardando(restriccion.id)
    cambiarEstado(restriccion.id, nuevoEstado)

    try {
      await nutricionServicio.actualizarPerfilAlimentario(restriccion.id, nuevoEstado)
    } catch (error) {
      console.error('Error al actualizar el perfil alimentario:', error)
      cambiarEstado(restriccion.id, restriccion.estaActivo)
      setAvisoError('No se pudo guardar el cambio. Intenta de nuevo.')
    } finally {
      setIdGuardando(null)
    }
  }

  if (tieneError) {
    return <p role="alert">No se pudo cargar tu perfil alimentario.</p>
  }

  return (
    <>
      <ul className="nutricion-perfil-lista" aria-label="Restricciones y dietas">
        {restricciones.map((restriccion) => (
          <li key={restriccion.id}>
            <button
              type="button"
              className={
                restriccion.estaActivo
                  ? 'nutricion-perfil-chip nutricion-perfil-chip--activo'
                  : 'nutricion-perfil-chip'
              }
              aria-pressed={restriccion.estaActivo}
              disabled={idGuardando === restriccion.id}
              onClick={() => alternarRestriccion(restriccion)}
            >
              {restriccion.nombre}
            </button>
          </li>
        ))}
      </ul>
      {avisoError && <p role="alert">{avisoError}</p>}
    </>
  )
}

export default NutricionPerfil
