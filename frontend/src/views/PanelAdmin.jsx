// src/views/PanelAdmin.jsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  FileText, 
  ClipboardList, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Menu 
} from 'lucide-react';

// Importamos el componente SidebarItem reutilizable
import SidebarItem from '../components/SidebarItem'; 

// Importamos las sub-vistas del administrador creadas
import VistaAdminDashboard from './admin/VistaAdminDashboard';
import VistaPadronAtletas from './admin/VistaPadronAtletas';
import VistaPadronEntrenadores from './admin/VistaPadronEntrenadores';
import VistaClubesEquipos from './admin/VistaClubesEquipos';
import VistaCalendarioEventos from './admin/VistaCalendarioEventos';

export default function PanelAdmin({ cambiarVista }) {
  // Estado para controlar el ancho del sidebar (Menú Hamburguesa)
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  
  // Estado para controlar qué sección del panel administrativo se muestra
  const [vistaPanel, setVistaPanel] = useState('dashboard');

  // Configuración de los items del menú basada en las fotos de referencia
  const opcionesMenu = [
    { id: 'dashboard', etiqueta: 'Escritorio', icono: LayoutDashboard },
    { id: 'entrenadores', etiqueta: 'Padrón Entrenadores', icono: UserCog },
    { id: 'atletas', etiqueta: 'Padrón Deportistas', icono: Users },
    { id: 'clubes', etiqueta: 'Clubes y Equipos', icono: ClipboardList },
    { id: 'eventos', etiqueta: 'Calendario / Eventos', icono: CalendarDays },
    { id: 'documentos', etiqueta: 'Repositorio Documental', icono: FileText },
    { id: 'configuracion', etiqueta: 'Configuración', icono: Settings },
  ];

  // Función para renderizar el contenido central según la opción seleccionada
  const renderizarContenido = () => {
    switch (vistaPanel) {
      case 'dashboard':
        return <VistaAdminDashboard />;
      case 'atletas':
        return <VistaPadronAtletas />;
      case 'entrenadores':
        return <VistaPadronEntrenadores />;
      case 'clubes':
        return <VistaClubesEquipos />;
      case 'eventos':
        return <VistaCalendarioEventos />;
      default:
        return <VistaAdminDashboard />;
      
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 w-full relative">
      
      {/* ---------------------------------------------------------
         SIDEBAR (MENÚ LATERAL) - ESTILO REMUDE V7
         --------------------------------------------------------- */}
      <aside 
        className={`bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-20
        ${sidebarAbierta ? 'w-72' : 'w-24'}`}
      >
        {/* Header del Sidebar: Logo y Botón de colapso */}
        <div className={`flex ${sidebarAbierta ? 'flex-row items-center justify-between p-4' : 'flex-col items-center justify-center gap-1'} h-24 border-b border-gray-800/50 shrink-0`}>
          <div className="flex items-center justify-center overflow-hidden">
             {sidebarAbierta ? (
               <div className="flex items-center gap-2 animate-fade-in">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1">
                    <span className="text-[#7a2031] font-black text-xl">R</span>
                 </div>
                 <span className="font-black text-xl tracking-tighter uppercase">
                   REMUDE 
                   <span className="text-[10px] block text-gray-400 -mt-1 tracking-widest font-bold">ADMINISTRACIÓN</span>
                 </span>
               </div>
             ) : (
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 animate-fade-in shadow-md">
                 <span className="text-[#7a2031] font-black text-xl">R</span>
               </div>
             )}
          </div>
          <button 
            onClick={() => setSidebarAbierta(!sidebarAbierta)} 
            className="p-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 mt-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
          {opcionesMenu.map((item) => (
            <div key={item.id} onClick={() => setVistaPanel(item.id)}>
              <SidebarItem 
                icono={item.icono} 
                etiqueta={item.etiqueta} 
                estaAbierto={sidebarAbierta} 
                activo={vistaPanel === item.id} 
              />
            </div>
          ))}
        </nav>

        {/* Botón de Salida */}
        <div className="p-4 border-t border-gray-800/50 bg-gray-900/50">
          <button 
            onClick={() => cambiarVista('inicio')}
            className={`flex items-center w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer group ${!sidebarAbierta && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {sidebarAbierta && <span className="ml-3 font-medium">Finalizar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------
         ÁREA DE CONTENIDO (MAIN AREA)
         --------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header Superior Dinámico */}
        <header className="h-24 px-8 flex justify-between items-center bg-white z-10 shrink-0 shadow-sm border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              {opcionesMenu.find(o => o.id === vistaPanel)?.etiqueta || 'Administración'}
            </h2>
            <p className="text-xs font-bold text-[#c2a649] uppercase tracking-widest mt-1">
              Panel de Control Municipal de Bacalar
            </p>
          </div>

          {/* Perfil del Administrador */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-900">Admin General</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bacalar, Q. Roo</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#7a2031] text-white flex items-center justify-center font-black shadow-lg border-2 border-white">
              A
            </div>
          </div>
        </header>

        {/* Contenido Dinámico con Scroll Independiente */}
        <main className="flex-1 overflow-y-auto px-8 pt-6 flex flex-col bg-gray-50/50 relative">
          
          <div className="flex-1 animate-fade-in pb-8">
            {renderizarContenido()}
          </div>

          {/* Footer del Panel */}
          <footer className="mt-auto py-6 w-full text-[10px] text-gray-400 font-bold uppercase tracking-widest flex justify-between items-center border-t border-gray-200/50">
            <span>© {new Date().getFullYear()} DIRECCIÓN DE DEPORTES - BACALAR</span>
            <div className="flex space-x-6">
              <span className="text-[#c2a649]">v7.0.5 - REMUDE ASSISTANT</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}