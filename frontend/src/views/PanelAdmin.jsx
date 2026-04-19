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

// Importamos las sub-vistas del administrador
import VistaAdminDashboard from './admin/VistaAdminDashboard';
import VistaPadronAtletas from './admin/VistaPadronAtletas';
import VistaPadronEntrenadores from './admin/VistaPadronEntrenadores';
import VistaClubesEquipos from './admin/VistaClubesEquipos';
import VistaCalendarioEventos from './admin/VistaCalendarioEventos';
import VistaConfiguracion from './admin/VistaConfiguracion'; // [NUEVO] Importamos la vista de configuración

// Importación directa porque están al mismo nivel en la carpeta views
import VistaPerfilAtleta from './VistaPerfilAtleta'; 

export default function PanelAdmin({ cambiarVista }) {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [vistaPanel, setVistaPanel] = useState('dashboard');
  
  // Estado para saber qué perfil abrir
  const [perfilSeleccionado, setPerfilSeleccionado] = useState({ id: null, tipo: null });

  const opcionesMenu = [
    { id: 'dashboard', etiqueta: 'Escritorio', icono: LayoutDashboard },
    { id: 'entrenadores', etiqueta: 'Padrón Entrenadores', icono: UserCog },
    { id: 'atletas', etiqueta: 'Padrón Deportistas', icono: Users },
    { id: 'clubes', etiqueta: 'Clubes y Equipos', icono: ClipboardList },
    { id: 'eventos', etiqueta: 'Calendario / Eventos', icono: CalendarDays },
    { id: 'documentos', etiqueta: 'Repositorio Documental', icono: FileText },
    { id: 'configuracion', etiqueta: 'Configuración', icono: Settings },
  ];

  // Función puente que pasaremos a los padrones
  const abrirPerfil = (id, tipo) => {
    setPerfilSeleccionado({ id, tipo });
    setVistaPanel('perfil'); 
  };

  const renderizarContenido = () => {
    switch (vistaPanel) {
      case 'dashboard':
        return <VistaAdminDashboard />;
      case 'atletas':
        return <VistaPadronAtletas abrirPerfil={abrirPerfil} />;
      case 'entrenadores':
        return <VistaPadronEntrenadores abrirPerfil={abrirPerfil} />;
      case 'clubes':
        return <VistaClubesEquipos />;
      case 'eventos':
        return <VistaCalendarioEventos />;
      case 'configuracion': // [NUEVO] Caso añadido para el Switch
        return <VistaConfiguracion />;
      case 'perfil':
        return (
          <VistaPerfilAtleta 
            cambiarVistaPanel={setVistaPanel} 
            perfilId={perfilSeleccionado.id} 
            tipoPerfil={perfilSeleccionado.tipo} 
          />
        );
      default:
        return <VistaAdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 w-full relative">
      <aside className={`bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-20 ${sidebarAbierta ? 'w-72' : 'w-24'}`}>
        <div className={`flex ${sidebarAbierta ? 'flex-row items-center justify-between p-4' : 'flex-col items-center justify-center gap-1'} h-24 border-b border-gray-800/50 shrink-0`}>
          <div className="flex items-center justify-center overflow-hidden">
             {sidebarAbierta ? (
               <div className="flex items-center gap-2 animate-fade-in">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1">
                    <span className="text-[#7a2031] font-black text-xl">R</span>
                 </div>
                 <span className="font-black text-xl tracking-tighter uppercase">
                   REMUDE <span className="text-[10px] block text-gray-400 -mt-1 tracking-widest font-bold">ADMINISTRACIÓN</span>
                 </span>
               </div>
             ) : (
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 animate-fade-in shadow-md">
                 <span className="text-[#7a2031] font-black text-xl">R</span>
               </div>
             )}
          </div>
          <button onClick={() => setSidebarAbierta(!sidebarAbierta)} className="p-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm shrink-0">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
          {opcionesMenu.map((item) => (
            <div key={item.id} onClick={() => setVistaPanel(item.id)} className="cursor-pointer">
              <SidebarItem icono={item.icono} etiqueta={item.etiqueta} estaAbierto={sidebarAbierta} activo={vistaPanel === item.id} />
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800/50 bg-gray-900/50">
          <button onClick={() => cambiarVista('inicio')} className={`flex items-center w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer group ${!sidebarAbierta && 'justify-center'}`}>
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {sidebarAbierta && <span className="ml-3 font-medium">Finalizar Sesión</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 px-8 flex justify-between items-center bg-white z-10 shrink-0 shadow-sm border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 leading-snug">
              {vistaPanel === 'perfil' ? 'Expediente Detallado' : 
               vistaPanel === 'configuracion' ? 'Configuración del Sistema' : 
               (opcionesMenu.find(o => o.id === vistaPanel)?.etiqueta || 'Administración')}
            </h2>
            <p className="text-xs font-bold text-[#c2a649] uppercase tracking-widest mt-1">Panel de Control Municipal de Bacalar</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-900">Admin General</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bacalar, Q. Roo</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#7a2031] text-white flex items-center justify-center font-black shadow-lg border-2 border-white">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 pt-6 flex flex-col bg-gray-50/50 relative">
          <div className="flex-1 animate-fade-in pb-8">
            {renderizarContenido()}
          </div>
          <footer className="mt-auto py-6 w-full text-[10px] text-gray-400 font-bold uppercase tracking-widest flex justify-between items-center border-t border-gray-200/50">
            <span>© {new Date().getFullYear()} DIRECCIÓN DE DEPORTES - BACALAR</span>
            <div className="flex space-x-6"><span className="text-[#c2a649]">v9.0 - REMUDE FULL-STACK</span></div>
          </footer>
        </main>
      </div>
    </div>
  );
}