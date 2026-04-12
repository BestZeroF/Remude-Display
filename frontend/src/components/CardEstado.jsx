import React from 'react';
import { ChevronRight, Edit, FileText } from 'lucide-react';

export default function CardEstado(props) {
  const { titulo, cantidad, colorFondo, colorTexto, atletas, onClickAtleta } = props;
  const Icono = props.icono;

  return (
    <div className={`${colorFondo} ${colorTexto} rounded-3xl p-6 shadow-xl flex flex-col h-80 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative z-0 hover:z-10`}>
      {/* Forzamos a que la barra de scroll de esta tarjeta sea visible siempre con un estilo incrustado */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; display: block; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.25); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }
      `}</style>

      <div className="flex justify-between items-start mb-4 shrink-0">
        <div>
          <h3 className="text-lg font-bold opacity-90">{titulo}</h3>
          <p className="text-4xl font-black mt-1">{cantidad}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs">
          <Icono className="w-6 h-6" />
        </div>
      </div>
      
      {/* Fondo translúcido (Glassmorphism original), SIN bordes */}
      <div className="mt-auto bg-white/10 rounded-2xl p-4 flex-1 overflow-hidden flex flex-col">
        <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-90 text-white">Últimos registros</h4>
        
        {/* overflow-y-scroll para que la barra siempre sea visible */}
        <ul className="space-y-2.5 overflow-y-scroll pr-2 custom-scrollbar flex-1">
          {(!atletas || atletas.length === 0) ? (
            <li className="text-sm opacity-80 italic font-medium text-center mt-4 text-white">No hay registros</li>
          ) : (
            atletas.map((atleta) => (
              <li 
                key={atleta.id_atleta || atleta.id} 
                // La "pastilla" blanca, sin bordes, con una sombra suave
                className="flex justify-between items-center group bg-white hover:bg-gray-50 p-2.5 rounded-xl transition-all cursor-pointer shadow-sm" 
                onClick={() => onClickAtleta && onClickAtleta(atleta)}
              >
                <span className="text-xs font-bold text-gray-800 truncate pr-2 group-hover:text-[#7a2031] transition-colors" title={atleta.nombre_completo || atleta.nombre}>
                  {atleta.nombre_completo || atleta.nombre}
                </span>
                
                <div className="flex items-center space-x-1.5 shrink-0">
                  {/* Botón Ficha (Sin bordes, resalta al hacer hover) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); alert('Editar ficha técnica'); }}
                    className="p-1.5 bg-gray-50 rounded-lg text-gray-500 hover:text-[#7a2031] hover:bg-red-50 transition-colors relative"
                    title="Ficha técnica"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span className={`absolute -top-1.5 -right-1.5 text-[8px] font-black px-1 rounded-sm shadow-sm ${atleta.progreso_ficha === 100 ? 'bg-green-500 text-white' : 'bg-amber-400 text-amber-950'}`}>
                      {atleta.progreso_ficha || 0}%
                    </span>
                  </button>
                  
                  {/* Botón Docs (Sin bordes, resalta al hacer hover) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); alert('Subir documentos del expediente'); }}
                    className="p-1.5 bg-gray-50 rounded-lg text-gray-500 hover:text-[#c2a649] hover:bg-yellow-50 transition-colors relative"
                    title="Expediente de documentos"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className={`absolute -top-1.5 -right-1.5 text-[8px] font-black px-1 rounded-sm shadow-sm ${atleta.progreso_docs === 100 ? 'bg-green-500 text-white' : 'bg-amber-400 text-amber-950'}`}>
                      {atleta.progreso_docs || 0}%
                    </span>
                  </button>
                  
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#7a2031] transition-colors ml-1" />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}