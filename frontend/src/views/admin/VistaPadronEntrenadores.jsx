// src/views/admin/VistaPadronEntrenadores.jsx
import React, { useState, useEffect } from 'react';
import { Search, UserCog, Mail, Eye, Edit, Trash2, Users, RefreshCw } from 'lucide-react';

export default function VistaPadronEntrenadores({ abrirPerfil }) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [entrenadores, setEntrenadores] = useState([]);

  useEffect(() => {
    obtenerEntrenadores();
  }, []);

  const obtenerEntrenadores = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token_remude');
      const respuesta = await fetch('http://localhost:3000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!respuesta.ok) throw new Error('Error de conexión');
      const data = await respuesta.json();
      
      const soloEntrenadores = data.usuarios
        .filter(u => u.nombre_rol && u.nombre_rol.toLowerCase() === 'entrenador')
        .map(u => ({
          id_usuario: u.id_usuario,
          nombre: `${u.nombre} ${u.primer_apellido} ${u.segundo_apellido || ''}`.trim(),
          curp: u.curp || 'Sin CURP',
          especialidad: u.especialidad || 'Disciplina no asignada',
          correo: u.correo,
          atletas_a_cargo: u.total_atletas || 0,
          estatus: u.estado_cuenta ? 'Activo' : 'Inactivo',
        }));
      setEntrenadores(soloEntrenadores);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const entrenadoresFiltrados = entrenadores.filter(e => {
    const cumpleBusqueda = e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.curp.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleFiltro = filtroActivo === 'Todos' || e.estatus === filtroActivo;
    return cumpleBusqueda && cumpleFiltro;
  });

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in flex flex-col h-full">
      
      {/* Título unificado */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">
          PADRÓN DE ENTRENADORES
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={obtenerEntrenadores} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#7a2031] transition-all shadow-sm">
            <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-[#0f172a] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-gray-800 transition-all">
            + Nuevo Entrenador
          </button>
        </div>
      </div>

      {/* Caja de filtros redondeada estilo [2rem] */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col xl:flex-row gap-6 justify-between items-center">
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
      <div className="flex-1 space-y-4">
        {cargando ? (
          <div className="text-center py-20 text-gray-400 font-bold">Cargando padrón oficial...</div>
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
    </div>
  );
}