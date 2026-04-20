// src/views/admin/VistaPadronAtletas.jsx
import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, CheckCircle, XCircle, RefreshCw, FileText, Plus, X, Save, User } from 'lucide-react';

export default function VistaPadronAtletas({ abrirPerfil }) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [atletas, setAtletas] = useState([]);

  // Estados para el Modal de Simulación
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    curp: '',
    disciplina: '',
    entrenador: ''
  });

  useEffect(() => {
    cargarDatosSimulados();
  }, []);

  const cargarDatosSimulados = () => {
    setCargando(true);
    
    // Simulamos retraso de red
    setTimeout(() => {
      setAtletas([
        {
          id_usuario: 1001,
          nombre: 'Juan Pérez',
          curp: 'PELJ900101HQRRXX09',
          municipio: 'Bacalar',
          disciplina: 'Atletismo',
          entrenador: 'Gerardo Amaro',
          estatus: 'Validado',
          progreso: 100
        },
        {
          id_usuario: 1002,
          nombre: 'María Lucero Lucero',
          curp: 'PVCSFW1NYV5PLGRQQ',
          municipio: 'Bacalar',
          disciplina: 'Voleibol',
          entrenador: 'Victoria Piña',
          estatus: 'Validado',
          progreso: 100
        },
        {
          id_usuario: 1003,
          nombre: 'Ángela Lozada Toledo',
          curp: 'WPCSD1434ZTBZIXNUM',
          municipio: 'Bacalar',
          disciplina: 'Básquetbol',
          entrenador: 'Sin entrenador',
          estatus: 'En revisión',
          progreso: 75
        },
        {
          id_usuario: 1004,
          nombre: 'Juana Delarosa Galván',
          curp: 'VFNYEYDY1AKUTAAW6M',
          municipio: 'Bacalar',
          disciplina: 'Fútbol',
          entrenador: 'Carlos Mendoza',
          estatus: 'Pendiente',
          progreso: 25
        },
        {
          id_usuario: 1005,
          nombre: 'José Eduardo Zamora de Gallardo',
          curp: 'LL8KNY4ZHZ00NTV6W9',
          municipio: 'Bacalar',
          disciplina: 'Natación',
          entrenador: 'Gerardo Amaro',
          estatus: 'Rechazado',
          progreso: 50
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
      const nuevoAtleta = {
        id_usuario: Date.now(),
        nombre: `${formData.nombre} ${formData.apellidos}`.trim(),
        curp: formData.curp.toUpperCase(),
        municipio: 'Bacalar',
        disciplina: formData.disciplina || 'General',
        entrenador: formData.entrenador || 'Sin entrenador',
        estatus: 'Pendiente',
        progreso: 0
      };

      setAtletas([nuevoAtleta, ...atletas]); // Añadimos al inicio
      setMostrarModal(false);
      setFormData({ nombre: '', apellidos: '', curp: '', disciplina: '', entrenador: '' });
      setGuardando(false);
    }, 500);
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
    <div className="w-full max-w-7xl mx-auto animate-fade-in flex flex-col h-[calc(100vh-140px)] relative">
      
      {/* Título unificado */}
      <div className="flex justify-between items-center mb-6 mt-2 shrink-0">
        <div>
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">
            PADRÓN DE DEPORTISTAS
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Gestión simulada de atletas del municipio.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={cargarDatosSimulados} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#7a2031] transition-all shadow-sm" title="Recargar simulador">
             <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setMostrarModal(true)}
            className="bg-[#7a2031] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#5a1523] transition-all flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Nuevo deportista
          </button>
        </div>
      </div>

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
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-12">
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>
        
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">Perfil atlético</div>
          <div className="col-span-3">Disciplina y entrenador</div>
          <div className="col-span-2 text-center">Estado oficial</div>
          <div className="col-span-3 text-center">Acciones y dictamen</div>
        </div>

        {cargando ? (
          <div className="text-center py-12 text-gray-400 font-medium flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a2031] mb-4"></div>
            Cargando padrón simulado...
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

      {/* =========================================================
          MODAL DE REGISTRO DE ATLETA (FRONTEND ONLY)
          ========================================================= */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-black text-gray-800 text-lg flex items-center uppercase tracking-widest">
                <User className="w-5 h-5 mr-2 text-[#7a2031]" />
                Registrar nuevo deportista
              </h3>
              <button onClick={() => setMostrarModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="formAtleta" onSubmit={manejarRegistro} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre(s)*</label>
                    <input 
                      type="text" name="nombre" required 
                      value={formData.nombre} onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                      placeholder="Ej. Juan Carlos"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Apellidos*</label>
                    <input 
                      type="text" name="apellidos" required 
                      value={formData.apellidos} onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                      placeholder="Ej. Pérez Gómez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">CURP*</label>
                  <input 
                    type="text" name="curp" required maxLength="18"
                    value={formData.curp} onChange={manejarCambioForm}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all uppercase"
                    placeholder="18 caracteres"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Disciplina</label>
                    <select 
                      name="disciplina" value={formData.disciplina} onChange={manejarCambioForm}
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
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Entrenador Asignado</label>
                    <input 
                      type="text" name="entrenador" 
                      value={formData.entrenador} onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                      placeholder="Nombre del entrenador"
                    />
                  </div>
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
                type="submit" form="formAtleta" disabled={guardando}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#7a2031] rounded-xl hover:bg-[#5a1523] transition-colors shadow-md flex items-center uppercase tracking-widest"
              >
                {guardando ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Guardando...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Guardar Atleta</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}