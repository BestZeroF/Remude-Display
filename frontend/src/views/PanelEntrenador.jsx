import React, { useState, useEffect } from 'react';
import { 
  Menu, Home, User, UserPlus, Users, LogOut, Bell, 
  HelpCircle, ChevronRight, Clock, AlertCircle, 
  CheckCircle, XCircle 
} from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import CardEstado from '../components/CardEstado';
import VistaInscripcionAtleta from './VistaInscripcionAtleta'; 
import VistaDelegacion from './VistaDelegacion'; 

import logoBlanco from '../assets/logo-blanco-remude.png';
import logoIcono from '../assets/logo-icono.png'; 
import logoMunicipio from '../assets/logo-municipio.png'; 

export default function PanelEntrenador({ cambiarVista, usuarioAutenticado }) {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [vistaPanel, setVistaPanel] = useState('resumen'); 
  
  const [intentoNavegacion, setIntentoNavegacion] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [datosDashboard, setDatosDashboard] = useState({
    usuario: { nombre: "Cargando...", ubicacion: "Bacalar, Quintana Roo", disciplina: "..." },
    notificaciones: [],
    atletas: { pendientes: [], enRevision: [], validados: [], rechazados: [] },
    totalAtletas: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token_remude');

      try {
        const URL_DASHBOARD = 'http://localhost:3000/api/entrenadores/dashboard'; 
        
        const respuesta = await fetch(URL_DASHBOARD, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (respuesta.ok) {
          const data = await respuesta.json();
          setDatosDashboard({
            usuario: {
              nombre: `${data.entrenador?.nombre || usuarioAutenticado?.nombre || ''} ${data.entrenador?.apellidos || usuarioAutenticado?.apellidos || ''}`,
              ubicacion: "Bacalar, Quintana Roo",
              disciplina: data.entrenador?.especialidad || "Disciplina no asignada"
            },
            notificaciones: data.notificaciones || [],
            atletas: data.atletas || { pendientes: [], enRevision: [], validados: [], rechazados: [] },
            totalAtletas: data.totalAtletas || 0
          });
        } else {
           console.error("Error al cargar el dashboard");
           if(respuesta.status === 401) cambiarVista('login');
        }
      } catch (error) {
        console.error("Error de red conectando al backend:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchDashboard();
  }, [usuarioAutenticado, cambiarVista]);

  const conteoNoLeidas = datosDashboard.notificaciones.filter(n => !n.leida).length;

  const handleMenuClick = (destino) => {
    if (vistaPanel === 'inscripcion') {
      setIntentoNavegacion(destino);
    } else {
      setVistaPanel(destino);
    }
  };

  const handleLogout = () => {
    if (vistaPanel === 'inscripcion') {
      setIntentoNavegacion('logout');
    } else {
      localStorage.removeItem('token_remude'); 
      cambiarVista('inicio');
    }
  };

  const confirmarNavegacion = (destino) => {
    setIntentoNavegacion(null);
    if (destino === 'logout') {
      localStorage.removeItem('token_remude'); 
      cambiarVista('inicio');
    } else {
      setVistaPanel(destino);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 w-full relative">
      <aside 
        className={`bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-20
        ${sidebarAbierta ? 'w-72' : 'w-24'}`}
      >
        <div className={`flex ${sidebarAbierta ? 'flex-row items-center justify-between p-4' : 'flex-col items-center justify-center gap-1'} h-24 border-b border-gray-800/50 shrink-0`}>
          <div className="flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => handleMenuClick('resumen')}>
             {sidebarAbierta ? (
               <img src={logoBlanco} alt="REMUDE" className="h-16 object-contain animate-fade-in" />
             ) : (
               <img src={logoIcono} alt="Icono" className="h-10 object-contain animate-fade-in mt-1" />
             )}
          </div>
          <button 
            onClick={() => setSidebarAbierta(!sidebarAbierta)} 
            className="p-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-6 space-y-2 px-3 overflow-y-auto">
          <div onClick={() => handleMenuClick('resumen')}>
            <SidebarItem icono={Home} etiqueta="Panel principal" estaAbierto={sidebarAbierta} activo={vistaPanel === 'resumen'} />
          </div>
          <div onClick={() => handleMenuClick('perfil')}>
            <SidebarItem icono={User} etiqueta="Mi perfil" estaAbierto={sidebarAbierta} activo={vistaPanel === 'perfil'} />
          </div>
          <div onClick={() => handleMenuClick('inscripcion')}>
            <SidebarItem icono={UserPlus} etiqueta="Inscribir atleta" estaAbierto={sidebarAbierta} activo={vistaPanel === 'inscripcion'} />
          </div>
          <div onClick={() => handleMenuClick('delegacion')}>
            <SidebarItem icono={Users} etiqueta="Mi delegación" estaAbierto={sidebarAbierta} activo={vistaPanel === 'delegacion'} />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800/50">
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer ${!sidebarAbierta && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarAbierta && <span className="ml-3 font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 px-8 flex justify-between items-center bg-white z-10 shrink-0 shadow-sm">
          <div className="flex items-center">
            <img src={logoMunicipio} alt="Municipio de Bacalar" className="h-14 object-contain drop-shadow-sm" />
            <div className="hidden sm:block w-px h-10 bg-gray-200 mx-5 rounded-full"></div>
            
            {/* LÓGICA DE ENCABEZADO CONSISTENTE: Todos los títulos comparten el mismo estilo */}
            {vistaPanel === 'resumen' ? (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                  Hola, {cargando ? 'Cargando...' : datosDashboard.usuario.nombre}
                </h2>
                <p className="text-xs md:text-sm font-medium text-gray-500 mt-1">
                  {datosDashboard.usuario.ubicacion} • {datosDashboard.usuario.disciplina}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                  {vistaPanel === 'delegacion' && 'Mi delegación'}
                  {vistaPanel === 'inscripcion' && 'Inscripción de atleta'}
                  {vistaPanel === 'perfil' && 'Perfil del entrenador'}
                </h2>
                <p className="text-xs md:text-sm font-medium text-gray-500 mt-1">
                  Panel de gestión y control
                </p>
              </div>
            )}
            
          </div>

          <div className="relative">
            <button 
              onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
              className="p-3 rounded-full bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {conteoNoLeidas > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></span>
              )}
            </button>

            {mostrarNotificaciones && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in border border-gray-100">
                <div className="p-4 bg-gray-50 flex justify-between items-center border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm">Notificaciones</h3>
                  <button className="text-xs text-[#7a2031] font-bold">Marcar leídas</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {datosDashboard.notificaciones.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">No hay notificaciones nuevas</div>
                  ) : (
                    datosDashboard.notificaciones.map(n => (
                      <div key={n.id_notificaciones || n.id} className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${!n.leido && !n.leida ? 'border-l-4 border-l-[#7a2031]' : ''}`}>
                        <p className="text-sm text-gray-700 leading-relaxed">{n.mensaje || n.texto}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-hidden px-8 pt-6 flex flex-col relative bg-gray-50/50">
          
          {vistaPanel === 'resumen' && (
             <div className="max-w-6xl mx-auto w-full animate-fade-in pb-20 overflow-y-auto h-full pr-2">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CardEstado 
                      titulo="Pendientes" cantidad={datosDashboard.atletas.pendientes.length} 
                      icono={Clock} colorFondo="bg-gray-900" colorTexto="text-white"
                      atletas={datosDashboard.atletas.pendientes}
                    />
                    <CardEstado 
                      titulo="En revisión" cantidad={datosDashboard.atletas.enRevision.length} 
                      icono={AlertCircle} colorFondo="bg-amber-500" colorTexto="text-white"
                      atletas={datosDashboard.atletas.enRevision}
                    />
                    <CardEstado 
                      titulo="Validados" cantidad={datosDashboard.atletas.validados.length} 
                      icono={CheckCircle} colorFondo="bg-emerald-600" colorTexto="text-white"
                      atletas={datosDashboard.atletas.validados}
                    />
                    <CardEstado 
                      titulo="Rechazados" cantidad={datosDashboard.atletas.rechazados.length} 
                      icono={XCircle} colorFondo="bg-rose-600" colorTexto="text-white"
                      atletas={datosDashboard.atletas.rechazados}
                    />
                  </div>

                  <div className="flex flex-col gap-6">
                    <div onClick={() => handleMenuClick('inscripcion')} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-center items-center text-center h-48 shrink-0">
                      <div className="w-16 h-16 bg-[#7a2031]/10 rounded-full flex justify-center items-center mb-4 group-hover:scale-110 transition-transform">
                        <UserPlus className="w-8 h-8 text-[#7a2031]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Registrar un nuevo deportista</h3>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col flex-1 min-h-96">
                      <div className="mb-6">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total de atletas</p>
                        <h3 className="text-5xl font-black text-gray-900">{datosDashboard.totalAtletas}</h3>
                      </div>

                      <div className="space-y-6 flex-1">
                        <div>
                          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase">
                            <span>Hombres (5)</span>
                            <span>Mujeres (5)</span>
                          </div>
                          <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                            <div className="bg-[#4a90e2] h-full transition-all duration-1000" style={{ width: '50%' }}></div>
                            <div className="bg-[#e91e63] h-full transition-all duration-1000" style={{ width: '50%' }}></div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-4 uppercase">Distribución por edades</p>
                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <span className="w-14 text-gray-600 font-medium">10-14</span>
                              <div className="flex-1 h-2 bg-gray-100 rounded-full ml-2 overflow-hidden">
                                <div className="bg-[#c2a649] h-full rounded-full transition-all duration-1000" style={{ width: '20%' }}></div>
                              </div>
                              <span className="ml-3 font-bold text-gray-800">2</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="w-14 text-gray-600 font-medium">15-18</span>
                              <div className="flex-1 h-2 bg-gray-100 rounded-full ml-2 overflow-hidden">
                                <div className="bg-[#c2a649] h-full rounded-full transition-all duration-1000" style={{ width: '70%' }}></div>
                              </div>
                              <span className="ml-3 font-bold text-gray-800">7</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="w-14 text-gray-600 font-medium">19-25</span>
                              <div className="flex-1 h-2 bg-gray-100 rounded-full ml-2 overflow-hidden">
                                <div className="bg-[#c2a649] h-full rounded-full transition-all duration-1000" style={{ width: '10%' }}></div>
                              </div>
                              <span className="ml-3 font-bold text-gray-800">1</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleMenuClick('delegacion')}
                        className="flex items-center text-[#c2a649] font-bold hover:text-[#a0883b] transition-colors mt-6 pt-4 border-t border-gray-100"
                      >
                        Ver todos los atletas <ChevronRight className="w-5 h-5 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
             </div>
          )}

          {vistaPanel === 'inscripcion' && (
            <div className="overflow-y-auto h-full pr-2">
              <VistaInscripcionAtleta 
                intentoNavegacion={intentoNavegacion}
                confirmarNavegacion={confirmarNavegacion}
                cancelarNavegacion={() => setIntentoNavegacion(null)}
                solicitarNavegacion={handleMenuClick}
                cambiarVistaPanel={setVistaPanel} 
              />
            </div>
          )}

          {vistaPanel === 'delegacion' && (
            <VistaDelegacion cambiarVistaPanel={setVistaPanel} />
          )}

          <footer className="absolute bottom-0 left-0 right-0 py-6 px-8 bg-transparent pointer-events-none w-full text-xs text-gray-400 font-bold uppercase tracking-widest flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>© {new Date().getFullYear()} MUNICIPIO DE BACALAR.</span>
            <div className="flex space-x-6 pointer-events-auto">
              <button onClick={() => cambiarVista('acercaDe')} className="hover:text-gray-900 transition-colors">Acerca de</button>
              <button className="hover:text-gray-900 transition-colors">Aviso de Privacidad</button>
              <button className="hover:text-gray-900 transition-colors">Contacto</button>
            </div>
          </footer>

        </main>

        <button className="absolute bottom-8 right-8 bg-[#7a2031] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(122,32,49,0.4)] hover:bg-[#5a1523] transition-colors z-40 hover:scale-105 transform">
          <HelpCircle className="w-7 h-7" />
        </button>

      </div>
    </div>
  );
}