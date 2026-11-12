import { useState } from 'react'

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

  function alternar(nombre) {
    if (activos.includes(nombre)) {
      setActivos(activos.filter((item) => item !== nombre))
    } else {
      setActivos([...activos, nombre])
    }
  }

  return (
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
  )
}

export default FiltrosRestriccion
