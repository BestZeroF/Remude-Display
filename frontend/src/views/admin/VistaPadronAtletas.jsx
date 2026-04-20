// src/views/admin/VistaPadronAtletas.jsx
import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, CheckCircle, XCircle, RefreshCw, FileText } from 'lucide-react';

export default function VistaPadronAtletas({ abrirPerfil }) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [atletas, setAtletas] = useState([]);

  useEffect(() => {
    obtenerAtletas();
  }, []);

  const obtenerAtletas = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token_remude');
      const respuesta = await fetch('http://localhost:3000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!respuesta.ok) throw new Error('Error al obtener el padrón');
      const data = await respuesta.json();
      
      const atletasMapeados = data.usuarios
        .filter(u => u.nombre_rol && u.nombre_rol.toLowerCase() === 'atleta')
        .map(u => ({
          id_usuario: u.id_usuario,
          nombre: `${u.nombre} ${u.primer_apellido} ${u.segundo_apellido || ''}`.trim(),
          curp: u.curp || 'Sin CURP',
          municipio: "Bacalar", 
          disciplina: u.disciplina_atleta || 'Sin asignar',
          entrenador: u.nombre_entrenador ? `${u.nombre_entrenador} ${u.apellido_entrenador}` : "Sin entrenador",
          estatus: u.estatus_atleta || 'Pendiente',
          progreso: parseInt(u.progreso_ficha) || 0
        }));
      setAtletas(atletasMapeados);
    } catch (err) {
      setError('No se pudo cargar el padrón de deportistas.');
    } finally {
      setCargando(false);
    }
  };

  const atletasFiltrados = atletas.filter(atleta => {
    const coincideBusqueda = busqueda === '' || atleta.nombre.toLowerCase().includes(busqueda.toLowerCase()) || atleta.curp.toLowerCase().includes(busqueda.toLowerCase());
    let coincideFiltro = true;
    if (filtroActivo !== 'Todos') {
      const estatusNormalizado = atleta.estatus.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtroNormalizado = filtroActivo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      coincideFiltro = estatusNormalizado.includes(filtroNormalizado);
    }
    return coincideBusqueda && coincideFiltro;
  });

  const getIniciales = (nombre) => nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  const getColorEstatus = (estatus) => {
    const e = estatus.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (e.includes('validado')) return 'bg-green-50 text-green-700 border-green-200';
    if (e.includes('pendiente')) return 'bg-gray-50 text-gray-700 border-gray-200';
    if (e.includes('revision')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (e.includes('rechazado')) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in flex flex-col h-full">
      
      {/* Título unificado */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">
          PADRÓN DE DEPORTISTAS
        </h3>
        <button onClick={obtenerAtletas} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#7a2031] transition-all shadow-sm">
           <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl font-bold border border-red-200">{error}</div>}

      {/* Caja de filtros redondeada estilo [2rem] */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-6 mb-6 shrink-0 flex flex-col xl:flex-row gap-6 justify-between items-center">
        <div className="relative w-full xl:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Buscar por Nombre o CURP..." className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none text-sm focus:bg-white focus:border-[#7a2031] transition-all" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-center">
          {['Todos', 'Validado', 'En revisión', 'Pendiente', 'Rechazado'].map((filtro) => (
            <button key={filtro} onClick={() => setFiltroActivo(filtro)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filtroActivo === filtro ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
              {filtro === 'Todos' ? filtro : `${filtro}`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 w-full xl:w-auto justify-end">
          <div className="text-right border-l border-gray-100 pl-4 hidden sm:block">
            <p className="text-2xl font-black text-gray-900 leading-none">{atletasFiltrados.length}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atletas</p>
          </div>
        </div>
      </div>

      {/* Lista de Atletas */}
      <div className="flex-1 space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">Perfil atlético</div>
          <div className="col-span-3">Disciplina y entrenador</div>
          <div className="col-span-2 text-center">Estado oficial</div>
          <div className="col-span-3 text-center">Acciones y dictamen</div>
        </div>

        {cargando ? (
          <div className="text-center py-12 text-gray-400 font-medium flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a2031] mb-4"></div>
            Cargando padrón oficial...
          </div>
        ) : atletasFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-4xl shadow-sm text-gray-500 border border-gray-100">No hay registros que coincidan con la búsqueda.</div>
        ) : (
          atletasFiltrados.map((atleta) => {
            const eNormalizado = atleta.estatus.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let dotColor = 'bg-gray-400';
            if (eNormalizado.includes('validado')) dotColor = 'bg-green-500';
            else if (eNormalizado.includes('rechazado')) dotColor = 'bg-red-500';
            else if (eNormalizado.includes('revision')) dotColor = 'bg-amber-500';

            return (
              <div key={atleta.id_usuario} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:shadow-md transition-shadow group">
                <div className="col-span-4 flex items-center w-full">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-inner">{getIniciales(atleta.nombre)}</div>
                  <div className="ml-4 truncate">
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#7a2031] transition-colors truncate">{atleta.nombre}</h3>
                    <div className="flex items-center text-[10px] text-gray-400 font-mono mt-0.5 uppercase">{atleta.curp} <span className="mx-1.5">•</span> {atleta.municipio}</div>
                  </div>
                </div>

                <div className="col-span-3 w-full flex flex-col justify-center items-start md:items-start">
                  <span className="text-[10px] font-black text-[#7a2031] bg-[#7a2031]/10 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5">{atleta.disciplina}</span>
                  <span className="text-xs text-gray-500 font-medium truncate w-full flex items-center mb-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>{atleta.entrenador}
                  </span>
                </div>

                <div className="col-span-2 w-full flex justify-start md:justify-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border inline-flex items-center ${getColorEstatus(atleta.estatus)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}></span>{atleta.estatus}
                  </span>
                </div>

                <div className="col-span-3 w-full flex justify-end md:justify-center gap-1 items-center">
                  <button className="p-2 text-gray-400 hover:text-[#c2a649] hover:bg-[#c2a649]/10 rounded-lg transition-colors" title="Ver Expediente (Docs)"><FileText className="w-4 h-4" /></button>
                  <button onClick={() => abrirPerfil(atleta.id_usuario, 'atleta')} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver Ficha Completa">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#7a2031] hover:bg-red-50 rounded-lg transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}