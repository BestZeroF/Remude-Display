import React, { useState } from 'react';
import { 
  Menu, Home, User, UserPlus, Users, LogOut, Bell, 
  HelpCircle, ChevronRight, Clock, AlertCircle, 
  CheckCircle, XCircle 
} from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import CardEstado from '../components/CardEstado';

import logoBlanco from '../assets/logo-blanco-remude.png';
import logoIcono from '../assets/logo-icono.png'; 
import logoMunicipio from '../assets/logo-municipio.png'; 

export default function PanelEntrenador({ cambiarVista }) {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  // Datos mockeados
  const datosUsuario = {
    nombre: "Victoria Piña",
    ubicacion: "Bacalar, Quintana Roo", 
    disciplina: "Atletismo"
  };

  const notificaciones = [
    { id: 1, texto: "La CURP de Carlos López fue rechazada.", leida: false },
    { id: 2, texto: "Atleta María Gómez validada con éxito.", leida: true }
  ];

  const conteoNoLeidas = notificaciones.filter(n => !n.leida).length;

  const datosAtletas = {
    pendientes: [{ id: 1, nombre: "Carlos López" }, { id: 2, nombre: "Diana Salazar" }, { id: 3, nombre: "Luis Pérez" }, { id: 9, nombre: "Sofía Ruiz" }, { id: 10, nombre: "Alejandro M." }],
    enRevision: [{ id: 4, nombre: "María Gómez" }, { id: 5, nombre: "Roberto F." }],
    validados: [{ id: 6, nombre: "Pedro Sánchez" }],
    rechazados: [{ id: 7, nombre: "Ana Torres" }, { id: 8, nombre: "Jorge V." }]
  };

  const totalAtletas = 10;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 w-full">
      
      {/* Sidebar Izquierda */}
      <aside 
        className={`bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-20
        ${sidebarAbierta ? 'w-72' : 'w-24'}`}
      >
        {/* Usamos flexbox condicional para organizar el botón y el logo sin que se aplasten */}
        <div className={`flex ${sidebarAbierta ? 'flex-row items-center justify-between p-4' : 'flex-col items-center justify-center gap-1'} h-24 border-b border-gray-800/50 shrink-0`}>
          
          <div className="flex items-center justify-center overflow-hidden">
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
          <SidebarItem icono={Home} etiqueta="Panel principal" estaAbierto={sidebarAbierta} activo />
          <SidebarItem icono={User} etiqueta="Mi perfil" estaAbierto={sidebarAbierta} />
          <SidebarItem icono={UserPlus} etiqueta="Inscribir atleta" estaAbierto={sidebarAbierta} />
          <SidebarItem icono={Users} etiqueta="Mi delegación" estaAbierto={sidebarAbierta} />
        </nav>

        <div className="p-4 border-t border-gray-800/50">
          <button 
            onClick={() => cambiarVista('inicio')}
            className={`flex items-center w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors ${!sidebarAbierta && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarAbierta && <span className="ml-3 font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido Principal Derecho */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header Superior - Ahora es menos alto (h-24 en lugar de h-28) */}
        <header className="h-24 px-8 flex justify-between items-center bg-transparent z-10 shrink-0 border-b border-gray-100/50">
          <div className="flex items-center">
            
            {/* Logo del municipio más grande (h-14) */}
            <img src={logoMunicipio} alt="Municipio de Bacalar" className="h-14 object-contain drop-shadow-sm" />

            {/* Separador vertical */}
            <div className="hidden sm:block w-px h-10 bg-gray-300 mx-5 rounded-full"></div>

            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none">Hola, {datosUsuario.nombre}</h2>
              <p className="text-xs md:text-sm font-medium text-gray-500 mt-1">
                {datosUsuario.ubicacion} • {datosUsuario.disciplina}
              </p>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow relative"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {conteoNoLeidas > 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></span>
              )}
            </button>

            {mostrarNotificaciones && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Notificaciones</h3>
                  <button className="text-xs text-[#7a2031] font-bold">Marcar leídas</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notificaciones.map(n => (
                    <div key={n.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${!n.leida ? 'border-l-4 border-[#7a2031]' : ''}`}>
                      <p className="text-sm text-gray-700">{n.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Área scrolleable principal */}
        <main className="flex-1 overflow-y-auto px-8 pt-6 flex flex-col">
          
          {/* Contenedor del Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardEstado 
                titulo="Pendientes" cantidad={datosAtletas.pendientes.length} 
                icono={Clock} colorFondo="bg-gray-900" colorTexto="text-white"
                atletas={datosAtletas.pendientes}
              />
              <CardEstado 
                titulo="En revisión" cantidad={datosAtletas.enRevision.length} 
                icono={AlertCircle} colorFondo="bg-amber-500" colorTexto="text-white"
                atletas={datosAtletas.enRevision}
              />
              <CardEstado 
                titulo="Validados" cantidad={datosAtletas.validados.length} 
                icono={CheckCircle} colorFondo="bg-emerald-600" colorTexto="text-white"
                atletas={datosAtletas.validados}
              />
              <CardEstado 
                titulo="Rechazados" cantidad={datosAtletas.rechazados.length} 
                icono={XCircle} colorFondo="bg-rose-600" colorTexto="text-white"
                atletas={datosAtletas.rechazados}
              />
            </div>

            <div className="flex flex-col gap-6">
              
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-center items-center text-center h-48 shrink-0">
                <div className="w-16 h-16 bg-[#7a2031]/10 rounded-full flex justify-center items-center mb-4 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-8 h-8 text-[#7a2031]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Registrar un nuevo deportista</h3>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col flex-1 min-h-96">
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total de atletas</p>
                  <h3 className="text-5xl font-black text-gray-900">{totalAtletas}</h3>
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

                <button className="flex items-center text-[#c2a649] font-bold hover:text-[#a0883b] transition-colors mt-6 pt-4 border-t border-gray-100">
                  Ver todos los atletas <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>

            </div>
          </div>

          {/* Footer movido dentro del main para que no quede fijo */}
          <footer className="mt-auto pt-12 pb-6 w-full text-xs text-gray-400 font-bold uppercase tracking-widest flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>© {new Date().getFullYear()} MUNICIPIO DE BACALAR.</span>
            <div className="flex space-x-6">
              <button onClick={() => cambiarVista('acercaDe')} className="hover:text-gray-900 transition-colors">Acerca de</button>
              <button className="hover:text-gray-900 transition-colors">Aviso de Privacidad</button>
              <button className="hover:text-gray-900 transition-colors">Contacto</button>
            </div>
          </footer>

        </main>

        {/* Botón Flotante */}
        <button className="absolute bottom-8 right-8 bg-[#7a2031] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(122,32,49,0.4)] hover:bg-[#5a1523] transition-colors z-40 hover:scale-105 transform">
          <HelpCircle className="w-7 h-7" />
        </button>

      </div>
    </div>
  );
}
