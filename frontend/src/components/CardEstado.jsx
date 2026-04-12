import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CardEstado(props) {
  const { titulo, cantidad, colorFondo, colorTexto, atletas } = props;
  const Icono = props.icono;

  return (
    <div className={`${colorFondo} ${colorTexto} rounded-3xl p-6 shadow-xl flex flex-col h-80 transform transition-transform hover:-translate-y-1`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; display: block; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.25); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }
      `}</style>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold opacity-90">{titulo}</h3>
          <p className="text-4xl font-black mt-1">{cantidad}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs">
          <Icono className="w-6 h-6" />
        </div>
      </div>
      
      <div className="mt-auto bg-white/10 rounded-2xl p-4 flex-1 overflow-hidden flex flex-col">
        <h4 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-80">Últimos registros</h4>
        <ul className="space-y-2 overflow-y-scroll pr-2 custom-scrollbar flex-1">
          {(!atletas || atletas.length === 0) ? (
            <li className="text-sm opacity-70 italic">No hay registros</li>
          ) : (
            atletas.map((atleta) => (
              <li key={atleta.id_atleta || atleta.id} className="text-sm font-medium hover:bg-white/20 p-2 rounded-lg cursor-pointer transition-colors flex justify-between items-center group">
                {atleta.nombre}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
