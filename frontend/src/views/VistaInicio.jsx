import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function VistaInicio({ cambiarVista }) {
  return (
    <div className="w-full max-w-2xl animate-fade-in mt-4 md:mt-8">
      <h1 className="font-black uppercase tracking-tighter">
        <span className="block text-gray-900 text-7xl md:text-[8rem] leading-none mb-2 md:mb-4">REMUDE</span>
        <span className="block text-[#7a2031] text-3xl md:text-[3.5rem] leading-[0.85] mt-4">REGISTRO MUNICIPAL</span>
        <span className="block text-gray-900 text-3xl md:text-[3.5rem] leading-[0.85] mt-2">DEL DEPORTE</span>
      </h1>
      <p className="mt-8 text-gray-500 text-lg max-w-lg leading-relaxed font-light">
        Bienvenido a la infraestructura digital del Municipio de Bacalar. Una herramienta diseñada para la gestión de entrenadores y atletas.
      </p>
      <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
        <button 
          onClick={() => cambiarVista('login')}
          className="bg-[#7a2031] text-white px-8 py-4 rounded-full font-bold tracking-wide flex items-center shadow-lg hover:bg-[#5a1523] transition-all transform hover:scale-105"
        >
          Inicio de sesión
          <ArrowRight className="ml-3 w-5 h-5" />
        </button>
        <button 
          onClick={() => cambiarVista('registro')}
          className="text-[#c2a649] font-bold tracking-wide hover:text-[#a0883b] transition-colors text-sm flex items-center"
        >
          Registro de entrenador
        </button>
      </div>
    </div>
  );
}
