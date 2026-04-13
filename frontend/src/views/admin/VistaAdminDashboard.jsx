// src/views/admin/VistaAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, AlertTriangle, ChevronRight, Activity, Search } from 'lucide-react';

export default function VistaAdminDashboard() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para guardar la información del backend
  const [estadisticas, setEstadisticas] = useState({
    totales: { atletas: 0, entrenadores: 0, enRevision: 0, rechazados: 0 },
    recientes: []
  });

  // Efecto para obtener los datos del servidor al cargar la vista
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = localStorage.getItem('token_remude');
        
        const respuesta = await fetch('http://localhost:3000/api/admin/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Enviamos el JWT para pasar el middleware
          }
        });

        if (!respuesta.ok) {
          throw new Error('Error al obtener datos del servidor');
        }

        const data = await respuesta.json();
        setEstadisticas(data);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setError('No se pudo cargar la información. Revisa la conexión al servidor.');
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  const getEstatusColor = (estatus) => {
    switch(estatus?.toLowerCase()) {
      case 'validado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'en revisión': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex justify-between items-end border-b border-gray-200/60 pb-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest">
            Resumen General
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Métricas principales del padrón municipal
          </p>
        </div>
        <button className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600 flex items-center hover:bg-gray-50 transition-colors">
          <Activity className="w-4 h-4 mr-2 text-[#c2a649]" /> Generar Reporte
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-xl font-bold">{error}</div>
      )}

      {/* TARJETAS DE KPI (Métricas conectadas al estado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-14 h-14 rounded-2xl bg-[#7a2031]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 text-[#7a2031]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Atletas</p>
            <h4 className="text-3xl font-black text-gray-900">
              {cargando ? '...' : estadisticas.totales.atletas}
            </h4>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-14 h-14 rounded-2xl bg-[#c2a649]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <UserCheck className="w-7 h-7 text-[#c2a649]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entrenadores</p>
            <h4 className="text-3xl font-black text-gray-900">
              {cargando ? '...' : estadisticas.totales.entrenadores}
            </h4>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Por Validar</p>
            <h4 className="text-3xl font-black text-gray-900">
              {cargando ? '...' : estadisticas.totales.enRevision}
            </h4>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-7 h-7 text-rose-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rechazados</p>
            <h4 className="text-3xl font-black text-gray-900">
              {cargando ? '...' : estadisticas.totales.rechazados}
            </h4>
          </div>
        </div>
      </div>

      {/* SECCIÓN: TABLA DE ACTIVIDAD RECIENTE */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-lg">Registros Recientes</h3>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text" 
              placeholder="Buscar rápido..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 focus:border-[#7a2031] focus:ring-1 focus:ring-[#7a2031] transition-all bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="p-4 font-bold">Atleta / CURP</th>
                <th className="p-4 font-bold">Disciplina</th>
                <th className="p-4 font-bold">Entrenador</th>
                <th className="p-4 font-bold text-center">Estatus</th>
                <th className="p-4 font-bold text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {cargando ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400 font-medium flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7a2031]"></div>
                    Cargando actividad desde la base de datos...
                  </td>
                </tr>
              ) : estadisticas.recientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400 font-medium">No hay registros recientes.</td>
                </tr>
              ) : (
                estadisticas.recientes.map((fila) => (
                  <tr key={fila.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{fila.nombre}</p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{fila.curp}</p>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                        {fila.disciplina}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{fila.entrenador}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm inline-block ${getEstatusColor(fila.estatus)}`}>
                        {fila.estatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 text-gray-400 hover:text-[#7a2031] hover:bg-red-50 rounded-lg transition-colors inline-flex">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button className="text-[#c2a649] font-bold text-sm hover:text-[#a0883b] transition-colors">
            Ver todo el historial
          </button>
        </div>
      </div>

    </div>
  );
}