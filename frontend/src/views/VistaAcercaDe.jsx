import React from 'react';

export default function VistaAcercaDe({ cambiarVista }) {
  
  const manejarCerrar = () => {
    // Verificamos si existe un token para saber si el usuario tiene sesión iniciada
    const token = localStorage.getItem('token_remude');
    if (token) {
      cambiarVista('panelEntrenador'); // Regresa al dashboard si hay sesión
    } else {
      cambiarVista('inicio'); // Regresa al inicio público si no hay sesión
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-xl animate-fade-in mt-6 mb-6">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
        <h2 className="text-4xl font-black tracking-tight text-[#7a2031]">Acerca de</h2>
        <button 
          onClick={manejarCerrar} 
          className="text-sm font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors"
        >
          Cerrar
        </button>
      </div>
      
      <div className="space-y-8 text-gray-700 font-light text-lg">
        <div>
          <p className="text-2xl font-black text-gray-900 tracking-tight mb-2">REMUDE</p>
          <p className="text-gray-500 text-base leading-relaxed">
            Plataforma integral orientada a servicios para la gestión técnica de atletas, documentos y espacios deportivos en el Municipio de Bacalar.
          </p>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Equipo de Desarrollo</h3>
          <ul className="space-y-3 text-base font-medium text-gray-800">
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#7a2031] mr-3"></span>Victoria Piña Poot</li>
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#7a2031] mr-3"></span>Gerardo Amaro Buitrón</li>
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#7a2031] mr-3"></span>Mayra Liliana Mendoza Chávez</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
