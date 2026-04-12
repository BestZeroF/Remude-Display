import React from 'react';
import { ArrowLeft, Download, Edit, CheckCircle } from 'lucide-react';

// Se eliminó 'idAtleta' de las propiedades para evitar la advertencia de ESLint
export default function VistaPerfilAtleta({ cambiarVistaPanel }) {
  
  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in pb-10 flex flex-col h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-2">
      
      {/* HEADER DE LA FICHA */}
      <div className="flex justify-between items-center mb-8 mt-2">
        <div className="flex items-center">
          <button onClick={() => cambiarVistaPanel('delegacion')} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow mr-4 text-gray-500 hover:text-gray-900 border border-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-[#7a2031] tracking-tight">Ficha técnica</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Expediente oficial</p>
          </div>
        </div>
        
        {/* Estatus Badge (Basado en la captura) */}
        <div className="flex items-center px-4 py-2 bg-green-50 text-green-800 rounded-full border border-green-200 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-xs font-bold uppercase tracking-widest">Validado oficialmente</span>
        </div>
      </div>

      {/* GRID PRINCIPAL (En construcción) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (Foto y acciones) */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gray-900 text-white flex items-center justify-center text-4xl font-black shadow-inner mb-4">
              G
            </div>
            <h3 className="text-2xl font-black text-gray-900">Gerardo</h3>
            <p className="text-gray-500 font-medium">Amaro</p>
            <span className="mt-3 px-4 py-1 bg-[#7a2031] text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Deportista</span>
          </div>

          <button className="w-full bg-gray-900 text-white rounded-xl py-4 flex justify-center items-center font-bold shadow-md hover:bg-gray-800 transition-colors">
            <Download className="w-5 h-5 mr-2" /> Descargar ficha PDF
          </button>

          <button className="w-full bg-white text-[#7a2031] border border-[#7a2031]/20 rounded-xl py-4 flex justify-center items-center font-bold shadow-sm hover:bg-red-50 transition-colors">
            <Edit className="w-5 h-5 mr-2" /> Editar información
          </button>
        </div>

        {/* Columna Derecha (Datos estructurados) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-75 text-gray-400 font-medium">
            (Módulos de información en construcción...)
          </div>
        </div>

      </div>
    </div>
  );
}
