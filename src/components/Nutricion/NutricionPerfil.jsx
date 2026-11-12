import { useEffect, useState } from 'react'
import { nutricionServicio } from './nutricionServicio'

// Perfil alimentario: chips de restricciones y dietas (HU 4.3.1)
function NutricionPerfil() {
  const [restricciones, setRestricciones] = useState([])
  const [tieneError, setTieneError] = useState(false)

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

  if (tieneError) {
    return <p role="alert">No se pudo cargar tu perfil alimentario.</p>
  }

  return (
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
          >
            {restriccion.nombre}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default NutricionPerfil
