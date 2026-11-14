import { useEffect, useState } from 'react'
import { nutricionServicio } from './nutricionServicio'

const RESTRICCIONES = [
  'Sin lactosa',
  'Sin gluten',
  'Bajo en sodio',
  'Vegetariano',
  'Vegano',
  'Bajo en azúcar'
]

function FiltrosRestriccion() {
  const [activos, setActivos] = useState([])
  const [recetas, setRecetas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [perfil, setPerfil] = useState([])

  function alternar(nombre) {
    if (activos.includes(nombre)) {
      setActivos(activos.filter((item) => item !== nombre))
    } else {
      setActivos([...activos, nombre])
    }
  }

  useEffect(() => {
    async function cargarRecetas() {
      try {
        const resultado = await nutricionServicio.obtenerRecetasPorRestricciones(activos)
        const restriccionesPerfil = await nutricionServicio.obtenerPerfilAlimentario()
        setRecetas(resultado)
        setPerfil(restriccionesPerfil.filter((item) => item.estaActivo))
      } catch {
        setRecetas([])
        setPerfil([])
      }
      setCargando(false)
    }
    cargarRecetas()
  }, [activos])

  return (
    <div className="space-y-4">
      <div
        role="group"
        aria-label="Filtros por restricción"
        className="flex flex-wrap gap-2"
      >
        {RESTRICCIONES.map((nombre) => {
          const activo = activos.includes(nombre)

          return (
            <button
              key={nombre}
              type="button"
              aria-pressed={activo}
              onClick={() => alternar(nombre)}
              className={
                activo
                  ? 'nutricion-filtro-btn px-4 py-2 rounded-full border cursor-pointer bg-sazon-verdeHondo border-sazon-verdeHondo text-white in-[.dark]:bg-sazon-verdeNeon in-[.dark]:border-sazon-verdeNeon in-[.dark]:text-sazon-verdeNoche'
                  : 'nutricion-filtro-btn px-4 py-2 rounded-full border cursor-pointer bg-white border-slate-400 text-slate-700 in-[.dark]:bg-sazon-verdeNutresaCard in-[.dark]:border-white/40 in-[.dark]:text-white'
              }
            >
              {activo ? '✓ ' : ''}
              {nombre}
            </button>
          )
        })}
      </div>
      {!cargando && recetas.length === 0 ? (
        <p
          role="alert"
          className="nutricion-filtro-vacio p-4 rounded-2xl border bg-white border-slate-400 text-slate-700 in-[.dark]:bg-sazon-verdeNutresaCard in-[.dark]:border-white/40 in-[.dark]:text-white"
        >
          Ninguna receta cumple con todos los filtros que elegiste. Prueba quitando alguno.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recetas.map((receta) => {
            const advertencias = perfil.filter(
              (item) => !receta.restricciones.includes(item.nombre)
            )

            return (
              <li
                key={receta.id}
                className="nutricion-filtro-receta p-4 rounded-2xl border bg-white border-slate-400 in-[.dark]:bg-sazon-verdeNutresaCard in-[.dark]:border-white/40"
              >
                <h3 className="font-bold text-slate-900 in-[.dark]:text-white">
                  {receta.nombre}
                </h3>
                <p className="text-sm text-slate-700 in-[.dark]:text-white">
                  {receta.descripcion}
                </p>
                <p className="text-xs text-slate-600 in-[.dark]:text-sazon-verdeNeon">
                  {receta.restricciones.join(' · ')}
                </p>
                {advertencias.map((item) => (
                  <p
                    key={item.id}
                    className="nutricion-filtro-advertencia inline-block mt-2 mr-2 px-2 py-1 rounded-full text-xs font-bold bg-sazon-brandZenu text-white"
                  >
                    ⚠ No apta para tu perfil: {item.nombre}
                  </p>
                ))}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default FiltrosRestriccion
