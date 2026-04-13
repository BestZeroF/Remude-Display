import React, { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, FileText, Edit, ChevronRight, ArrowDownAZ, ArrowUpZA } from 'lucide-react';

function DropdownFiltro({ label, opciones, seleccionados, setSeleccionados }) {
  const [abierto, setAbierto] = useState(false);
  const drRef = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (drRef.current && !drRef.current.contains(e.target)) setAbierto(false); };
    document.addEventListener("mousedown", fn); 
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className="relative" ref={drRef}>
      <button onClick={() => setAbierto(!abierto)} className={`bg-white border text-[11px] rounded-xl py-3 px-4 outline-none font-bold uppercase tracking-widest flex items-center justify-between min-w-40 shadow-sm hover:bg-gray-100 hover:border-gray-400 ${seleccionados.length > 0 ? 'border-[#c2a649] text-gray-900' : 'border-gray-200 text-gray-500'}`}>
        {label} {seleccionados.length > 0 && `(${seleccionados.length})`}
      </button>
      {abierto && (
        <div className="absolute z-20 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-60 overflow-y-auto">
          {opciones.map(opt => (
            <label key={opt} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={seleccionados.includes(opt)} onChange={() => setSeleccionados(seleccionados.includes(opt) ? seleccionados.filter(i => i !== opt) : [...seleccionados, opt])} className="mr-3 w-4 h-4 accent-[#7a2031]" />
              <span className="text-xs font-medium text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VistaDelegacion({ cambiarVistaPanel }) {
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  
  const [filtros, setFiltros] = useState({ estatus: [], disciplina: [], division: [], club: [] });
  const [atletas, setAtletas] = useState([]);

  useEffect(() => {
    const fetchDelegacion = async () => {
      setCargando(true);
      try {
        const token = localStorage.getItem('token_remude');
        const res = await fetch('http://localhost:3000/api/entrenadores/mis-atletas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setAtletas(Array.isArray(data) ? data : (data.atletas || []));
        } else {
          setAtletas([]);
        }
      } catch (error) {
        console.error('Error al obtener la delegación:', error);
        setAtletas([]);
      } finally {
        setCargando(false);
      }
    };

    fetchDelegacion();
  }, []);

  const opDis = [...new Set(atletas.map(a => a.disciplina).filter(Boolean))].sort();
  const opDiv = [...new Set(atletas.map(a => a.division).filter(Boolean))].sort();
  const opClu = [...new Set(atletas.map(a => a.club).filter(Boolean))].sort();

  const procesados = atletas
    .filter(a => {
      const cumpleBusqueda = busqueda === '' || 
        (a.nombre_completo || a.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) || 
        (a.curp || '').toLowerCase().includes(busqueda.toLowerCase());
      
      const cumpleEstatus = filtros.estatus.length === 0 || filtros.estatus.includes(a.estatus || a.nombre_estatus);
      const cumpleDisciplina = filtros.disciplina.length === 0 || filtros.disciplina.includes(a.disciplina);
      const cumpleDivision = filtros.division.length === 0 || filtros.division.includes(a.division);
      const cumpleClub = filtros.club.length === 0 || filtros.club.includes(a.club);

      return cumpleBusqueda && cumpleEstatus && cumpleDisciplina && cumpleDivision && cumpleClub;
    })
    .sort((a, b) => {
      const nombreA = a.nombre_completo || a.nombre || '';
      const nombreB = b.nombre_completo || b.nombre || '';
      const comparacion = nombreA.localeCompare(nombreB);
      return ordenAscendente ? comparacion : -comparacion;
    });

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in pb-10 flex flex-col h-[calc(100vh-140px)]">
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 mt-2 shrink-0 border border-gray-100">
        <div className="flex flex-col xl:flex-row gap-4 mb-6">
          <div className="flex-1 relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-gray-400 transition-all focus-within:border-[#7a2031] px-4 py-3 flex items-center">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input type="text" placeholder="Buscar por nombre o CURP..." className="bg-transparent outline-none text-sm w-full" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownFiltro label="Estado expediente" opciones={["Pendiente", "En revisión", "Verificado", "Rechazado"]} seleccionados={filtros.estatus} setSeleccionados={v => setFiltros({...filtros, estatus: v})} />
            <DropdownFiltro label="Disciplina" opciones={opDis} seleccionados={filtros.disciplina} setSeleccionados={v => setFiltros({...filtros, disciplina: v})} />
            <DropdownFiltro label="División" opciones={opDiv} seleccionados={filtros.division} setSeleccionados={v => setFiltros({...filtros, division: v})} />
            <DropdownFiltro label="Club" opciones={opClu} seleccionados={filtros.club} setSeleccionados={v => setFiltros({...filtros, club: v})} />
            <button onClick={() => setOrdenAscendente(!ordenAscendente)} className="bg-white border border-gray-200 shadow-sm p-3 rounded-xl hover:bg-gray-100 hover:border-gray-400 hover:text-[#7a2031] transition-all text-gray-600 flex items-center justify-center">
              {ordenAscendente ? <ArrowDownAZ className="w-5 h-5" /> : <ArrowUpZA className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total delegación: {atletas.length}</span>
          <button onClick={() => cambiarVistaPanel('inscripcion')} className="bg-[#7a2031] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#5a1523] flex items-center text-xs"><UserPlus className="w-4 h-4 mr-2" /> Nuevo atleta</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {cargando ? (
          <div className="text-center py-12 text-gray-400 font-medium">Cargando delegación...</div>
        ) : procesados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm text-gray-500 border border-gray-100">No se encontraron atletas.</div>
        ) : (
          procesados.map(a => {
            const estatusReal = a.estatus || a.nombre_estatus || 'Pendiente';
            const nombreMostrar = a.nombre_completo || a.nombre || 'Sin nombre';
            // NUEVO: Aseguramos tener el ID correcto
            const idSeguro = a.id_atleta || a.id_usuario || a.id;
            
            return (
              <div key={idSeguro} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-6 cursor-pointer hover:shadow-md transition-all group" onClick={() => cambiarVistaPanel('perfilAtleta', idSeguro)}>
                <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-xl shadow-inner shrink-0">
                  {nombreMostrar[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#7a2031] transition-colors">{nombreMostrar}</h3>
                  <div className="flex flex-wrap gap-2 mt-1 text-[10px] font-bold uppercase tracking-widest">
                    <span className="bg-[#c2a649]/10 text-[#c2a649] px-2 py-0.5 rounded">{a.disciplina || 'Sin Disciplina'}</span>
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{a.division || 'Sin División'}</span>
                    {a.club && <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded truncate max-w-50" title={a.club}>{a.club}</span>}
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${estatusReal.toLowerCase() === 'verificado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {estatusReal}
                </div>
                <div className="flex gap-3">
                  <div onClick={(e) => { e.stopPropagation(); cambiarVistaPanel('perfilAtleta', idSeguro, 'editar'); }}>
                    <ProgressBtn label="Ficha" pct={a.progreso_ficha || 0} color="[#7a2031]" Icon={Edit} />
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); cambiarVistaPanel('perfilAtleta', idSeguro, 'docs'); }}>
                    <ProgressBtn label="Docs" pct={a.progreso_docs || 0} color="[#c2a649]" Icon={FileText} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#7a2031]" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ProgressBtn(props) {
  const { label, pct, color } = props;
  const IconoComponente = props.Icon;
  return (
    <div className="flex flex-col items-center">
      <div className={`p-2.5 bg-gray-50 rounded-xl relative border border-transparent hover:border-${color} text-gray-400 hover:text-${color}`}>
        <IconoComponente className="w-4 h-4" />
        <span className={`absolute -top-2 -right-2 text-[8px] font-black px-1 rounded-sm shadow-sm ${pct === 100 ? 'bg-green-500 text-white' : 'bg-amber-400 text-amber-950'}`}>{pct}%</span>
      </div>
      <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{label}</span>
    </div>
  );
}
