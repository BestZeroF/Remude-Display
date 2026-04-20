import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Plus, Search, Calendar, 
  MapPin, Clock, Trash2, Edit, AlertCircle, RefreshCw 
} from 'lucide-react';

export default function VistaCalendarioEventos() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    obtenerEventos();
  }, []);

  const obtenerEventos = async () => {
    try {
      setCargando(true);
      setError(null);
      const token = localStorage.getItem('token_remude');
      
      const respuesta = await fetch('http://localhost:3000/api/eventos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!respuesta.ok) throw new Error('No se pudo cargar el calendario de eventos.');

      const data = await respuesta.json();
      setEventos(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    // Ajuste para evitar desfase de zona horaria
    const fecha = new Date(fechaISO + 'T12:00:00'); 
    return fecha.toLocaleDateString('es-MX', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const eventosFiltrados = eventos.filter(evento => 
    evento.nombre_evento.toLowerCase().includes(busqueda.toLowerCase()) ||
    (evento.descripcion && evento.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      
      {/* HEADER TÍTULO */}
      <div className="mb-6 mt-2 shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-[#7a2031] tracking-tight flex items-center">
            <CalendarDays className="w-8 h-8 mr-3" />
            Calendario de eventos
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Planificación y seguimiento de competencias y torneos.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={obtenerEventos} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#7a2031] transition-all shadow-sm">
            <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-[#7a2031] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#5a1523] transition-all flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Agendar evento
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-6 shrink-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text" 
            placeholder="Buscar por nombre de torneo, liga..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none text-sm focus:bg-white focus:border-[#7a2031] transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA DE EVENTOS */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-12">
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>

        {cargando ? (
          <div className="text-center py-20 text-gray-400 font-bold">Cargando calendario...</div>
        ) : error ? (
          <div className="py-20 text-center bg-red-50 rounded-3xl border border-red-100">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-800 font-bold">{error}</p>
          </div>
        ) : eventosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-lg">No hay eventos próximos agendados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map((evento) => (
              <div key={evento.id_evento} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#7a2031]"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-[#7a2031] transition-colors mb-2">
                      {evento.nombre_evento}
                    </h3>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors bg-gray-50"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors bg-gray-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-1">
                  {evento.descripcion || "Sin descripción proporcionada."}
                </p>

                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-auto">
                  <div className="flex items-center text-xs text-gray-700 font-bold capitalize">
                    <Calendar className="w-4 h-4 mr-3 text-[#c2a649]" />
                    {formatearFecha(evento.fecha_inicio)}
                  </div>
                  {evento.fecha_fin && (
                    <div className="flex items-center text-xs text-gray-500 font-medium capitalize ml-7">
                      <span className="text-gray-400 mr-2 text-[10px] uppercase">Al:</span> {formatearFecha(evento.fecha_fin)}
                    </div>
                  )}
                  <div className="flex items-center text-[10px] text-gray-400 font-black uppercase mt-2 pt-2 border-t border-gray-200/60">
                     Registrado por: {evento.admin_nombre} {evento.admin_apellido}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}