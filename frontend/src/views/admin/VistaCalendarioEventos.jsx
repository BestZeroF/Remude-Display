// src/views/admin/VistaCalendarioEventos.jsx
import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Plus, Search, Calendar, 
  MapPin, Clock, Trash2, Edit, AlertCircle, RefreshCw, X, Save 
} from 'lucide-react';

export default function VistaCalendarioEventos() {
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [eventos, setEventos] = useState([]);
  
  // Estados para el Modal de Simulación
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    nombre_evento: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarDatosSimulados();
  }, []);

  const cargarDatosSimulados = () => {
    setCargando(true);
    
    // Simulamos un retraso de red
    setTimeout(() => {
      setEventos([
        {
          id_evento: 1,
          nombre_evento: '1er Maratón Laguna de Bacalar 2026',
          fecha_inicio: '2026-05-15',
          fecha_fin: '2026-05-16',
          descripcion: 'Evento masivo de atletismo con rutas de 5k, 10k y Medio Maratón bordeando la Costera de Bacalar. Se espera la participación de clubes locales y estatales.',
          admin_nombre: 'Gerardo',
          admin_apellido: 'Amaro'
        },
        {
          id_evento: 2,
          nombre_evento: 'Torneo Relámpago de Básquetbol "Pueblo Mágico"',
          fecha_inicio: '2026-06-05',
          fecha_fin: '2026-06-07',
          descripcion: 'Torneo intermunicipal de básquetbol categoría libre varonil y femenil. Sede: Domo Deportivo de la Colonia Centro.',
          admin_nombre: 'Victoria',
          admin_apellido: 'Piña'
        },
        {
          id_evento: 3,
          nombre_evento: 'Clasificatorios Estatales de Natación Aguas Abiertas',
          fecha_inicio: '2026-07-20',
          fecha_fin: null, // Evento de un solo día
          descripcion: 'Competencia oficial para definir la selección que representará a Quintana Roo en las nacionales. Punto de salida: Balneario Municipal.',
          admin_nombre: 'Gerardo',
          admin_apellido: 'Amaro'
        },
        {
          id_evento: 4,
          nombre_evento: 'Liga Municipal de Fútbol Soccer Juvenil - Apertura',
          fecha_inicio: '2026-08-01',
          fecha_fin: '2026-12-15',
          descripcion: 'Inicio de la temporada regular de la liga de fútbol para categorías sub-15 y sub-17. Partidos semanales en la Unidad Deportiva.',
          admin_nombre: 'Victoria',
          admin_apellido: 'Piña'
        }
      ]);
      setCargando(false);
    }, 600);
  };

  const manejarCambioForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const manejarRegistro = (e) => {
    e.preventDefault();
    setGuardando(true);
    
    // Simulación de guardado en DB
    setTimeout(() => {
      const nuevoEvento = {
        id_evento: Date.now(), // ID falso
        nombre_evento: formData.nombre_evento,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin || null,
        descripcion: formData.descripcion || 'Sin descripción.',
        admin_nombre: 'Admin', // Usuario actual simulado
        admin_apellido: 'Local'
      };

      // Ordenar insertando y luego reordenando por fecha de inicio (ascendente)
      const nuevaLista = [...eventos, nuevoEvento].sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));
      
      setEventos(nuevaLista);
      setMostrarModal(false);
      setFormData({ nombre_evento: '', fecha_inicio: '', fecha_fin: '', descripcion: '' });
      setGuardando(false);
    }, 500);
  };

  const eliminarEventoSimulado = (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este evento?')) {
        setEventos(eventos.filter(e => e.id_evento !== id));
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
    <div className="w-full max-w-7xl mx-auto pb-10 animate-fade-in flex flex-col h-[calc(100vh-140px)] relative">
      
      {/* HEADER TÍTULO */}
      <div className="mb-6 mt-2 shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-widest uppercase flex items-center">
            <CalendarDays className="w-6 h-6 mr-3 text-[#7a2031]" />
            CALENDARIO DE EVENTOS
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Planificación y seguimiento de competencias y torneos.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={cargarDatosSimulados} 
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#7a2031] transition-all shadow-sm"
            title="Recargar datos simulados"
          >
            <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setMostrarModal(true)}
            className="bg-[#7a2031] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#5a1523] transition-all flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Agendar evento
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 mb-6 shrink-0">
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
          <div className="text-center py-20 text-gray-400 font-bold flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a2031] mb-4"></div>
            Generando agenda simulada...
          </div>
        ) : eventosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-lg">No hay eventos próximos agendados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map((evento) => (
              <div key={evento.id_evento} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden flex flex-col min-h-[250px]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#7a2031]"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-[#7a2031] transition-colors mb-2">
                      {evento.nombre_evento}
                    </h3>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors bg-gray-50"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => eliminarEventoSimulado(evento.id_evento)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors bg-gray-50"><Trash2 className="w-4 h-4" /></button>
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

      {/* =========================================================
          MODAL DE REGISTRO DE EVENTO (FRONTEND ONLY)
          ========================================================= */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-black text-gray-800 text-lg flex items-center uppercase tracking-widest">
                <CalendarDays className="w-5 h-5 mr-2 text-[#7a2031]" />
                Agendar Nuevo Evento
              </h3>
              <button onClick={() => setMostrarModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="formEvento" onSubmit={manejarRegistro} className="space-y-5">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre del Evento / Torneo*</label>
                  <input 
                    type="text" 
                    name="nombre_evento" 
                    required 
                    value={formData.nombre_evento} 
                    onChange={manejarCambioForm}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                    placeholder="Ej. Torneo Municipal de Voleibol"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Fecha de Inicio*</label>
                    <input 
                      type="date" 
                      name="fecha_inicio" 
                      required
                      value={formData.fecha_inicio} 
                      onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex justify-between">
                      <span>Fecha de Fin</span>
                      <span className="text-[9px] text-gray-400">(Opcional)</span>
                    </label>
                    <input 
                      type="date" 
                      name="fecha_fin" 
                      value={formData.fecha_fin} 
                      onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descripción o Detalles del Evento</label>
                  <textarea 
                    name="descripcion" 
                    rows="4"
                    value={formData.descripcion} 
                    onChange={manejarCambioForm}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all resize-none"
                    placeholder="Agrega información sobre categorías, sedes, horarios, etc."
                  ></textarea>
                </div>

              </form>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 shrink-0">
              <button 
                type="button" 
                onClick={() => setMostrarModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="formEvento"
                disabled={guardando}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#7a2031] rounded-xl hover:bg-[#5a1523] transition-colors shadow-md flex items-center uppercase tracking-widest"
              >
                {guardando ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Guardando...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Agendar Evento</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}