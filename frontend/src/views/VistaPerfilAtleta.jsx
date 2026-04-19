import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Download, Edit, User, MapPin, Activity, GraduationCap, Phone, Mail,
  CreditCard, Droplets, Ruler, Weight, BadgeCheck, Clock, Camera, IdCard, 
  UserCog, Save, X, FileText, CheckCircle, AlertTriangle, Upload, Eye, Trash2, Calendar
} from 'lucide-react';

const SectionTitle = (props) => {
  const IconoComponente = props.icon;
  return (
    <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-3">
      <div className="p-2 bg-gray-50 rounded-lg text-[#7a2031]">
        <IconoComponente className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">{props.title}</h3>
    </div>
  );
};

const DataField = ({ label, name, value, isEditing, onChange, type = "text", options = null }) => (
  <div className="flex flex-col space-y-1 w-full">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    {isEditing ? (
      options ? (
        <select name={name} value={value || ''} onChange={onChange} className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#7a2031] outline-none transition-all w-full">
          <option value="">Seleccione...</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={value || ''} onChange={onChange} className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#7a2031] outline-none transition-all w-full" />
      )
    ) : (
      <span className="text-sm font-medium text-gray-700">{value || "No registrado"}</span>
    )}
  </div>
);

// [NUEVO] Recibimos tipoPerfil ('atleta' o 'entrenador') y perfilId
export default function VistaPerfilAtleta({ cambiarVistaPanel, perfilId, tipoPerfil }) {
  const [perfil, setPerfil] = useState({});
  const [datosEditados, setDatosEditados] = useState({});
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  
  const docsRef = useRef(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      setCargando(true);
      setErrorApi(null);
      try {
        const token = localStorage.getItem('token_remude');
        if (!perfilId) throw new Error("ID de perfil no proporcionado");

        // [DINÁMICO] Cambiamos la URL dependiendo de si es Atleta o Entrenador
        const urlFetch = tipoPerfil === 'entrenador' 
          ? `http://localhost:3000/api/entrenadores/${perfilId}` 
          : `http://localhost:3000/api/atletas/${perfilId}`;

        const response = await fetch(urlFetch, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setPerfil(data);
          setDatosEditados(data);
        } else {
          throw new Error("No se encontró el perfil en la base de datos.");
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setErrorApi(error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [perfilId, tipoPerfil]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setDatosEditados(prev => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    alert("Función de guardar desactivada en modo demostración universal.");
    setModoEdicion(false);
  };

  if (cargando) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a2031]"></div>
      </div>
    );
  }

  if (errorApi) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-100 animate-fade-in">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Error de conexión</h3>
        <p className="text-gray-500 mb-6 text-center max-w-md">{errorApi}</p>
        <button onClick={() => cambiarVistaPanel(tipoPerfil === 'entrenador' ? 'entrenadores' : 'atletas')} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
          Volver al padrón
        </button>
      </div>
    );
  }

  // Determinar estatus general para la UI
  const estatusTexto = tipoPerfil === 'entrenador' 
    ? (perfil.estado_cuenta ? 'ACTIVO' : 'INACTIVO') 
    : (perfil.nombre_estatus || 'PENDIENTE');

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in pb-10 flex flex-col relative">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-4">
        
        {/* COLUMNA LATERAL (Fija) */}
        <div className="lg:col-span-1 flex flex-col gap-4 sticky top-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative mt-1">
            <button
              onClick={() => cambiarVistaPanel(tipoPerfil === 'entrenador' ? 'entrenadores' : 'atletas')}
              className="absolute top-4 left-4 p-2.5 bg-gray-50 rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-gray-900 border border-gray-100"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="relative mb-4 mt-4">
              <div className="w-28 h-28 rounded-3xl bg-gray-900 text-white flex items-center justify-center text-4xl font-black shadow-inner overflow-hidden">
                {datosEditados.nombre?.charAt(0) || 'A'}
              </div>
            </div>
            
            <h3 className="text-xl font-black text-gray-900 leading-tight">
              {datosEditados.nombre} <br /> 
              <span className="text-gray-400 font-medium">{datosEditados.primer_apellido}</span>
            </h3>
            
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 mb-1">
              <span className="px-2.5 py-1 bg-[#7a2031] text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                {tipoPerfil === 'entrenador' ? 'ENTRENADOR' : 'DEPORTISTA'}
              </span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-lg">
                {datosEditados.disciplina || datosEditados.especialidad || 'General'}
              </span>
            </div>

            <div className="mt-4 flex justify-center w-full border-t border-gray-100 pt-4">
              <div className={`flex items-center px-3 py-1.5 justify-center rounded-lg border shadow-sm ${
                estatusTexto === 'ACTIVO' || estatusTexto === 'Validado' ? 'bg-[#e5f5e8] text-[#2e7d32] border-[#c8e6c9]' : 'bg-[#fff4e5] text-[#b26a00] border-[#ffe0b2]'
              }`}>
                <BadgeCheck className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">{estatusTexto}</span>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-3">
             <button onClick={() => setModoEdicion(!modoEdicion)} className="w-full bg-white text-[#7a2031] border border-[#7a2031]/20 rounded-2xl py-3.5 flex justify-center items-center font-bold shadow-sm hover:bg-red-50 transition-all">
                {modoEdicion ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />} 
                {modoEdicion ? 'Cancelar Edición' : 'Editar Información'}
             </button>
             {modoEdicion && (
               <button onClick={guardarCambios} className="w-full bg-green-600 text-white rounded-2xl py-3.5 flex justify-center items-center font-bold shadow-md hover:bg-green-700 transition-all">
                  <Save className="w-4 h-4 mr-2" /> Guardar Cambios
               </button>
             )}
          </div>
        </div>

        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Módulo 1: Datos personales (Compartido) */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={User} title="Información personal" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
              <DataField label="Nombre(s)" name="nombre" value={datosEditados.nombre} isEditing={modoEdicion} onChange={handleEditChange} />
              <DataField label="Primer apellido" name="primer_apellido" value={datosEditados.primer_apellido} isEditing={modoEdicion} onChange={handleEditChange} />
              <DataField label="Segundo apellido" name="segundo_apellido" value={datosEditados.segundo_apellido} isEditing={modoEdicion} onChange={handleEditChange} />
              <DataField label="CURP" name="curp" value={datosEditados.curp} isEditing={modoEdicion} onChange={handleEditChange} />
              <DataField label="Correo Electrónico" name="correo" value={datosEditados.correo} isEditing={modoEdicion} onChange={handleEditChange} />
            </div>
          </div>

          {/* Módulo 2: Ocultar o Mostrar dependiento del Perfil */}
          
          {/* --- EXCLUSIVO ATLETAS --- */}
          {tipoPerfil === 'atleta' && (
            <>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <SectionTitle icon={Activity} title="Perfil Médico y Tallas" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <DataField label="Tipo de sangre" name="tipo_sangre" value={datosEditados.grupo_sanguineo} isEditing={false} />
                  <DataField label="Peso (kg)" name="peso_kg" value={datosEditados.peso_kg} isEditing={false} />
                  <DataField label="Estatura (mts)" name="estatura_mts" value={datosEditados.estatura_mts} isEditing={false} />
                  <DataField label="Talla de Uniforme" name="talla" value={datosEditados.talla_camisa} isEditing={false} />
                </div>
              </div>
            </>
          )}

          {/* --- EXCLUSIVO ENTRENADORES --- */}
          {tipoPerfil === 'entrenador' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={GraduationCap} title="Perfil Técnico y Logros" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DataField label="Especialidad / Disciplina" name="especialidad" value={datosEditados.especialidad} isEditing={modoEdicion} onChange={handleEditChange} />
                <DataField label="Título o Logro Destacado" name="titulo_logro" value={datosEditados.titulo_logro} isEditing={modoEdicion} onChange={handleEditChange} />
                <div className="md:col-span-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Descripción / Experiencia</span>
                  {modoEdicion ? (
                    <textarea 
                      name="descripcion" 
                      value={datosEditados.descripcion || ''} 
                      onChange={handleEditChange}
                      className="w-full bg-white border border-gray-300 rounded-md p-3 text-sm focus:ring-[#7a2031] outline-none h-24"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">{datosEditados.descripcion || 'Sin descripción agregada.'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}