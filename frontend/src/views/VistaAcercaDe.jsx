import React from 'react';

export default function VistaAcercaDe({ cambiarVista }) {
  return (
    <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-xl animate-fade-in">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
        <h2 className="text-4xl font-black tracking-tight text-[#7a2031]">Acerca de</h2>
        <button onClick={() => cambiarVista('inicio')} className="text-sm font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">
          Cerrar
        </button>
      </div>
      <div className="space-y-8 text-gray-700 font-light text-lg">
        <div>
          <p className="text-2xl font-black text-gray-900 tracking-tight">REMUDE</p>
          <p className="text-gray-500 mt-2">Plataforma integral orientada a servicios para la gestión técnica de atletas, documentos y espacios deportivos en el Municipio de Bacalar.</p>
        </div>
      </div>
    </div>
  );
}
