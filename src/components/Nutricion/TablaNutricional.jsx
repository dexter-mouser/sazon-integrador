import React from 'react';
import { datosNutricionales } from './semillaNutricional';

const TablaNutricional = () => {
  return (
    <div className="w-full max-w-2xl my-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      
      {/* Encabezado Premium */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-poppins font-bold text-gray-800 flex items-center gap-2">
            <span className="text-green-600 text-2xl">📊</span>
            Información Nutricional
          </h3>
          <p className="text-sm text-gray-500 mt-1 font-inter flex items-center gap-1">
            <span className="text-green-500 font-bold">✓</span> Porción: 1 unidad (100g)
          </p>
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
          Análisis en vivo
        </span>
      </div>
      
      {/* Tabla Interactiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">Nutriente</th>
              <th className="px-6 py-4 font-semibold text-right">Cantidad</th>
              <th className="px-6 py-4 font-semibold w-1/3">% Valor Diario*</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {datosNutricionales.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4 text-gray-700 font-medium group-hover:text-gray-900">
                  {item.nutriente}
                </td>
                
                <td className="px-6 py-4 text-right">
                  <span className="text-gray-900 font-bold">{item.valor}</span>
                  <span className="text-xs text-gray-400 ml-1 font-normal">{item.unidad}</span>
                </td>
                
                {/* Barra de progreso (El toque pro) */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${item.color} transition-all duration-1000 ease-out`} 
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">
                      {item.porcentaje}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer de la tabla */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
        <span>ℹ️</span>
        * Los porcentajes se basan en una dieta de 2000 kcal.
      </div>
    </div>
  );
};

export default TablaNutricional;
