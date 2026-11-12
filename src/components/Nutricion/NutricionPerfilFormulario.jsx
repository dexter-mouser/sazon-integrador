import { useState } from 'react'
import { nutricionServicio, LIMITES_METAS } from './nutricionServicio'

const METAS_INICIALES = { caloriasObjetivo: 2000, sodioMaximo: 1500, notas: '' }

// Formulario de metas nutricionales y restricciones detalladas (HU 4.3.3)
function NutricionPerfilFormulario() {
  const [metas, setMetas] = useState(METAS_INICIALES)
  const [estaGuardando, setEstaGuardando] = useState(false)
  const [aviso, setAviso] = useState({ tipo: '', texto: '' })

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target
    setMetas((anteriores) => ({ ...anteriores, [name]: value }))
  }

  const enviarFormulario = async (evento) => {
    evento.preventDefault()
    setAviso({ tipo: '', texto: '' })
    setEstaGuardando(true)

    try {
      await nutricionServicio.guardarMetasNutricionales(metas)
      setAviso({ tipo: 'exito', texto: 'Tus metas nutricionales se guardaron.' })
    } catch (error) {
      console.error('Error al guardar las metas nutricionales:', error)
      setAviso({ tipo: 'error', texto: 'No se pudieron guardar tus metas. Revisa los valores.' })
    } finally {
      setEstaGuardando(false)
    }
  }

  return (
    <form className="nutricion-perfil-form" onSubmit={enviarFormulario}>
      <fieldset className="nutricion-perfil-form-grupo">
        <legend>Metas nutricionales</legend>

        <label htmlFor="nutricion-calorias-objetivo">Calorías objetivo por día (kcal)</label>
        <input
          id="nutricion-calorias-objetivo"
          name="caloriasObjetivo"
          type="number"
          min={LIMITES_METAS.caloriasMin}
          max={LIMITES_METAS.caloriasMax}
          step="1"
          required
          value={metas.caloriasObjetivo}
          onChange={actualizarCampo}
        />

        <label htmlFor="nutricion-sodio-maximo">Sodio máximo por día (mg)</label>
        <input
          id="nutricion-sodio-maximo"
          name="sodioMaximo"
          type="number"
          min={LIMITES_METAS.sodioMin}
          max={LIMITES_METAS.sodioMax}
          step="1"
          required
          value={metas.sodioMaximo}
          onChange={actualizarCampo}
        />
      </fieldset>

      <fieldset className="nutricion-perfil-form-grupo">
        <legend>Restricciones detalladas</legend>

        <label htmlFor="nutricion-notas">Alergias u observaciones (opcional)</label>
        <textarea
          id="nutricion-notas"
          name="notas"
          rows="3"
          maxLength={LIMITES_METAS.notasMax}
          value={metas.notas}
          onChange={actualizarCampo}
        />
      </fieldset>

      <button type="submit" className="nutricion-perfil-form-boton" disabled={estaGuardando}>
        {estaGuardando ? 'Guardando…' : 'Guardar metas'}
      </button>

      {aviso.texto && (
        <p role="alert" className={`nutricion-perfil-aviso nutricion-perfil-aviso--${aviso.tipo}`}>
          {aviso.texto}
        </p>
      )}
    </form>
  )
}

export default NutricionPerfilFormulario
