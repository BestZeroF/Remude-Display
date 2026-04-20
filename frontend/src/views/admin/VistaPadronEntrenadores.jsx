// src/views/admin/VistaPadronEntrenadores.jsx
import React, { useState, useEffect } from 'react';
import { Search, UserCog, Mail, Eye, Edit, Trash2, Users, RefreshCw, Plus, X, Save } from 'lucide-react';

export default function VistaPadronEntrenadores({ abrirPerfil }) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [entrenadores, setEntrenadores] = useState([]);

  // Estados para el Modal de Simulación
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    curp: '',
    especialidad: '',
    correo: ''
  });

  useEffect(() => {
    cargarDatosSimulados();
  }, []);

  const cargarDatosSimulados = () => {
    setCargando(true);
    
    setTimeout(() => {
      setEntrenadores([
        {
          id_usuario: 2001,
          nombre: 'Gerardo Amaro',
          curp: 'AABG850101HQRMXX01',
          especialidad: 'Natación',
          correo: 'gerardo.amaro@remude.com',
          atletas_a_cargo: 15,
          estatus: 'Activo'
        },
        {
          id_usuario: 2002,
          nombre: 'Victoria Piña Poot',
          curp: 'PIPV900512MQRRXX02',
          especialidad: 'Atletismo',
          correo: 'vicky.track@outlook.com',
          atletas_a_cargo: 22,
          estatus: 'Activo'
        },
        {
          id_usuario: 2003,
          nombre: 'Carlos Mendoza',
          curp: 'MEGC820315HQRMXX03',
          especialidad: 'Fútbol',
          correo: 'carlos.coach@yahoo.com',
          atletas_a_cargo: 30,
          estatus: 'Activo'
        },
        {
          id_usuario: 2004,
          nombre: 'Ana María López',
          curp: 'LOPA950822MQRRXX04',
          especialidad: 'Voleibol',
          correo: 'ana.volley@gmail.com',
          atletas_a_cargo: 0,
          estatus: 'Inactivo'
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
    
    // Simulación de guardado
    setTimeout(() => {
      const nuevoEntrenador = {
        id_usuario: Date.now(),
        nombre: `${formData.nombre} ${formData.apellidos}`.trim(),
        curp: formData.curp.toUpperCase(),
        especialidad: formData.especialidad || 'General',
        correo: formData.correo || 'sin_correo@remude.com',
        atletas_a_cargo: 0,
        estatus: 'Activo'
      };

      setEntrenadores([nuevoEntrenador, ...entrenadores]);
      setMostrarModal(false);
      setFormData({ nombre: '', apellidos: '', curp: '', especialidad: '', correo: '' });
      setGuardando(false);
    }, 500);
  };

  const entrenadoresFiltrados = entrenadores.filter(e => {
    const cumpleBusqueda = e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.curp.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleFiltro = filtroActivo === 'Todos' || e.estatus === filtroActivo;
    return cumpleBusqueda && cumpleFiltro;
  });

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in flex flex-col h-[calc(100vh-140px)] relative">
      
      {/* Título unificado */}
      <div className="flex justify-between items-center mb-6 mt-2 shrink-0">
        <div>
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">
            PADRÓN DE ENTRENADORES
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Gestión simulada de plantilla técnica.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={cargarDatosSimulados} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#7a2031] transition-all shadow-sm">
            <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setMostrarModal(true)}
            className="bg-[#0f172a] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-gray-800 transition-all flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Nuevo entrenador
          </button>
        </div>
      </div>

      {/* Caja de filtros redondeada estilo [2rem] */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-6 mb-6 shrink-0 flex flex-col xl:flex-row gap-6 justify-between items-center">
        <div className="relative w-full xl:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text" placeholder="Buscar por Nombre o CURP..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-[#7a2031] transition-all outline-none"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['Todos', 'Activo', 'Inactivo'].map((f) => (
            <button key={f} onClick={() => setFiltroActivo(f)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filtroActivo === f ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Entrenadores */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-12">
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>
        
        {cargando ? (
          <div className="text-center py-20 text-gray-400 font-bold flex flex-col items-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a2031] mb-4"></div>
             Cargando padrón simulado...
          </div>
        ) : (
          entrenadoresFiltrados.map((entrenador) => (
            <div key={entrenador.id_usuario} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 md:grid md:grid-cols-12 gap-6 items-center hover:shadow-md transition-all group">
              <div className="col-span-5 flex items-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-xl shadow-inner">
                  {entrenador.nombre.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                </div>
                <div className="ml-5">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-[#7a2031] transition-colors">{entrenador.nombre}</h3>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-400 font-mono">{entrenador.curp}</span>
                    <span className="text-xs font-bold text-[#c2a649] uppercase tracking-widest mt-1">{entrenador.especialidad}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-3 space-y-1">
                <div className="flex items-center text-xs text-gray-500 font-medium"><Mail className="w-3.5 h-3.5 mr-2" /> {entrenador.correo}</div>
                <div className="flex items-center text-xs text-gray-500 font-bold"><Users className="w-3.5 h-3.5 mr-2 text-[#7a2031]" /> {entrenador.atletas_a_cargo} Atletas asignados</div>
              </div>
              <div className="col-span-2 flex justify-center">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border shadow-sm ${entrenador.estatus === 'Activo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${entrenador.estatus === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {entrenador.estatus}
                </span>
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <button onClick={() => abrirPerfil(entrenador.id_usuario, 'entrenador')} className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Ver Perfil"><Eye className="w-5 h-5" /></button>
                <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#7a2031] hover:bg-red-50 rounded-xl transition-all" title="Editar"><Edit className="w-5 h-5" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================================================
          MODAL DE REGISTRO DE ENTRENADOR (FRONTEND ONLY)
          ========================================================= */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-black text-gray-800 text-lg flex items-center uppercase tracking-widest">
                <UserCog className="w-5 h-5 mr-2 text-[#7a2031]" />
                Registrar nuevo entrenador
              </h3>
              <button onClick={() => setMostrarModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="formEntrenador" onSubmit={manejarRegistro} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre(s)*</label>
                    <input 
                      type="text" name="nombre" required 
                      value={formData.nombre} onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                      placeholder="Ej. Victoria"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Apellidos*</label>
                    <input 
                      type="text" name="apellidos" required 
                      value={formData.apellidos} onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                      placeholder="Ej. Piña Poot"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">CURP*</label>
                    <input 
                      type="text" name="curp" required maxLength="18"
                      value={formData.curp} onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all uppercase"
                      placeholder="18 caracteres"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Especialidad</label>
                    <select 
                      name="especialidad" value={formData.especialidad} onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                    >
                      <option value="">-- Seleccionar --</option>
                      <option value="Atletismo">Atletismo</option>
                      <option value="Fútbol">Fútbol</option>
                      <option value="Básquetbol">Básquetbol</option>
                      <option value="Voleibol">Voleibol</option>
                      <option value="Natación">Natación</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Correo Electrónico*</label>
                  <input 
                    type="email" name="correo" required 
                    value={formData.correo} onChange={manejarCambioForm}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

              </form>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 shrink-0">
              <button 
                type="button" onClick={() => setMostrarModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="submit" form="formEntrenador" disabled={guardando}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#0f172a] rounded-xl hover:bg-gray-800 transition-colors shadow-md flex items-center uppercase tracking-widest"
              >
                {guardando ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Guardando...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Guardar Entrenador</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}