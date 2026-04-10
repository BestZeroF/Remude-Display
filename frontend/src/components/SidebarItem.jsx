import React from 'react';

export default function SidebarItem(props) {
  const { etiqueta, estaAbierto, activo } = props;
  const Icono = props.icono; // Asignación directa para evitar el falso positivo de ESLint

  return (
    <button className={`flex items-center w-full p-3 rounded-xl transition-all ${
      activo ? 'bg-[#7a2031] text-white shadow-lg' : 'hover:bg-gray-800 text-gray-300'
    } ${!estaAbierto && 'justify-center'}`}>
      <Icono className="w-5 h-5" />
      {estaAbierto && <span className="ml-3 font-medium whitespace-nowrap">{etiqueta}</span>}
    </button>
  );
}
