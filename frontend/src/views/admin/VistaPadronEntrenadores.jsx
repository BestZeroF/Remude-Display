// src/views/admin/VistaPadronEntrenadores.jsx
import React, { useState, useEffect } from 'react';
import { Search, UserCog, Mail, Phone, Eye, Edit, Trash2, Users, RefreshCw, AlertCircle } from 'lucide-react';

export default function VistaPadronEntrenadores() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [entrenadores, setEntrenadores] = useState([]);

  // Conexión real al backend
  useEffect(() => {
    obtenerEntrenadores();
  }, []);

  const obtenerEntrenadores = async () => {
    try {
      setCargando(true);
      setError(null);
      const token = localStorage.getItem('token_remude');
      
      const respuesta = await fetch('http://localhost:3000/api/admin/usuarios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo conectar con el servidor de usuarios.');
      }

      const data = await respuesta.json();
      
      // [CORRECCIÓN V8.2] -> Filtramos usando nombre_rol en lugar de id_rol
      const soloEntrenadores = data.usuarios
        .filter(u => u.nombre_rol && u.nombre_rol.toLowerCase() === 'entrenador')
        .map(u => ({
          id_usuario: u.id_usuario,
          nombre: `${u.nombre} ${u.primer_apellido} ${u.segundo_apellido || ''}`.trim(),
          curp: u.curp || 'Sin CURP',
          especialidad: 'Multidisciplinario', // Nota: El controlador de admin no trae la especialidad, usamos fallback
          correo: u.correo,
          atletas_a_cargo: 0, // Fallback visual
          estatus: u.estado_cuenta ? 'Activo' : 'Inactivo',
        }));

      setEntrenadores(soloEntrenadores);
    } catch (err) {
      console.error("Error cargando entrenadores:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const getColorEstatus = (estatus) => {
    switch (estatus.toLowerCase()) {
      case 'activo': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactivo': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIniciales = (nombre) => {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const entrenadoresFiltrados = entrenadores.filter(entrenador => {
    const cumpleBusqueda = entrenador.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          entrenador.curp.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleFiltro = filtroActivo === 'Todos' || entrenador.estatus === filtroActivo;
    return cumpleBusqueda && cumpleFiltro;
  });

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      
      {/* HEADER TÍTULO */}
      <div className="mb-6 mt-2 shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-[#7a2031] tracking-tight flex items-center">
            <UserCog className="w-8 h-8 mr-3" />
            Padrón de Entrenadores
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Gestión y monitoreo de la plantilla técnica municipal.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={obtenerEntrenadores}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#7a2031] hover:border-[#7a2031] transition-all shadow-sm"
            title="Actualizar lista"
          >
            <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-[#7a2031] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#5a1523] transition-all flex items-center">
            <UserCog className="w-4 h-4 mr-2" /> Nuevo Entrenador
          </button>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-6 shrink-0 flex flex-col xl:flex-row gap-4 justify-between items-center">
        
        {/* Buscador */}
        <div className="relative w-full xl:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text" 
            placeholder="Buscar por Nombre o CURP..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none text-sm text-gray-800 focus:bg-white focus:border-[#7a2031] focus:ring-1 focus:ring-[#7a2031] transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Filtros tipo "Píldora" */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-center">
          {['Todos', 'Activo', 'Inactivo'].map((filtro) => (
            <button
              key={filtro}
              onClick={() => setFiltroActivo(filtro)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                filtroActivo === filtro 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filtro === 'Todos' ? filtro : filtro}
            </button>
          ))}
        </div>

        {/* Contador */}
        <div className="text-right border-l border-gray-200 pl-6 hidden xl:block">
          <p className="text-2xl font-black text-gray-900 leading-none">{entrenadoresFiltrados.length}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entrenadores Totales</p>
        </div>
      </div>

      {/* ESTADO DE CARGA / ERROR */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl font-bold border border-red-200 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" /> {error}
        </div>
      )}

      {/* LISTA DE ENTRENADORES */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-12">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        `}</style>

        {cargando ? (
          <div className="text-center py-12 text-gray-400 font-medium flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a2031] mb-4"></div>
             Cargando padrón de entrenadores...
          </div>
        ) : entrenadoresFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm text-gray-500 border border-gray-100">
             <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             No se encontraron entrenadores que coincidan con la búsqueda.
          </div>
        ) : (
          entrenadoresFiltrados.map((entrenador) => (
            <div key={entrenador.id_usuario} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-12 gap-6 items-center hover:shadow-md transition-shadow group">
              
              {/* Perfil Profesional */}
              <div className="col-span-5 flex items-center w-full">
                <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-inner">
                  {getIniciales(entrenador.nombre)}
                </div>
                <div className="ml-5 truncate">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-[#7a2031] transition-colors truncate">{entrenador.nombre}</h3>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-[11px] text-gray-400 font-mono uppercase tracking-tighter">{entrenador.curp}</span>
                    <span className="text-xs font-bold text-[#c2a649] uppercase tracking-widest mt-0.5">{entrenador.especialidad}</span>
                  </div>
                </div>
              </div>

              {/* Contacto e Info */}
              <div className="col-span-3 w-full flex flex-col justify-center space-y-1.5">
                <div className="flex items-center text-xs text-gray-500 font-medium truncate">
                  <Mail className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" /> <span className="truncate">{entrenador.correo}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 font-bold">
                  <Users className="w-3.5 h-3.5 mr-2 text-[#7a2031]" /> {entrenador.atletas_a_cargo} Atletas a cargo
                </div>
              </div>

              {/* Estatus */}
              <div className="col-span-2 w-full flex justify-start md:justify-center">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm inline-flex items-center ${getColorEstatus(entrenador.estatus)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${entrenador.estatus === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {entrenador.estatus}
                </span>
              </div>

              {/* Acciones */}
              <div className="col-span-2 w-full flex justify-end md:justify-center gap-2">
                <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Ver Perfil">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#7a2031] hover:bg-red-50 rounded-xl transition-all" title="Editar">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Dar de baja">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}