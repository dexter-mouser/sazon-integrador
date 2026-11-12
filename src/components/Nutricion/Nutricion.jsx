// Página Nutrición y Perfiles (Célula 4)
// Cada persona trabaja solo dentro de su bloque numerado.
import './nutricion.css'
import NutricionPerfil from './NutricionPerfil'
import NutricionPerfilFormulario from './NutricionPerfilFormulario'

import NutricionSemaforo from "./NutricionSemaforo";
import { datosNutricionalesEjemplo } from "./datosNutricionales";

function Nutricion() {
  return (
    <section className="space-y-8">
      <h1 className="font-poppins font-black text-2xl sm:text-4xl tracking-tight m-0">
        Nutrición y Perfiles
      </h1>

      {/* 1 - Santiago Padilla: Tabla nutricional por porción y macronutrientes
          HU 4.1.1 Renderizado de la tabla nutricional (feature/nutricion/G4-TAB-F01-listado)
          HU 4.1.2 Formateo de valores y unidades (feature/nutricion/G4-TAB-F02-formato)
          HU 4.1.3 Semilla de datos nutricionales (feature/nutricion/G4-TAB-F03-semilla) */}
      <article id="nutricion-tabla">
        <h2>Tabla nutricional por porción</h2>
      </article>
      {/* Fin 1 */}

      {/* 2 - Juan Camilo Valencia Estrada: Semáforo de aportes y alertas
          HU 4.2.1 Semáforo de aportes nutricionales (feature/nutricion/G4-SEM-F01-indicadores)
          HU 4.2.2 Panel de recomendaciones "Revisa" (feature/nutricion/G4-SEM-F02-recomendacion)
          HU 4.2.3 Sincronización con el perfil activo (feature/nutricion/G4-SEM-F03-sincronizar) */}
      <article id="nutricion-semaforo">
        <h2>Semáforo de aportes</h2>
        <NutricionSemaforo
          plato={datosNutricionalesEjemplo.plato}
          totales={datosNutricionalesEjemplo.totales}
        />
      </article>
      {/* Fin 2 */}

      {/* 3 - José Manuel Botero Giraldo :D: Perfil alimentario (chips de restricciones y dietas)
          HU 4.3.1 Chips del perfil alimentario (feature/nutricion/G4-PER-F01-chips)
          HU 4.3.2 Activar o desactivar restricciones (feature/nutricion/G4-PER-F02-interaccion)
          HU 4.3.3 Formulario de configuración avanzada (feature/nutricion/G4-PER-F03-formulario) */}
      <article id="nutricion-perfil">
        <h2>Perfil alimentario</h2>
        <NutricionPerfil />
        <NutricionPerfilFormulario />
      </article>
      {/* Fin 3 */}

      {/* 4 - Jose David Correa Builes: Filtros por restricción nutricional
          HU 4.4.1 Interfaz de filtros (feature/nutricion/G4-FIL-F01-interfaz)
          HU 4.4.2 Lógica de filtrado reactivo (feature/nutricion/G4-FIL-F02-logica)
          HU 4.4.3 Validación cruzada de ingredientes (feature/nutricion/G4-FIL-F03-validacion-cruzada) */}
      <article id="nutricion-filtros">
        <h2>Filtros por restricción</h2>
      </article>
      {/* Fin 4 */}

      {/* 5 - José David Valencia Martínez: Metas diarias de calorías
          HU 4.5.1 Resumen de meta diaria y consumo (feature/nutricion/G4-MET-F01-resumen)
          HU 4.5.2 Barra de progreso de calorías (feature/nutricion/G4-MET-F02-barra)
          HU 4.5.3 Validación integral del módulo (feature/nutricion/G4-MET-F03-validacion) */}
      <article id="nutricion-metas">
        <h2>Metas diarias</h2>
      </article>
      {/* Fin 5 */}
    </section>
  )
}

export default Nutricion