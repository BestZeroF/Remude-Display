import React, { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, FileText, Edit, ChevronRight, ArrowDownAZ, ArrowUpZA, Image as ImageIcon } from 'lucide-react';

// Componente auxiliar para los filtros multi-selección
function DropdownFiltro({ label, opciones, seleccionados, setSeleccionados }) {
  const [abierto, setAbierto] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const toggleOpcion = (opcion) => {
    if (seleccionados.includes(opcion)) {
      setSeleccionados(seleccionados.filter(item => item !== opcion));
    } else {
      setSeleccionados([...seleccionados, opcion]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setAbierto(!abierto)} 
        // APLICADO: Hover más oscuro (bg-gray-100 y border-gray-400)
        className={`bg-white border text-sm rounded-xl py-3.5 px-4 outline-none transition-all font-medium flex items-center justify-between min-w-40 shadow-sm hover:bg-gray-100 hover:border-gray-400 ${abierto || seleccionados.length > 0 ? 'border-[#c2a649] text-gray-900 ring-1 ring-[#c2a649]/20' : 'border-gray-200 text-gray-700'}`}
      >
        <span>{label} {seleccionados.length > 0 && `(${seleccionados.length})`}</span>
      </button>
      
      {abierto && (
        <div className="absolute z-20 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto">
          {opciones.map(opt => (
            <label key={opt} className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={seleccionados.includes(opt)} 
                onChange={() => toggleOpcion(opt)} 
                className="mr-3 w-4 h-4 text-[#7a2031] rounded border-gray-300 focus:ring-[#7a2031]" 
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
          {opciones.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">Sin opciones</div>}
        </div>
      )}
    </div>
  );
}

export default function VistaDelegacion({ cambiarVistaPanel }) {
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  
  const [filtroEstatus, setFiltroEstatus] = useState([]);
  const [filtroDisciplina, setFiltroDisciplina] = useState([]);
  const [filtroDivision, setFiltroDivision] = useState([]);
  const [filtroClub, setFiltroClub] = useState([]);
  
  const [atletas, setAtletas] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setAtletas([
        { id: 104, nombre_completo: "Gerardo Amaro", curp: "AABG061118HQRMTRA4", disciplina: "Ciclismo", division: "Libre", club: "Pedales de Fuego Bacalar", estatus: "Verificado", progreso_ficha: 100, progreso_docs: 100, foto: "[https://i.pravatar.cc/150?u=104](https://i.pravatar.cc/150?u=104)" },
        { id: 105, nombre_completo: "David Jhonson Alvaro", curp: "AABG061118HQRMTRA3", disciplina: "Boxeo", division: "Juvenil", club: "Tigres del Ring", estatus: "Pendiente", progreso_ficha: 45, progreso_docs: 0, foto: null },
        { id: 106, nombre_completo: "Victoria Isabel Piña Poot", curp: "PIPV991122MQRXTC07", disciplina: "Levantamiento de pesas", division: "Libre", club: "Titanes del Sur Centro Deportivo", estatus: "Verificado", progreso_ficha: 100, progreso_docs: 80, foto: "[https://i.pravatar.cc/150?u=106](https://i.pravatar.cc/150?u=106)" },
        { id: 107, nombre_completo: "Carlos Manuel Sosa", curp: "SOMA010203HQRTTA01", disciplina: "Natación", division: "Infantil", club: "Delfines Azules", estatus: "En revisión", progreso_ficha: 100, progreso_docs: 100, foto: null },
        { id: 108, nombre_completo: "Ana María López", curp: "LOPA050505HQRTTA02", disciplina: "Atletismo", division: "Libre", club: "Corredores Mayas", estatus: "Rechazado", progreso_ficha: 100, progreso_docs: 20, foto: "[https://i.pravatar.cc/150?u=108](https://i.pravatar.cc/150?u=108)" },
      ]);
      setCargando(false);
    }, 800);
  }, []);

  const opcionesEstatus = ["En revisión", "Pendiente", "Rechazado", "Verificado"];
  const opcionesDisciplina = [...new Set(atletas.map(a => a.disciplina))].sort((a, b) => a.localeCompare(b));
  const opcionesDivision = [...new Set(atletas.map(a => a.division))].sort((a, b) => a.localeCompare(b));
  const opcionesClub = [...new Set(atletas.map(a => a.club))].sort((a, b) => a.localeCompare(b));

  const getColorEstatus = (estatus) => {
    switch(estatus.toLowerCase()) {
      case 'verificado': return 'bg-green-100 text-green-800 shadow-sm';
      case 'pendiente': return 'bg-gray-100 text-gray-800 shadow-sm';
      case 'en revisión': return 'bg-amber-100 text-amber-800 shadow-sm';
      case 'rechazado': return 'bg-red-100 text-red-800 shadow-sm';
      default: return 'bg-gray-100 text-gray-800 shadow-sm';
    }
  };

  const getIniciales = (nombre) => {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const atletasProcesados = atletas
    .filter(atleta => {
      const cumpleBusqueda = busqueda === '' || 
        atleta.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) || 
        atleta.curp.toLowerCase().includes(busqueda.toLowerCase());
      
      const cumpleEstatus = filtroEstatus.length === 0 || filtroEstatus.includes(atleta.estatus);
      const cumpleDisciplina = filtroDisciplina.length === 0 || filtroDisciplina.includes(atleta.disciplina);
      const cumpleDivision = filtroDivision.length === 0 || filtroDivision.includes(atleta.division);
      const cumpleClub = filtroClub.length === 0 || filtroClub.includes(atleta.club);

      return cumpleBusqueda && cumpleEstatus && cumpleDisciplina && cumpleDivision && cumpleClub;
    })
    .sort((a, b) => {
      const comparacion = a.nombre_completo.localeCompare(b.nombre_completo);
      return ordenAscendente ? comparacion : -comparacion;
    });

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in pb-10 flex flex-col h-[calc(100vh-140px)]">
      
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 mt-2 shrink-0">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
          
          <div className="flex-1 w-full relative bg-white border border-gray-200 rounded-2xl shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 focus-within:border-[#7a2031] focus-within:ring-1 focus-within:ring-[#7a2031] focus-within:bg-white focus-within:hover:border-[#7a2031]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text" 
              placeholder="Buscar por nombre o CURP..."
              className="block w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-sm text-gray-800"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full xl:w-auto">
            <DropdownFiltro label="Estado expediente" opciones={opcionesEstatus} seleccionados={filtroEstatus} setSeleccionados={setFiltroEstatus} />
            <DropdownFiltro label="Disciplina" opciones={opcionesDisciplina} seleccionados={filtroDisciplina} setSeleccionados={setFiltroDisciplina} />
            <DropdownFiltro label="División" opciones={opcionesDivision} seleccionados={filtroDivision} setSeleccionados={setFiltroDivision} />
            <DropdownFiltro label="Club" opciones={opcionesClub} seleccionados={filtroClub} setSeleccionados={setFiltroClub} />
            
            <button 
              onClick={() => setOrdenAscendente(!ordenAscendente)}
              className="bg-white border border-gray-200 shadow-sm p-3.5 rounded-xl hover:bg-gray-100 hover:border-gray-400 hover:text-[#7a2031] transition-all text-gray-600 flex items-center justify-center"
              title={ordenAscendente ? "Ordenar Z-A" : "Ordenar A-Z"}
            >
              {ordenAscendente ? <ArrowDownAZ className="w-5 h-5" /> : <ArrowUpZA className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
              Total delegación: {atletas.length}
            </span>
          </div>
          <button 
            onClick={() => cambiarVistaPanel('inscripcion')}
            className="bg-[#7a2031] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#5a1523] transition-all flex items-center text-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Nuevo atleta
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-12">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        `}</style>

        {cargando ? (
          <div className="text-center py-12 text-gray-400 font-medium">Cargando delegación...</div>
        ) : atletasProcesados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm text-gray-500 border border-gray-100">No se encontraron atletas que coincidan con los filtros.</div>
        ) : (
          atletasProcesados.map(atleta => (
            <div key={atleta.id} className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col md:flex-row items-center gap-6 cursor-pointer group" onClick={() => cambiarVistaPanel('perfilAtleta')}>
              
              <div className="flex items-center flex-1 w-full md:w-auto">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 text-gray-400 flex items-center justify-center font-black text-xl shrink-0 shadow-inner border border-gray-200">
                  {atleta.foto ? (
                    <img src={atleta.foto} alt={atleta.nombre_completo} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span>{getIniciales(atleta.nombre_completo)}</span>
                  )}
                </div>
                
                <div className="ml-5">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#7a2031] transition-colors">{atleta.nombre_completo}</h3>
                  <div className="flex items-center mt-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest flex-wrap gap-x-2 gap-y-1">
                    <span className="text-[#c2a649] bg-[#c2a649]/10 px-2 py-0.5 rounded-md">{atleta.disciplina}</span>
                    <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{atleta.division}</span>
                    <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-37.5 sm:max-w-50 lg:max-w-75" title={atleta.club}>{atleta.club}</span>
                  </div>
                  <div className="mt-1.5 font-mono text-xs text-gray-400">{atleta.curp}</div>
                </div>
              </div>

              <div className="w-full md:w-auto flex justify-start md:justify-center px-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${getColorEstatus(atleta.estatus)}`}>
                  {atleta.estatus}
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                
                <div className="flex flex-col items-center" onClick={(e) => { e.stopPropagation(); alert(`Ir a editar ficha de ${atleta.nombre_completo}`); }}>
                  <button className="p-3 bg-gray-50 rounded-xl hover:bg-[#7a2031] hover:text-white transition-colors text-gray-600 relative border border-transparent hover:border-[#7a2031]" title="Editar ficha técnica">
                    <Edit className="w-5 h-5" />
                    <span className={`absolute -top-2 -right-2 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-white ${atleta.progreso_ficha === 100 ? 'bg-green-500 text-white' : 'bg-amber-400 text-amber-950'}`}>
                      {atleta.progreso_ficha}%
                    </span>
                  </button>
                  <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Ficha</span>
                </div>

                <div className="flex flex-col items-center" onClick={(e) => { e.stopPropagation(); alert(`Ir a subir documentos de ${atleta.nombre_completo}`); }}>
                  <button className="p-3 bg-gray-50 rounded-xl hover:bg-[#c2a649] hover:text-white transition-colors text-gray-600 relative border border-transparent hover:border-[#c2a649]" title="Subir documentos">
                    <FileText className="w-5 h-5" />
                    <span className={`absolute -top-2 -right-2 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-white ${atleta.progreso_docs === 100 ? 'bg-green-500 text-white' : 'bg-amber-400 text-amber-950'}`}>
                      {atleta.progreso_docs}%
                    </span>
                  </button>
                  <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Docs</span>
                </div>

                <div className="w-px h-10 bg-gray-200 mx-2 hidden sm:block"></div>

                <button className="p-3 text-gray-300 group-hover:text-[#7a2031] transition-colors" title="Ver perfil completo">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
