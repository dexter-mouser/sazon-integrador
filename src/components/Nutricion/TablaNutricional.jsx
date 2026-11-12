import React from 'react';
import { datosNutricionales } from './semillaNutricional';

const TablaNutricional = () => {
  return (
    <div className="w-full max-w-2xl my-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.2)]">
      
      <div className="bg-gradient-to-r from-emerald-50 via-white to-white px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-1">Análisis Nutricional</p>
          <h3 className="text-2xl font-poppins font-black text-gray-800 flex items-center gap-3 tracking-tight">
            Galletas Integrales Sazón
          </h3>
          <p className="text-sm text-gray-500 mt-2 font-inter flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Porción: 1 unidad (100g)
          </p>
        </div>
        <div>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-2 rounded-full border border-emerald-200">
            Análisis en vivo
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/30 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 font-bold tracking-wider">Nutriente</th>
              <th className="px-8 py-4 font-bold text-right tracking-wider">Cantidad</th>
              <th className="px-8 py-4 font-bold w-1/3 tracking-wider">% Valor Diario*</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {datosNutricionales.map((item) => (
              <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                <td className="px-8 py-5 text-gray-700 font-semibold group-hover:text-emerald-700 transition-colors">
                  {item.nutriente}
                </td>
                <td className="px-8 py-5 text-right">
                  <span className="text-gray-900 text-lg font-black font-poppins">{item.valor}</span>
                  <span className="text-xs text-gray-400 ml-1 font-medium">{item.unidad}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div 
                        className={`h-2.5 rounded-full ${item.color} transition-all duration-1000 ease-out`} 
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-500 w-10 text-right">
                      {item.porcentaje}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500 uppercase mr-2">Contiene:</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">Gluten</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">Leche</span>
        </div>
        <button className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
          <span>+</span> Agregar al perfil
        </button>
      </div>
      
      <div className="bg-white px-8 py-3 text-[11px] text-gray-400 flex items-center gap-2 font-medium">
        <span className="text-emerald-500">ℹ️</span>
        * Los porcentajes se basan en una dieta de 2000 kcal. Los valores pueden variar.
      </div>

    </div>
  );
};

export default TablaNutricional;
