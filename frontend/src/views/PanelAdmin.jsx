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
  Menu,
  Bell 
} from 'lucide-react';

// Importamos los elementos gráficos y públicos
import logoBacalar from '../assets/logo-bacalar.png';
import SidebarItem from '../components/SidebarItem'; 
import FooterPublico from '../components/FooterPublico'; 

// Importamos las sub-vistas del administrador
import VistaAdminDashboard from './admin/VistaAdminDashboard';
import VistaPadronAtletas from './admin/VistaPadronAtletas';
import VistaPadronEntrenadores from './admin/VistaPadronEntrenadores';
import VistaClubesEquipos from './admin/VistaClubesEquipos';
import VistaCalendarioEventos from './admin/VistaCalendarioEventos';
import VistaConfiguracion from './admin/VistaConfiguracion'; 
import VistaPerfilAtleta from './VistaPerfilAtleta'; 

export default function PanelAdmin({ cambiarVista }) {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [vistaPanel, setVistaPanel] = useState('dashboard');
  const [perfilSeleccionado, setPerfilSeleccionado] = useState({ id: null, tipo: null });
  
  // Estados para la Topbar
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);
  const [inscripcionesAbiertas] = useState(true);

  const opcionesMenu = [
    { id: 'dashboard', etiqueta: 'Escritorio', icono: LayoutDashboard },
    { id: 'entrenadores', etiqueta: 'Padrón Entrenadores', icono: UserCog },
    { id: 'atletas', etiqueta: 'Padrón Deportistas', icono: Users },
    { id: 'clubes', etiqueta: 'Clubes y Equipos', icono: ClipboardList },
    { id: 'eventos', etiqueta: 'Calendario / Eventos', icono: CalendarDays },
    { id: 'documentos', etiqueta: 'Repositorio Documental', icono: FileText },
    { id: 'configuracion', etiqueta: 'Configuración', icono: Settings },
  ];

  const abrirPerfil = (id, tipo) => {
    setPerfilSeleccionado({ id, tipo });
    setVistaPanel('perfil'); 
  };

  const renderizarContenido = () => {
    switch (vistaPanel) {
      case 'dashboard': return <VistaAdminDashboard />;
      case 'atletas': return <VistaPadronAtletas abrirPerfil={abrirPerfil} />;
      case 'entrenadores': return <VistaPadronEntrenadores abrirPerfil={abrirPerfil} />;
      case 'clubes': return <VistaClubesEquipos />;
      case 'eventos': return <VistaCalendarioEventos />;
      case 'configuracion': return <VistaConfiguracion />;
      case 'perfil': return <VistaPerfilAtleta cambiarVistaPanel={setVistaPanel} perfilId={perfilSeleccionado.id} tipoPerfil={perfilSeleccionado.tipo} />;
      default: return <VistaAdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 w-full relative">
      {/* SIDEBAR MANTIENE SU ESTILO OSCURO Y ELEGANTE */}
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
        
        {/* ============================================================== */}
        {/* TOPBAR GLOBAL CON LOGO DE BACALAR E INDICADOR DEL SISTEMA */}
        {/* ============================================================== */}
        <header className="h-24 px-8 flex justify-between items-center bg-white z-50 shrink-0 shadow-sm border-b border-gray-100 relative">
          
          <div className="flex items-center gap-4">
            <img src={logoBacalar} alt="Municipio de Bacalar" className="w-12 h-14 object-contain" />
            <div className="border-l-2 border-gray-100 pl-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">Hola, Administrador</h2>
              <p className="text-sm font-medium text-gray-500">Bacalar, Quintana Roo</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Estado del sistema</span>
              <div className="flex items-center text-xs font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                <span className={`w-2 h-2 rounded-full mr-2 ${inscripcionesAbiertas ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {inscripcionesAbiertas ? 'En Línea' : 'Cerrado'}
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={() => setNotificacionesAbiertas(!notificacionesAbiertas)}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:shadow-md transition-all border border-gray-200 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              {notificacionesAbiertas && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-5 flex justify-between items-center bg-gray-50/50">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Notificaciones</h4>
                  </div>
                  <div className="p-5 text-center text-xs text-gray-500">No hay notificaciones recientes.</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 md:px-8 pt-6 flex flex-col bg-gray-50/50 relative custom-scrollbar">
          <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>
          
          <div className="flex-1 animate-fade-in pb-4">
            {renderizarContenido()}
          </div>
          
          {/* ============================================================== */}
          {/* FOOTER GLOBAL REUTILIZANDO TU COMPONENTE */}
          {/* ============================================================== */}
          <FooterPublico cambiarVista={cambiarVista} />
        </main>
      </div>
    </div>
  );
}