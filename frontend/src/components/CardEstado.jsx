import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CardEstado(props) {
  const { titulo, cantidad, colorFondo, colorTexto, atletas, onClickAtleta } = props;
  const Icono = props.icono;

  return (
    <div className={`${colorFondo} ${colorTexto} rounded-3xl p-6 shadow-xl flex flex-col h-80 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative z-0 hover:z-10`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; display: block; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.6); }
      `}</style>

      <div className="flex justify-between items-start mb-4 shrink-0">
        <div>
          <h3 className="text-lg font-bold opacity-90">{titulo}</h3>
          <p className="text-4xl font-black mt-1">{cantidad}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs shadow-sm">
          <Icono className="w-6 h-6" />
        </div>
      </div>
      
      <div className="mt-auto bg-black/10 rounded-2xl p-4 flex-1 overflow-hidden flex flex-col border border-white/10 shadow-inner">
        <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-90 text-white/80">Últimos registros</h4>
        <ul className="space-y-2.5 overflow-y-scroll pr-2 custom-scrollbar flex-1">
          {(!atletas || atletas.length === 0) ? (
            <li className="text-sm opacity-80 italic font-medium text-center mt-4 text-white">No hay registros</li>
          ) : (
            atletas.map((atleta) => (
              <li 
                key={atleta.id_atleta || atleta.id} 
                className="flex justify-between items-center group bg-white hover:bg-gray-50 p-3 rounded-xl transition-all cursor-pointer border border-transparent shadow-sm" 
                onClick={() => onClickAtleta && onClickAtleta(atleta)}
              >
                <span className="text-xs font-bold text-gray-800 truncate pr-2 group-hover:text-[#7a2031] transition-colors" title={atleta.nombre_completo || atleta.nombre}>
                  {atleta.nombre_completo || atleta.nombre}
                </span>
                
                <div className="flex items-center shrink-0">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#7a2031] transition-colors" />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
