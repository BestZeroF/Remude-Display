// src/views/admin/VistaPadronAtletas.jsx
import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, FileText, Eye, Edit, Trash2 } from 'lucide-react';

export default function VistaPadronAtletas() {
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [atletas, setAtletas] = useState([]);

  // Simulamos carga de datos del backend
  useEffect(() => {
    setTimeout(() => {
      setAtletas([
        { id: 1, nombre: "Daniela Aguilar Medina", curp: "BCDE951213PQRSTU41", municipio: "Bacalar", disciplina: "Natación", club: "Sin Club", estatus: "Validado" },
        { id: 2, nombre: "Gerardo Amaro", curp: "AABG061118HQRMTRA4", municipio: "Bacalar", disciplina: "Ciclismo", club: "Sin Club", estatus: "Validado" },
        { id: 3, nombre: "David Castillo Garcia", curp: "YZ891211ARCDEF56", municipio: "Bacalar", disciplina: "Voleibol", club: "Club Jorge 17", estatus: "En revisión" },
        { id: 4, nombre: "Isabella Castro Castro", curp: "CDEF921124CDEFGH26", municipio: "Bacalar", disciplina: "Béisbol", club: "Sin Club", estatus: "Rechazado" },
        { id: 5, nombre: "Alejandro Castro Garcia", curp: "XYZ921019PQRSTU29", municipio: "Bacalar", disciplina: "Atletismo", club: "Club Francisco 95", estatus: "Pendiente" },
      ]);
      setCargando(false);
    }, 600);
  }, []);

  // Lógica de filtrado
  const atletasFiltrados = atletas.filter(atleta => {
    const coincideBusqueda = busqueda === '' || 
      atleta.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      atleta.curp.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideFiltro = filtroActivo === 'Todos' || atleta.estatus === filtroActivo;

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
        <h2 className="text-3xl font-black text-[#7a2031] tracking-tight">Padrón de Deportistas</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Registro oficial de atletas, disciplinas y clubes deportivos.</p>
      </div>

      {/* BARRA DE HERRAMIENTAS (Buscador, Filtros, Exportación) */}
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
              {filtro === 'Todos' ? filtro : `• ${filtro}`}
            </button>
          ))}
        </div>

        {/* Exportación y Contador */}
        <div className="flex items-center gap-4 w-full xl:w-auto justify-end">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button className="flex items-center px-3 py-2 text-xs font-bold text-gray-600 hover:text-[#217346] hover:bg-white rounded-lg transition-all" title="Exportar a Excel">
              <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Excel
            </button>
            <button className="flex items-center px-3 py-2 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-all" title="Exportar a PDF">
              <FileText className="w-4 h-4 mr-1.5" /> PDF
            </button>
          </div>
          
          <div className="text-right border-l border-gray-200 pl-4 hidden sm:block">
            <p className="text-2xl font-black text-gray-900 leading-none">{atletasFiltrados.length}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atletas</p>
          </div>
        </div>
      </div>

      {/* LISTA DE ATLETAS (Estilo tarjetas horizontales) */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-12">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        `}</style>

        {/* Encabezados de columna (Opcional, pero ayuda a la estructura visual) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-5">Perfil Atlético</div>
          <div className="col-span-3">Disciplina & Club</div>
          <div className="col-span-2 text-center">Estado Oficial</div>
          <div className="col-span-2 text-center">Acciones</div>
        </div>

        {cargando ? (
          <div className="text-center py-12 text-gray-400 font-medium">Cargando padrón...</div>
        ) : atletasFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm text-gray-500 border border-gray-100">No hay registros que coincidan con los filtros.</div>
        ) : (
          atletasFiltrados.map((atleta) => (
            <div key={atleta.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:shadow-md transition-shadow group">
              
              {/* Info Personal */}
              <div className="col-span-5 flex items-center w-full">
                <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-inner">
                  {getIniciales(atleta.nombre)}
                </div>
                <div className="ml-4 truncate">
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#7a2031] transition-colors truncate">{atleta.nombre}</h3>
                  <div className="flex items-center text-[10px] text-gray-400 font-mono mt-0.5 uppercase">
                    {atleta.curp} <span className="mx-1.5">•</span> {atleta.municipio}
                  </div>
                </div>
              </div>

              {/* Disciplina y Club */}
              <div className="col-span-3 w-full flex flex-col justify-center items-start md:items-start">
                <span className="text-[10px] font-black text-[#7a2031] bg-[#7a2031]/10 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                  {atleta.disciplina}
                </span>
                <span className="text-xs text-gray-500 font-medium truncate w-full">
                  {atleta.club}
                </span>
              </div>

              {/* Estatus */}
              <div className="col-span-2 w-full flex justify-start md:justify-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border inline-flex items-center ${getColorEstatus(atleta.estatus)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${atleta.estatus === 'Validado' ? 'bg-green-500' : atleta.estatus === 'Rechazado' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                  {atleta.estatus}
                </span>
              </div>

              {/* Acciones */}
              <div className="col-span-2 w-full flex justify-end md:justify-center gap-1">
                <button className="p-2 text-gray-400 hover:text-[#c2a649] hover:bg-[#c2a649]/10 rounded-lg transition-colors" title="Ver Documentos">
                  <FileText className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver Ficha Completa">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-[#7a2031] hover:bg-red-50 rounded-lg transition-colors" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar/Suspender">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}