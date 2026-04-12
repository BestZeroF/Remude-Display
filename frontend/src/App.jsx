import React, { useState } from 'react';

import VistaInicio from './views/VistaInicio';
import VistaLogin from './views/VistaLogin';
import VistaRegistro from './views/VistaRegistro';
import VistaAcercaDe from './views/VistaAcercaDe';
import PanelEntrenador from './views/PanelEntrenador';
import FooterPublico from './components/FooterPublico';
import logoRojo from './assets/logo-rojo-remude.png';

export default function App() {
  const [vistaActual, setVistaActual] = useState('inicio');
  
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-900 selection:bg-[#7a2031] selection:text-white relative overflow-x-hidden">
      
      {['inicio', 'login', 'registro', 'acercaDe'].includes(vistaActual) && (
        <div className="min-h-screen flex flex-col relative">
          <header className="w-full pt-6 pb-2 px-8 md:px-16 flex justify-between items-center z-10">
            <div className="cursor-pointer" onClick={() => setVistaActual('inicio')}>
              <img src={logoRojo} alt="REMUDE" className="h-16 md:h-20 object-contain transition-transform hover:scale-105" />
            </div>
          </header>

          <main className="grow flex items-start pt-0 md:pt-2 w-full max-w-7xl mx-auto px-8 md:px-16 z-10">
            {vistaActual === 'inicio' && <VistaInicio cambiarVista={setVistaActual} />}
            {vistaActual === 'login' && <VistaLogin cambiarVista={setVistaActual} setUsuario={setUsuarioAutenticado} />}
            {vistaActual === 'registro' && <VistaRegistro cambiarVista={setVistaActual} />}
            {vistaActual === 'acercaDe' && <VistaAcercaDe cambiarVista={setVistaActual} />}
          </main>

          <FooterPublico cambiarVista={setVistaActual} />
          
          <div className="absolute top-0 right-0 -mr-[20%] -mt-[10%] w-[50%] h-[80%] rounded-full bg-linear-to-b from-gray-50 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
        </div>
      )}

      {vistaActual === 'panelEntrenador' && (
        <PanelEntrenador cambiarVista={setVistaActual} usuarioAutenticado={usuarioAutenticado} />
      )}
      
    </div>
  );
}
