import React from 'react';

export default function FooterPublico({ cambiarVista }) {
  return (
    <footer className="w-full py-8 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center text-[0.65rem] text-gray-400 font-bold uppercase tracking-widest z-10">
      <div className="mb-4 md:mb-0">
        © {new Date().getFullYear()} MUNICIPIO DE BACALAR. TODOS LOS DERECHOS RESERVADOS.
      </div>
      <div className="flex space-x-8">
        <button onClick={() => cambiarVista('acercaDe')} className="hover:text-gray-900 transition-colors">Acerca de</button>
        <button className="hover:text-gray-900 transition-colors">Aviso de Privacidad</button>
        <button className="hover:text-gray-900 transition-colors">Contacto</button>
      </div>
    </footer>
  );
}
