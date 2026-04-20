import React, { useState, useEffect } from 'react';

import VistaInicio from './views/VistaInicio';
import VistaLogin from './views/VistaLogin';
import VistaRegistro from './views/VistaRegistro';
import VistaAcercaDe from './views/VistaAcercaDe';
import PanelEntrenador from './views/PanelEntrenador';
import PanelAdmin from './views/PanelAdmin';
import FooterPublico from './components/FooterPublico';
import logoRojo from './assets/logo-rojo-remude.png';

// Importamos las imágenes para el lado derecho
import ganadoresFut from './assets/ganadores-fut.jpg';
import veleros from './assets/veleros.jpg';

export default function App() {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  
  // Estado para controlar qué imagen se muestra (0 = ganadores, 1 = veleros)
  const [imagenActiva, setImagenActiva] = useState(0);

  // Efecto para cambiar la imagen cada 5 segundos
  useEffect(() => {
    // Solo ejecutamos el temporizador si estamos en las vistas públicas
    if (!['inicio', 'login', 'registro', 'acercaDe'].includes(vistaActual)) return;
    
    const intervalo = setInterval(() => {
      setImagenActiva((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(intervalo);
  }, [vistaActual]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-[#7a2031] selection:text-white relative overflow-x-hidden">
      
      {/* Vistas Públicas */}
      {['inicio', 'login', 'registro', 'acercaDe'].includes(vistaActual) && (
        <>
          {/* Contenedor principal dividido */}
          <div className="flex-1 flex w-full relative">
            
            {/* LADO IZQUIERDO: Formularios y Contenido (Ocupa 50% en PC, 100% en móviles) */}
            <div className="w-full lg:w-1/2 flex flex-col relative z-10 bg-linear-to-br from-gray-50 via-white to-gray-100">
              <header className="w-full pt-6 pb-2 px-8 md:px-16 flex justify-between items-center shrink-0">
                <div className="cursor-pointer" onClick={() => setVistaActual('inicio')}>
                  <img src={logoRojo} alt="REMUDE" className="h-16 md:h-20 object-contain transition-transform hover:scale-105" />
                </div>
              </header>

              <main className="flex-1 flex flex-col justify-center w-full max-w-2xl mx-auto px-8 md:px-16 py-8">
                {vistaActual === 'inicio' && <VistaInicio cambiarVista={setVistaActual} />}
                {vistaActual === 'login' && <VistaLogin cambiarVista={setVistaActual} setUsuario={setUsuarioAutenticado} />}
                {vistaActual === 'registro' && <VistaRegistro cambiarVista={setVistaActual} />}
                {vistaActual === 'acercaDe' && <VistaAcercaDe cambiarVista={setVistaActual} />}
              </main>

              {/* Fondo decorativo (Burbuja borrosa) conservado solo para móviles */}
              <div className="lg:hidden absolute top-0 right-0 -mr-[20%] -mt-[10%] w-[50%] h-[80%] rounded-full bg-linear-to-b from-gray-50 to-transparent blur-3xl opacity-50 pointer-events-none z-0"></div>
            </div>

            {/* LADO DERECHO: Imágenes rotativas (Completamente limpias, sin gradientes ni sombras) */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
              <div className="sticky top-0 w-full h-full max-h-screen overflow-hidden bg-black">
                {/* Imagen 1 */}
                <img 
                  src={ganadoresFut} 
                  alt="Ganadores de Fútbol Bacalar" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${imagenActiva === 0 ? 'opacity-100' : 'opacity-0'}`} 
                />
                
                {/* Imagen 2 */}
                <img 
                  src={veleros} 
                  alt="Veleros en Bacalar" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${imagenActiva === 1 ? 'opacity-100' : 'opacity-0'}`} 
                />
              </div>
            </div>

          </div>

          {/* FOOTER FULL WIDTH: Ocupa todo el ancho abajo */}
          <div className="w-full bg-white border-t border-gray-100 px-8 md:px-16 py-6 shrink-0 relative z-20">
            <FooterPublico cambiarVista={setVistaActual} />
          </div>
        </>
      )}

      {/* Vistas Privadas (Requieren Sesión) */}
      {vistaActual === 'panelEntrenador' && (
        <PanelEntrenador cambiarVista={setVistaActual} usuarioAutenticado={usuarioAutenticado} />
      )}
      
      {/* === RUTA PARA EL ADMIN === */}
      {vistaActual === 'panelAdmin' && (
        <PanelAdmin cambiarVista={setVistaActual} usuarioAutenticado={usuarioAutenticado} />
      )}
      
    </div>
  );
}