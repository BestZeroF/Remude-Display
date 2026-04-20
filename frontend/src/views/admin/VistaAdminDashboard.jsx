// src/views/admin/VistaAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Users, UserCog, AlertCircle, BarChart3 } from 'lucide-react';

export default function VistaAdminDashboard() {
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState({
    totales: { atletas: 0, entrenadores: 0, enRevision: 0 },
    recientes: []
  });

  // Datos simulados para los gráficos (Como en tu captura de referencia)
  const topDisciplinas = [
    { nombre: 'Ciclismo', total: 16 },
    { nombre: 'Béisbol', total: 12 },
    { nombre: 'Voleibol', total: 12 },
    { nombre: 'Atletismo', total: 10 },
    { nombre: 'Fútbol', total: 10 }
  ];
  const maxDisciplina = Math.max(...topDisciplinas.map(d => d.total));

  // Datos de género con los colores de tu nueva captura (Azul y Rosa)
  const statsGenero = { masc: 65, fem: 35 }; 
  
  useEffect(() => {
    obtenerDatosDashboard();
  }, []);

  const obtenerDatosDashboard = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token_remude');
      const respuesta = await fetch('http://localhost:3000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (respuesta.ok) {
        const data = await respuesta.json();
        setDatos(data);
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cálculos para la gráfica de dona (Estatus)
  const totalValidos = Math.max(0, datos.totales.atletas - datos.totales.enRevision);
  const totalReal = totalValidos + datos.totales.enRevision;
  const pctValidos = totalReal > 0 ? (totalValidos / totalReal) * 100 : 0;
  const pctRevision = totalReal > 0 ? (datos.totales.enRevision / totalReal) * 100 : 0;

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>
      
      {/* TÍTULO DE SECCIÓN */}
      <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-6">ESTADO DE LOS EXPEDIENTES</h3>

      {/* 1. ROW DE KPIs PRINCIPALES (Estilo tarjetas vibrantes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* KPI: Deportistas (Azul Oscuro) */}
        <div className="bg-[#0f172a] text-white rounded-4xl p-6 md:p-8 shadow-lg flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-bold text-lg">Deportistas</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <Users className="w-5 h-5 opacity-80" />
            </div>
          </div>
          <span className="text-6xl font-black relative z-10">{cargando ? '-' : datos.totales.atletas}</span>
        </div>

        {/* KPI: Entrenadores (Verde) */}
        <div className="bg-[#10b981] text-white rounded-4xl p-6 md:p-8 shadow-lg flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-bold text-lg">Entrenadores</span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
              <UserCog className="w-5 h-5 opacity-90" />
            </div>
          </div>
          <span className="text-6xl font-black relative z-10">{cargando ? '-' : datos.totales.entrenadores}</span>
        </div>

        {/* KPI: Pendientes (Naranja) */}
        <div className="bg-[#f59e0b] text-white rounded-4xl p-6 md:p-8 shadow-lg flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-bold text-lg">Pendientes</span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
              <AlertCircle className="w-5 h-5 opacity-90" />
            </div>
          </div>
          <span className="text-6xl font-black relative z-10">{cargando ? '-' : datos.totales.enRevision}</span>
        </div>

      </div>

      {/* 2. GRID INFERIOR (Gráficos y Actividad - Tarjetas Blancas Limpias) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: Top Disciplinas (Bar Chart Corregido) */}
        <div className="lg:col-span-5 bg-white rounded-4xl6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full min-h-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
              TOP DISCIPLINAS
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-300" />
          </div>
          
          {/* Contenedor con altura fija para evitar colapso de barras */}
          <div className="flex-1 w-full flex flex-col mt-4">
            <div className="relative h-48 md:h-56 w-full mt-auto">
              
              {/* Líneas guía de fondo (Eje Y) */}
              <div className="absolute inset-0 flex flex-col justify-between z-0">
                 <div className="border-t border-gray-100 w-full h-0"></div>
                 <div className="border-t border-gray-100 w-full h-0"></div>
                 <div className="border-t border-gray-100 w-full h-0"></div>
                 <div className="border-t border-gray-100 w-full h-0"></div>
              </div>

              {/* Contenedor de las barras */}
              <div className="absolute inset-0 z-10 flex items-end justify-around pb-0 h-full">
                {topDisciplinas.map((disc, idx) => {
                  // Altura máxima del 85% para dejar espacio al número arriba
                  const altura = Math.max((disc.total / maxDisciplina) * 85, 5); 
                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full w-full group">
                      <span className="text-xs font-bold text-gray-900 mb-2">{disc.total}</span>
                      <div 
                        className="w-full max-w-10 bg-[#0f172a] rounded-t-xl hover:bg-[#3b82f6] transition-colors shadow-sm"
                        style={{ height: `${altura}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Etiquetas del Eje X */}
            <div className="flex justify-around mt-4 pt-3 border-t border-gray-100 z-20 relative w-full">
              {topDisciplinas.map((disc, idx) => (
                <span key={idx} className="text-[10px] font-bold text-gray-500 truncate w-full text-center px-1">
                  {disc.nombre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA CENTRAL: Donut Charts Apilados (SVG Corregido) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Donut 1: Distribución de Género */}
          <div className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-gray-100 flex-1 flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              {/* [CORRECCIÓN]: viewBox ampliado a 42x42 y centro en 21x21 para evitar cortes */}
              <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90 drop-shadow-sm overflow-visible">
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f3f4f6" strokeWidth="8"></circle>
                {/* Rosa para mujeres */}
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#ec4899" strokeWidth="8" strokeDasharray={`${statsGenero.fem} ${100 - statsGenero.fem}`} strokeDashoffset="0"></circle>
                {/* Azul para hombres */}
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${statsGenero.masc} ${100 - statsGenero.masc}`} strokeDashoffset={`-${statsGenero.fem}`}></circle>
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">DISTRIBUCIÓN DE GÉNERO</h3>
              <p className="text-[10px] text-gray-500 font-medium mb-3">Proporción de atletas.</p>
              <div className="space-y-1.5">
                <div className="flex items-center text-[10px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2 shadow-sm"></span> Hombres ({statsGenero.masc}%)
                </div>
                <div className="flex items-center text-[10px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#ec4899] mr-2 shadow-sm"></span> Mujeres ({statsGenero.fem}%)
                </div>
              </div>
            </div>
          </div>

          {/* Donut 2: Estatus del Padrón */}
          <div className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-gray-100 flex-1 flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              {/* [CORRECCIÓN]: viewBox ampliado a 42x42 y centro en 21x21 para evitar cortes */}
              <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90 drop-shadow-sm overflow-visible">
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f3f4f6" strokeWidth="8"></circle>
                {/* Naranja para revisión */}
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray={`${pctRevision} ${100 - pctRevision}`} strokeDashoffset="0"></circle>
                {/* Verde para validados */}
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray={`${pctValidos} ${100 - pctValidos}`} strokeDashoffset={`-${pctRevision}`}></circle>
              </svg>
            </div>
            <div className="w-full">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">ESTATUS DEL PADRÓN</h3>
              <p className="text-[10px] text-gray-500 font-medium mb-3">Validados vs Pendientes.</p>
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-600 w-full">
                  <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#10b981] mr-2 shadow-sm"></span> Validados</div>
                  <span className="text-gray-900">{totalValidos}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-600 w-full">
                  <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2 shadow-sm"></span> Pendientes</div>
                  <span className="text-gray-900">{datos.totales.enRevision}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Actividad Reciente */}
        <div className="lg:col-span-3 bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full min-h-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              ACTIVIDAD RECIENTE
            </h3>
          </div>

          <div className="flex-1 relative overflow-y-auto custom-scrollbar pr-2">
            {/* Línea conectora del timeline ajustada */}
            <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-gray-100"></div>

            <div className="space-y-6 relative z-10">
              {cargando ? (
                <div className="text-xs text-gray-400 text-center py-10 font-medium">Cargando actividad...</div>
              ) : datos.recientes.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-10 bg-gray-50 rounded-xl">No hay actividad reciente.</div>
              ) : (
                datos.recientes.map((item, idx) => {
                  const esRevision = item.estatus?.toLowerCase().includes('revisión') || item.estatus?.toLowerCase().includes('pendiente');
                  return (
                    <div key={idx} className="flex gap-4 relative group cursor-default">
                      {/* Punto del timeline (Verde o Naranja) */}
                      <div className={`w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm ${esRevision ? 'bg-[#f59e0b]' : 'bg-[#10b981]'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-gray-900 leading-snug uppercase tracking-wide truncate">
                          {esRevision ? 'EN REVISIÓN: ' : 'VALIDADO: '} 
                          <span className="text-gray-500 font-bold">{item.nombre}</span>
                        </p>
                        <div className="flex justify-between items-center mt-1.5 gap-2">
                          <span className="text-[9px] text-gray-400 font-medium truncate">{item.entrenador || 'Administrador'}</span>
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest shrink-0 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Hoy</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}