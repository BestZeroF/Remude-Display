// src/views/admin/VistaPadronEntrenadores.jsx
import React, { useState, useEffect } from 'react';
import { Search, UserCog, Mail, Phone, Eye, Edit, Trash2, Users } from 'lucide-react';

export default function VistaPadronEntrenadores() {
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [entrenadores, setEntrenadores] = useState([]);

  // Simulamos carga de datos del backend
  useEffect(() => {
    setTimeout(() => {
      setEntrenadores([
        { id: 1, nombre: "Gerardo Amaro Buitron", curp: "AABG061118HQRMTRA4", especialidad: "Ciclismo / Triatlón", correo: "gerardo.amaro@correo.com", atletas: 12, estatus: "Pendiente" },
        { id: 2, nombre: "Victoria Isabel Piña Poot", curp: "PIPV991122MQRXTC07", especialidad: "Levantamiento de Pesas", correo: "vicky.pina@correo.com", atletas: 8, estatus: "Validado" },
        { id: 3, nombre: "Juan Carlos Pérez", curp: "PEJC850505HQRTTA01", especialidad: "Fútbol / Atletismo", correo: "juan.perez@correo.com", atletas: 25, estatus: "En revisión" },
        { id: 4, nombre: "Luis Alberto Gómez", curp: "GOLL900101MQRXTC03", especialidad: "Boxeo", correo: "luis.gomez@correo.com", atletas: 5, estatus: "Rechazado" },
      ]);
      setCargando(false);
    }, 600);
  }, []);

  // Lógica de filtrado
  const entrenadoresFiltrados = entrenadores.filter(e => {
    const coincideBusqueda = busqueda === '' || 
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      e.curp.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.especialidad.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideFiltro = filtroActivo === 'Todos' || e.estatus === filtroActivo;

    return coincideBusqueda && coincideFiltro;
  });

  const getIniciales = (nombre) => {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getColorEstatus = (estatus) => {
    switch(estatus.toLowerCase()) {
      case 'validado': return 'bg-green-50 text-green-700 border-green-200';
      case 'pendiente': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'en revisión': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rechazado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      
      {/* HEADER TÍTULO */}
      <div className="mb-6 mt-2 shrink-0">
        <h2 className="text-3xl font-black text-[#7a2031] tracking-tight">Padrón de Entrenadores</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Registro oficial de entrenadores, auxiliares y coordinadores municipales.</p>
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
            placeholder="Buscar por Nombre, CURP o Disciplina..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none text-sm text-gray-800 focus:bg-white focus:border-[#7a2031] focus:ring-1 focus:ring-[#7a2031] transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Filtros tipo "Píldora" */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-center">
          {['Todos', 'Validado', 'En revisión', 'Pendiente', 'Rechazado'].map((filtro) => (
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

      {/* LISTA DE ENTRENADORES */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-12">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        `}</style>

        {cargando ? (
          <div className="text-center py-12 text-gray-400 font-medium">Cargando padrón de entrenadores...</div>
        ) : entrenadoresFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm text-gray-500 border border-gray-100">No se encontraron entrenadores.</div>
        ) : (
          entrenadoresFiltrados.map((entrenador) => (
            <div key={entrenador.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-12 gap-6 items-center hover:shadow-md transition-shadow group">
              
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
                <div className="flex items-center text-xs text-gray-500 font-medium">
                  <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" /> {entrenador.correo}
                </div>
                <div className="flex items-center text-xs text-gray-500 font-bold">
                  <Users className="w-3.5 h-3.5 mr-2 text-[#7a2031]" /> {entrenador.atletas} Atletas a cargo
                </div>
              </div>

              {/* Estatus */}
              <div className="col-span-2 w-full flex justify-start md:justify-center">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm inline-flex items-center ${getColorEstatus(entrenador.estatus)}`}>
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
                <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Eliminar">
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