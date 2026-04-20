// src/views/admin/VistaClubesEquipos.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, ClipboardList, Plus, Users, Phone, Mail, 
  Calendar, Trophy, Edit, Trash2, RefreshCw, AlertCircle, X, Save, UserCog
} from 'lucide-react';

export default function VistaClubesEquipos() {
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [clubes, setClubes] = useState([]);
  
  // Listas simuladas para los selectores
  const [entrenadoresDisponibles, setEntrenadoresDisponibles] = useState([]);
  const [disciplinasDisponibles] = useState([
    { id: 1, nombre: 'Fútbol' },
    { id: 2, nombre: 'Básquetbol' },
    { id: 3, nombre: 'Voleibol' },
    { id: 4, nombre: 'Atletismo' },
    { id: 5, nombre: 'Béisbol' },
    { id: 6, nombre: 'Natación' },
    { id: 7, nombre: 'Canotaje' }
  ]); 

  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    nombre_club: '',
    id_disciplina: '',
    id_entrenador_lider: '',
    telefono_contacto: '',
    correo_contacto: '',
    fecha_fundacion: ''
  });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = () => {
    setCargando(true);
    
    // Simulamos un tiempo de carga de red (800ms)
    setTimeout(() => {
      // 1. Cargamos entrenadores falsos para el formulario
      setEntrenadoresDisponibles([
        { id_entrenador: 101, nombre: 'Gerardo', primer_apellido: 'Amaro', especialidad: 'Natación' },
        { id_entrenador: 102, nombre: 'Victoria', primer_apellido: 'Piña', especialidad: 'Atletismo' },
        { id_entrenador: 103, nombre: 'Carlos', primer_apellido: 'Mendoza', especialidad: 'Fútbol' },
        { id_entrenador: 104, nombre: 'Ana', primer_apellido: 'López', especialidad: 'Voleibol' }
      ]);

      // 2. Cargamos clubes falsos pero realistas
      setClubes([
        {
          id_club: 1,
          nombre_club: 'Delfines de Bacalar',
          nombre_disciplina: 'Natación',
          nombre_representante_real: 'Gerardo Amaro',
          telefono_contacto: '9831234567',
          correo_contacto: 'delfines@bacalar.com',
          fecha_fundacion: '2018-05-15',
          id_estatus: 3,
          estatus_texto: 'Activo'
        },
        {
          id_club: 2,
          nombre_club: 'Tiburones Rojos',
          nombre_disciplina: 'Fútbol',
          nombre_representante_real: 'Carlos Mendoza',
          telefono_contacto: '9837654321',
          correo_contacto: 'tiburones.fc@gmail.com',
          fecha_fundacion: '2020-01-10',
          id_estatus: 3,
          estatus_texto: 'Activo'
        },
        {
          id_club: 3,
          nombre_club: 'Gacelas Track Club',
          nombre_disciplina: 'Atletismo',
          nombre_representante_real: 'Victoria Piña',
          telefono_contacto: '9831112233',
          correo_contacto: 'gacelas.track@outlook.com',
          fecha_fundacion: '2019-11-20',
          id_estatus: 3,
          estatus_texto: 'Activo'
        },
        {
          id_club: 4,
          nombre_club: 'Pioneros Hoops',
          nombre_disciplina: 'Básquetbol',
          nombre_representante_real: 'Sin Asignar',
          telefono_contacto: '9839998877',
          correo_contacto: 'pioneros.bacalar@gmail.com',
          fecha_fundacion: '2021-08-05',
          id_estatus: 2,
          estatus_texto: 'En Revisión'
        },
        {
          id_club: 5,
          nombre_club: 'Club Laguna Mágica',
          nombre_disciplina: 'Canotaje',
          nombre_representante_real: 'Ana López',
          telefono_contacto: '9834445566',
          correo_contacto: 'laguna.magica@bacalar.gob.mx',
          fecha_fundacion: '2015-03-22',
          id_estatus: 3,
          estatus_texto: 'Activo'
        }
      ]);
      
      setCargando(false);
    }, 800);
  };

  const manejarCambioForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const manejarRegistro = (e) => {
    e.preventDefault();
    setGuardando(true);
    
    // Simulamos el retraso de guardar en la DB
    setTimeout(() => {
      // Buscamos los nombres reales basados en los IDs seleccionados para mostrarlos en la UI
      const disciplinaSel = disciplinasDisponibles.find(d => d.id === parseInt(formData.id_disciplina));
      const entrenadorSel = entrenadoresDisponibles.find(ent => ent.id_entrenador === parseInt(formData.id_entrenador_lider));

      // Construimos el nuevo objeto del club
      const nuevoClub = {
        id_club: Date.now(), // Generamos un ID falso único
        nombre_club: formData.nombre_club,
        nombre_disciplina: disciplinaSel ? disciplinaSel.nombre : 'Multidisciplinario',
        nombre_representante_real: entrenadorSel ? `${entrenadorSel.nombre} ${entrenadorSel.primer_apellido}` : 'Sin Asignar',
        telefono_contacto: formData.telefono_contacto || 'Sin teléfono',
        correo_contacto: formData.correo_contacto || 'Sin correo',
        fecha_fundacion: formData.fecha_fundacion || null,
        id_estatus: 3,
        estatus_texto: 'Activo'
      };

      // Lo inyectamos al principio de la lista actual de clubes
      setClubes([nuevoClub, ...clubes]);
      
      // Limpiamos y cerramos
      setMostrarModal(false);
      setFormData({
        nombre_club: '', id_disciplina: '', id_entrenador_lider: '',
        telefono_contacto: '', correo_contacto: '', fecha_fundacion: ''
      });
      setGuardando(false);
      
    }, 600); // 600ms de simulación de guardado
  };

  const clubesFiltrados = clubes.filter(club => 
    club.nombre_club.toLowerCase().includes(busqueda.toLowerCase()) ||
    (club.nombre_representante_real && club.nombre_representante_real.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const formatearFecha = (fecha) => {
    if(!fecha) return 'Sin fecha';
    const d = new Date(fecha);
    const fechaAjustada = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    return fechaAjustada.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 animate-fade-in flex flex-col h-[calc(100vh-140px)] relative">
      
      {/* HEADER SECCIÓN */}
      <div className="mb-6 mt-2 shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-[#7a2031] tracking-tight flex items-center">
            <ClipboardList className="w-8 h-8 mr-3" />
            Clubes y equipos
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Registro y control de organizaciones deportivas del municipio.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={cargarDatosIniciales}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#7a2031] transition-all shadow-sm"
            title="Recargar datos simulados"
          >
            <RefreshCw className={`w-5 h-5 ${cargando ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setMostrarModal(true)}
            className="bg-[#7a2031] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#5a1523] transition-all flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Nuevo registro
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 mb-6 shrink-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text" 
            placeholder="Buscar club o representante..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none text-sm focus:bg-white focus:border-[#7a2031] transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL (LISTA DE CLUBES) */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-12">
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>

        {cargando ? (
          <div className="text-center py-20 text-gray-400 font-bold flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a2031] mb-4"></div>
            Generando datos de prueba...
          </div>
        ) : clubesFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-lg">No se encontraron clubes registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubesFiltrados.map((club) => (
              <div key={club.id_club} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c2a649]"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg group-hover:text-[#7a2031] transition-colors">
                      {club.nombre_club}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#7a2031]/10 text-[#7a2031] uppercase tracking-wider mt-1">
                      <Trophy className="w-3 h-3 mr-1" /> {club.nombre_disciplina || 'Multidisciplinario'}
                    </span>
                  </div>
                  
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg transition-colors" onClick={() => setClubes(clubes.filter(c => c.id_club !== club.id_club))}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center text-xs text-gray-600 font-bold uppercase tracking-tight">
                    <UserCog className="w-4 h-4 mr-3 text-[#c2a649]" />
                    <span className="text-gray-400 mr-2 font-medium capitalize">Representante:</span> 
                    {club.nombre_representante_real || 'No asignado'}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 font-medium">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    {club.telefono_contacto || 'Sin teléfono'}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 font-medium">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    {club.correo_contacto || 'Sin correo'}
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase">
                      <Calendar className="w-3.5 h-3.5 mr-2" />
                      Fundado: {formatearFecha(club.fecha_fundacion)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      club.id_estatus === 3 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {club.estatus_texto || 'Activo'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL DE REGISTRO DE CLUB (FRONTEND ONLY)
          ========================================================= */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-black text-gray-800 text-lg flex items-center uppercase tracking-widest">
                <Trophy className="w-5 h-5 mr-2 text-[#7a2031]" />
                Registrar club 
              </h3>
              <button onClick={() => setMostrarModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="formClub" onSubmit={manejarRegistro} className="space-y-5">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre del club*</label>
                  <input 
                    type="text" 
                    name="nombre_club" 
                    required 
                    value={formData.nombre_club} 
                    onChange={manejarCambioForm}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                    placeholder="Ej. Delfines Azules"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Disciplina base</label>
                    <select 
                      name="id_disciplina" 
                      value={formData.id_disciplina} 
                      onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                    >
                      <option value="">Multidisciplinario</option>
                      {disciplinasDisponibles.map(disc => (
                        <option key={disc.id} value={disc.id}>{disc.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Fecha de fundación</label>
                    <input 
                      type="date" 
                      name="fecha_fundacion" 
                      value={formData.fecha_fundacion} 
                      onChange={manejarCambioForm}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5 mt-2">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Datos del representante</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                         <UserCog className="w-4 h-4 mr-1 text-[#c2a649]"/> Seleccionar entrenador
                      </label>
                      <select 
                        name="id_entrenador_lider" 
                        required
                        value={formData.id_entrenador_lider} 
                        onChange={manejarCambioForm}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                      >
                        <option value="">-- Seleccione de la base simulada --</option>
                        {entrenadoresDisponibles.map(ent => (
                          <option key={ent.id_entrenador} value={ent.id_entrenador}>
                            {ent.nombre} {ent.primer_apellido} ({ent.especialidad})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Teléfono del club</label>
                        <input 
                          type="tel" 
                          name="telefono_contacto" 
                          value={formData.telefono_contacto} 
                          onChange={manejarCambioForm}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                          placeholder="10 dígitos"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Correo del club</label>
                        <input 
                          type="email" 
                          name="correo_contacto" 
                          value={formData.correo_contacto} 
                          onChange={manejarCambioForm}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7a2031] focus:bg-white transition-all"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 shrink-0">
              <button 
                type="button" 
                onClick={() => setMostrarModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="formClub"
                disabled={guardando}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#7a2031] rounded-xl hover:bg-[#5a1523] transition-colors shadow-md flex items-center uppercase tracking-widest"
              >
                {guardando ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Guardando...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Registrar club</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}