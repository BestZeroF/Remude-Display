import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, FileText, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function VistaPadronAtletas() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [atletas, setAtletas] = useState([]);

  // Conexión real al backend
  useEffect(() => {
    obtenerAtletas();
  }, []);

  const obtenerAtletas = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token_remude');
      
      const respuesta = await fetch('http://localhost:3000/api/admin/usuarios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!respuesta.ok) {
        throw new Error('Error al obtener el padrón de usuarios');
      }

      const data = await respuesta.json();
      
      // Filtramos solo los que son Atletas y mapeamos los datos al formato de la tabla
      const atletasMapeados = data.usuarios
        .filter(u => u.nombre_rol && u.nombre_rol.toLowerCase() === 'atleta')
        .map(u => ({
          id_usuario: u.id_usuario, // PIVOTE UNIVERSAL V8
          nombre: `${u.nombre} ${u.primer_apellido} ${u.segundo_apellido || ''}`.trim(),
          curp: u.curp || 'Sin CURP',
          municipio: "Bacalar", 
          disciplina: u.disciplina_atleta || 'Sin Asignar', // Dato real del backend
          entrenador: u.nombre_entrenador ? `${u.nombre_entrenador} ${u.apellido_entrenador}` : "Sin Entrenador",
          estatus: u.estatus_atleta || 'Pendiente',
          progreso: parseInt(u.progreso_ficha) || 0
        }));

      setAtletas(atletasMapeados);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el padrón de deportistas.');
    } finally {
      setCargando(false);
    }
  };

  // [CORRECCIÓN V8.4]: Lógica de filtrado inteligente (ignora mayúsculas, acentos y textos extra)
  const atletasFiltrados = atletas.filter(atleta => {
    const coincideBusqueda = busqueda === '' || 
      atleta.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      atleta.curp.toLowerCase().includes(busqueda.toLowerCase());
    
    let coincideFiltro = true;
    if (filtroActivo !== 'Todos') {
      // Normalizamos ambos textos (quita acentos y los hace minúsculas)
      const estatusNormalizado = atleta.estatus.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtroNormalizado = filtroActivo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      coincideFiltro = estatusNormalizado.includes(filtroNormalizado);
    }

    return coincideBusqueda && coincideFiltro;
  });

  const getIniciales = (nombre) => {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // [CORRECCIÓN V8.4]: Ajuste de colores con coincidencia parcial
  const getColorEstatus = (estatus) => {
    const e = estatus.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (e.includes('validado')) return 'bg-green-50 text-green-700 border-green-200';
    if (e.includes('pendiente')) return 'bg-gray-50 text-gray-700 border-gray-200';
    if (e.includes('revision')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (e.includes('rechazado')) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Función base para dictaminar
  const manejarDictamen = async (id_usuario, nuevo_estatus_id) => {
    if(!window.confirm('¿Estás seguro de cambiar el estatus de este atleta?')) return;
    
    try {
      const token = localStorage.getItem('token_remude');
      const respuesta = await fetch(`http://localhost:3000/api/admin/dictamen/${id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_estatus: nuevo_estatus_id })
      });

      if (respuesta.ok) {
        alert('Estatus actualizado correctamente');
        obtenerAtletas(); // Recargar la tabla
      } else {
        const errorData = await respuesta.json();
        alert(errorData.message || 'Error al actualizar el estatus');
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      
      {/* HEADER TÍTULO */}
      <div className="mb-6 mt-2 shrink-0">
        <h2 className="text-3xl font-black text-[#7a2031] tracking-tight">Padrón de Deportistas</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Registro oficial de atletas, disciplinas y delegaciones deportivas.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl font-bold border border-red-200">
          {error}
        </div>
      )}

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

        {/* Filtros */}
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

      {/* LISTA DE ATLETAS */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-12">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        `}</style>

        {/* Encabezados */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">Perfil Atlético</div>
          <div className="col-span-3">Disciplina & Entrenador</div>
          <div className="col-span-2 text-center">Estado Oficial</div>
          <div className="col-span-3 text-center">Acciones y Dictamen</div>
        </div>

        {cargando ? (
          <div className="text-center py-12 text-gray-400 font-medium flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a2031] mb-4"></div>
            Cargando padrón oficial desde la base de datos...
          </div>
        ) : atletasFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm text-gray-500 border border-gray-100">No hay registros que coincidan con los filtros.</div>
        ) : (
          atletasFiltrados.map((atleta) => {
            // Evaluamos color del puntito dinámicamente
            const eNormalizado = atleta.estatus.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let dotColor = 'bg-gray-400';
            if (eNormalizado.includes('validado')) dotColor = 'bg-green-500';
            else if (eNormalizado.includes('rechazado')) dotColor = 'bg-red-500';
            else if (eNormalizado.includes('revision')) dotColor = 'bg-amber-500';

            return (
              <div key={atleta.id_usuario} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:shadow-md transition-shadow group">
                
                {/* Info Personal */}
                <div className="col-span-4 flex items-center w-full">
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

                {/* Disciplina y Entrenador */}
                <div className="col-span-3 w-full flex flex-col justify-center items-start md:items-start">
                  <span className="text-[10px] font-black text-[#7a2031] bg-[#7a2031]/10 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                    {atleta.disciplina}
                  </span>
                  <span className="text-xs text-gray-500 font-medium truncate w-full flex items-center mb-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                    {atleta.entrenador}
                  </span>
                  {/* Barra de Progreso Mapeada a BD */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                     <div className={`h-1.5 transition-all duration-500 ${atleta.progreso === 100 ? 'bg-green-500' : 'bg-[#c2a649]'}`} style={{ width: `${atleta.progreso}%` }}></div>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">{atleta.progreso}% Ficha Completa</span>
                </div>

                {/* Estatus */}
                <div className="col-span-2 w-full flex justify-start md:justify-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border inline-flex items-center ${getColorEstatus(atleta.estatus)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}></span>
                    {atleta.estatus}
                  </span>
                </div>

                {/* Acciones & Dictamen (Administrador) */}
                <div className="col-span-3 w-full flex justify-end md:justify-center gap-1 items-center">
                  
                  {/* Botones de Dictamen Rápido (Solo visibles si está 'En revisión' o 'Pendiente') */}
                  {(eNormalizado.includes('revision') || eNormalizado.includes('pendiente')) && (
                    <div className="flex bg-gray-50 rounded-lg p-0.5 mr-2 border border-gray-100">
                      <button onClick={() => manejarDictamen(atleta.id_usuario, 3)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-white rounded-md transition-all shadow-sm" title="Aprobar / Validar">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => manejarDictamen(atleta.id_usuario, 4)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md transition-all shadow-sm" title="Rechazar">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Acciones estándar */}
                  <button className="p-2 text-gray-400 hover:text-[#c2a649] hover:bg-[#c2a649]/10 rounded-lg transition-colors" title="Ver Expediente (Docs)">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver Ficha Completa">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#7a2031] hover:bg-red-50 rounded-lg transition-colors" title="Editar / Reasignar">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}