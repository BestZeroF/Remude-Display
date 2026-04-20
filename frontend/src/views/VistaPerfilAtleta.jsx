import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Download, Edit, User, MapPin,
  Activity, GraduationCap, Phone, Mail,
  CreditCard, Droplets, Ruler, Weight,
  BadgeCheck, Clock, Camera,
  IdCard, UserCog, Save, X, FileText, CheckCircle, 
  AlertTriangle, Upload, Eye, Trash2, Calendar
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

const DataField = ({ label, name, value, isEditing, onChange, type = "text", options = null, listId = null, listOptions = [] }) => (
  <div className="flex flex-col space-y-1 w-full">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    {isEditing ? (
      options ? (
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#7a2031] outline-none transition-all w-full"
        >
          <option value="">Seleccione...</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : listId ? (
        <>
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            list={listId}
            className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#7a2031] outline-none transition-all w-full"
            placeholder="Escriba para buscar..."
          />
          <datalist id={listId}>
            {listOptions.map(opt => <option key={opt} value={opt} />)}
          </datalist>
        </>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#7a2031] outline-none transition-all w-full"
        />
      )
    ) : (
      <span className="text-sm font-medium text-gray-700">{value || "No registrado"}</span>
    )}
  </div>
);

// Agregamos el prop "tipoPerfil" para alternar entre entrenador y atleta
export default function VistaPerfilAtleta({ cambiarVistaPanel, atletaId, perfilId, accionInicial, tipoPerfil = 'atleta' }) {
  const [atleta, setAtleta] = useState(null);
  const [datosEditados, setDatosEditados] = useState({});
  const [cargando, setCargando] = useState(true);
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  
  const docsRef = useRef(null);

  const catalogoDisciplinas = ["Ciclismo", "Atletismo", "Natación", "Boxeo", "Taekwondo", "Fútbol"];
  const catalogoDivisiones = ["Infantil", "Juvenil Superior", "Juvenil Menor", "Libre", "Elite", "Pluma", "Ligero"];
  const catalogoClubes = ["Pedales de Fuego", "Fighter Gym", "Club Acuático", "Club Titanes", "Dojo Central", "Ruedas Rápidas"];
  
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    if (accionInicial === 'editar') {
      setModoEdicion(true);
    } else if (accionInicial === 'docs') {
      setTimeout(() => {
        docsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [accionInicial]);

  useEffect(() => {
    const obtenerDatosAtleta = async () => {
      setCargando(true);
      
      setTimeout(() => {
        let atletaActual;

        if (tipoPerfil === 'entrenador') {
          // Datos del Entrenador
          atletaActual = { 
            id: 1, nombre: "Victoria", primer_apellido: "Piña", segundo_apellido: "Poot", 
            curp: "PIPV851010MDFRXX00", correo: "victoria@email.com", celular: "9831234567", 
            direccion: "Av. Principal 123", codigo_postal: "77930", fecha_nacimiento: "1985-10-10", 
            sexo: "Mujer", genero: "Femenino", estado_civil: "Soltero(a)", 
            disciplina: "Atletismo", estatus: "Activo", especialidad: "Entrenadora de Alto Rendimiento", 
            titulo_logro: "Campeona Estatal 2010", descripcion: "Entrenadora con más de 10 años de experiencia formando atletas. Egresada en Ciencias del Deporte." 
          };
          setDocumentos([]); // El entrenador en este diseño no tiene módulo de documentos
        } else {
          // Datos del Atleta
          const currentId = atletaId || perfilId || 201; 
          const mockData = {
            201: { id: 201, nombre: "Luis Fernando", primer_apellido: "Salazar", segundo_apellido: "Ruiz", curp: "SARL990101HDFRXX01", correo: "luis.salazar@email.com", celular: "9831112222", direccion: "Calle 10, Centro", codigo_postal: "77930", fecha_nacimiento: "1999-01-01", sexo: "Hombre", genero: "Masculino", estado_civil: "Soltero(a)", disciplina: "Atletismo", division: "Libre", club: "Club Titanes", estatus: "Pendiente", tipo_sangre: "O+", peso_kg: 70, estatura_mts: 1.75, talla_camisa: "M", nivel_estudios: "Preparatoria", institucion_educativa: "CBTIS 214" },
            202: { id: 202, nombre: "Carmen Elena", primer_apellido: "Rojas", segundo_apellido: "Pérez", curp: "ROPC010202MDFRXX02", correo: "carmen.rojas@email.com", celular: "9832223333", direccion: "Av. Universidad", codigo_postal: "77935", fecha_nacimiento: "2002-05-15", sexo: "Mujer", genero: "Femenino", estado_civil: "Soltero(a)", disciplina: "Natación", division: "Juvenil", club: "Club Acuático", estatus: "En revisión", tipo_sangre: "A+", peso_kg: 62, estatura_mts: 1.68, talla_camisa: "S", nivel_estudios: "Licenciatura", institucion_educativa: "UQROO" },
            203: { id: 203, nombre: "Roberto Carlos", primer_apellido: "Méndez", segundo_apellido: "López", curp: "MELR020303HDFRXX03", correo: "roberto.mendez@email.com", celular: "9833334444", direccion: "Colonia Magisterio", codigo_postal: "77940", fecha_nacimiento: "2000-08-20", sexo: "Hombre", genero: "Masculino", estado_civil: "Soltero(a)", disciplina: "Boxeo", division: "Pluma", club: "Fighter Gym", estatus: "Validado", tipo_sangre: "B+", peso_kg: 65, estatura_mts: 1.70, talla_camisa: "M", nivel_estudios: "Secundaria", institucion_educativa: "Técnica 12" },
            204: { id: 204, nombre: "Sofía Margarita", primer_apellido: "Gómez", segundo_apellido: "Díaz", curp: "GODS030404MDFRXX04", correo: "sofia.gomez@email.com", celular: "9834445555", direccion: "Fracc. Caribe", codigo_postal: "77930", fecha_nacimiento: "2001-11-10", sexo: "Mujer", genero: "Femenino", estado_civil: "Soltero(a)", disciplina: "Taekwondo", division: "Ligero", club: "Dojo Central", estatus: "Validado", tipo_sangre: "O-", peso_kg: 55, estatura_mts: 1.60, talla_camisa: "S", nivel_estudios: "Preparatoria", institucion_educativa: "Bachilleres" },
            205: { id: 205, nombre: "Andrés Felipe", primer_apellido: "Vargas", segundo_apellido: "Soto", curp: "VASA040505HDFRXX05", correo: "andres.vargas@email.com", celular: "9835556666", direccion: "Callejón del Sol", codigo_postal: "77930", fecha_nacimiento: "1998-12-05", sexo: "Hombre", genero: "Masculino", estado_civil: "Casado(a)", disciplina: "Ciclismo", division: "Elite", club: "Ruedas Rápidas", estatus: "Rechazado", tipo_sangre: "AB+", peso_kg: 68, estatura_mts: 1.80, talla_camisa: "L", nivel_estudios: "Licenciatura", institucion_educativa: "ITCB" }
          };
          atletaActual = mockData[currentId] || mockData[201];

          // Configuramos los documentos dependiendo del estatus del atleta
          if (atletaActual.estatus.toLowerCase() === 'validado') {
            setDocumentos([
              { id: 'acta', nombre: 'Acta de nacimiento', subido: true, obligatorio: true, estado: 'validado', motivoRechazo: '' },
              { id: 'curp', nombre: 'CURP', subido: true, obligatorio: true, estado: 'validado', motivoRechazo: '' },
              { id: 'responsiva', nombre: 'Responsiva + INE', subido: true, obligatorio: true, estado: 'validado', motivoRechazo: '' },
              { id: 'medico', nombre: 'Constancia médica', subido: true, obligatorio: true, estado: 'validado', motivoRechazo: '', vigencia: '2027-01-01' }
            ]);
          } else if (atletaActual.estatus.toLowerCase() === 'en revisión') {
            setDocumentos([
              { id: 'acta', nombre: 'Acta de nacimiento', subido: true, obligatorio: true, estado: 'pendiente', motivoRechazo: '' },
              { id: 'curp', nombre: 'CURP', subido: true, obligatorio: true, estado: 'validado', motivoRechazo: '' },
              { id: 'responsiva', nombre: 'Responsiva + INE', subido: true, obligatorio: true, estado: 'pendiente', motivoRechazo: '' },
              { id: 'medico', nombre: 'Constancia médica', subido: true, obligatorio: true, estado: 'pendiente', motivoRechazo: '', vigencia: '' }
            ]);
          } else if (atletaActual.estatus.toLowerCase() === 'rechazado') {
            setDocumentos([
              { id: 'acta', nombre: 'Acta de nacimiento', subido: true, obligatorio: true, estado: 'validado', motivoRechazo: '' },
              { id: 'curp', nombre: 'CURP', subido: true, obligatorio: true, estado: 'rechazado', motivoRechazo: 'El documento escaneado está borroso y no se alcanza a leer la fecha de nacimiento. Favor de subir un escaneo a color y completamente legible.' },
              { id: 'responsiva', nombre: 'Responsiva + INE', subido: false, obligatorio: true, estado: 'pendiente', motivoRechazo: '' },
              { id: 'medico', nombre: 'Constancia médica', subido: true, obligatorio: true, estado: 'rechazado', motivoRechazo: 'La constancia médica carece de sello o firma oficial del médico tratante. Es un requisito obligatorio.' }
            ]);
          } else {
            setDocumentos([
              { id: 'acta', nombre: 'Acta de nacimiento', subido: false, obligatorio: true, estado: 'pendiente', motivoRechazo: '' },
              { id: 'curp', nombre: 'CURP', subido: false, obligatorio: true, estado: 'pendiente', motivoRechazo: '' },
              { id: 'responsiva', nombre: 'Responsiva + INE', subido: false, obligatorio: true, estado: 'pendiente', motivoRechazo: '' },
              { id: 'medico', nombre: 'Constancia médica', subido: false, obligatorio: true, estado: 'pendiente', motivoRechazo: '', vigencia: '' }
            ]);
          }
        }

        setAtleta(atletaActual);
        setDatosEditados(atletaActual);
        setCargando(false);
      }, 400); 
    };

    obtenerDatosAtleta();
  }, [atletaId, perfilId, tipoPerfil]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setDatosEditados(prev => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    setGuardando(true);
    setTimeout(() => {
      setAtleta(datosEditados);
      setModoEdicion(false);
      setGuardando(false);
    }, 600);
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return "No registrada";
    const hoy = new Date();
    const cumple = new Date(fecha);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return isNaN(edad) ? "No registrada" : `${edad} años`;
  };

  const handleUploadDoc = (id) => {
    setDocumentos(docs => docs.map(d => d.id === id ? { ...d, subido: true, estado: 'pendiente' } : d));
  };
  const handleDeleteDoc = (id) => {
    setDocumentos(docs => docs.map(d => d.id === id ? { ...d, subido: false, estado: 'pendiente' } : d));
  };
  const handlePreviewDoc = (id) => alert(`Abriendo previsualización del documento...`);
  
  const handleChangeVigencia = (id, value) => {
    setDocumentos(docs => docs.map(d => d.id === id ? { ...d, vigencia: value } : d));
  };

  if (cargando || !atleta) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-125">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a2031]"></div>
      </div>
    );
  }

  const documentosObligatorios = documentos.filter(d => d.obligatorio);
  const docsSubidos = documentosObligatorios.filter(d => d.subido && d.estado !== 'rechazado').length;
  const porcentajeExpediente = documentosObligatorios.length ? Math.round((docsSubidos / documentosObligatorios.length) * 100) : 0;
  
  const estatusExpediente = (atleta.estatus || atleta.nombre_estatus || 'PENDIENTE').toUpperCase();

  let colorBadgeCard = 'bg-gray-100 text-gray-500 border-gray-200'; // Gris (Pendiente)
  if (estatusExpediente === 'VALIDADO' || estatusExpediente === 'VERIFICADO' || estatusExpediente === 'ACTIVO') colorBadgeCard = 'bg-[#e5f5e8] text-[#2e7d32] border-[#c8e6c9]';
  else if (estatusExpediente === 'EN REVISIÓN') colorBadgeCard = 'bg-[#fff4e5] text-[#b26a00] border-[#ffe0b2]';
  else if (estatusExpediente === 'RECHAZADO') colorBadgeCard = 'bg-red-50 text-red-700 border-red-200';

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in flex flex-col relative mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-4">
        
        {/* Columna lateral FIJA (Sticky) */}
        <div className="lg:col-span-1 flex flex-col gap-4 sticky top-6">
          
          {/* Tarjeta de Identidad y Estatus */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative mt-1">
            <button
              onClick={() => cambiarVistaPanel('delegacion')}
              className="absolute top-4 left-4 p-2.5 bg-gray-50 rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-gray-900 border border-gray-100"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="relative mb-4 mt-4">
              <div className="w-28 h-28 rounded-3xl bg-gray-900 text-white flex items-center justify-center text-4xl font-black shadow-inner overflow-hidden">
                {datosEditados.nombre?.charAt(0) || 'A'}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md border border-gray-100 text-gray-400 hover:text-[#7a2031] transition-colors" title="Cambiar fotografía">
                <Camera className="w-4 h-4" />
              </button>
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
                {datosEditados.disciplina || 'Sin disciplina'}
              </span>
            </div>

            <div className="mt-4 flex justify-center w-full border-t border-gray-100 pt-4">
              <div className={`flex items-center px-3 py-1.5 justify-center rounded-lg border shadow-sm ${colorBadgeCard}`}>
                {(estatusExpediente === 'VERIFICADO' || estatusExpediente === 'VALIDADO' || estatusExpediente === 'ACTIVO') && <BadgeCheck className="w-3.5 h-3.5 mr-1.5" />}
                {estatusExpediente === 'RECHAZADO' && <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />}
                {(estatusExpediente === 'PENDIENTE' || estatusExpediente === 'EN REVISIÓN') && <Clock className="w-3.5 h-3.5 mr-1.5" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{estatusExpediente}</span>
              </div>
            </div>
          </div>

          {/* Panel de Botones */}
          <div className="space-y-3">
            {!modoEdicion ? (
              <>
                {tipoPerfil === 'atleta' && (
                  <>
                    <button className="w-full bg-gray-900 text-white rounded-2xl py-3.5 flex justify-center items-center font-bold shadow-md hover:bg-gray-800 transition-all hover:scale-[1.02]">
                      <Download className="w-4 h-4 mr-2" /> Descargar ficha PDF
                    </button>
                    <button className="w-full bg-indigo-600 text-white rounded-2xl py-3.5 flex justify-center items-center font-bold shadow-md hover:bg-indigo-700 transition-all hover:scale-[1.02]">
                      <IdCard className="w-4 h-4 mr-2" /> Descargar gafete
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => setModoEdicion(true)} 
                  className="w-full bg-white text-[#7a2031] border border-[#7a2031]/20 rounded-2xl py-3.5 flex justify-center items-center font-bold shadow-sm hover:bg-red-50 transition-all"
                >
                  <Edit className="w-4 h-4 mr-2" /> Editar información
                </button>
                
                {tipoPerfil === 'atleta' && (
                  <button className="w-full bg-amber-100 text-amber-800 rounded-2xl py-3.5 flex justify-center items-center font-bold shadow-sm hover:bg-amber-200 transition-all mt-4">
                    <UserCog className="w-4 h-4 mr-2" /> Solicitar cambio entrenador
                  </button>
                )}
              </>
            ) : (
              <>
                <button 
                  onClick={guardarCambios} 
                  disabled={guardando}
                  className="w-full bg-green-600 text-white rounded-2xl py-4 flex justify-center items-center font-bold shadow-md hover:bg-green-700 transition-all hover:scale-[1.02]"
                >
                  {guardando ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Save className="w-5 h-5 mr-2" />}
                  Guardar cambios
                </button>
                <button 
                  onClick={() => { setModoEdicion(false); setDatosEditados(atleta); }} 
                  disabled={guardando}
                  className="w-full bg-white text-gray-500 border border-gray-200 rounded-2xl py-4 flex justify-center items-center font-bold shadow-sm hover:bg-gray-50 transition-all"
                >
                  <X className="w-5 h-5 mr-2" /> Cancelar edición
                </button>
              </>
            )}
          </div>
        </div>

        {/* Columna principal: Módulos de datos */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Módulo 1: Datos personales (Compartido) */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={User} title="Información personal" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
              {modoEdicion ? (
                <>
                  <DataField label="Nombre(s)" name="nombre" value={datosEditados.nombre} isEditing={true} onChange={handleEditChange} />
                  <DataField label="Primer apellido" name="primer_apellido" value={datosEditados.primer_apellido} isEditing={true} onChange={handleEditChange} />
                  <DataField label="Segundo apellido" name="segundo_apellido" value={datosEditados.segundo_apellido} isEditing={true} onChange={handleEditChange} />
                </>
              ) : (
                <div className="col-span-2 md:col-span-1">
                  <DataField label="Nombre completo" value={`${datosEditados.nombre} ${datosEditados.primer_apellido} ${datosEditados.segundo_apellido || ''}`} />
                </div>
              )}
              
              <DataField label="Curp" name="curp" value={datosEditados.curp} isEditing={modoEdicion} onChange={handleEditChange} />
              <DataField label="Fecha de nacimiento" name="fecha_nacimiento" value={datosEditados.fecha_nacimiento} isEditing={modoEdicion} onChange={handleEditChange} type="date" />
              <DataField label="Edad calculada" value={calcularEdad(datosEditados.fecha_nacimiento)} isEditing={false} />
              
              <DataField label="Sexo" name="sexo" value={datosEditados.sexo} isEditing={modoEdicion} onChange={handleEditChange} options={['Hombre', 'Mujer']} />
              <DataField label="Género" name="genero" value={datosEditados.genero} isEditing={modoEdicion} onChange={handleEditChange} options={['Masculino', 'Femenino', 'Otro']} />
              <DataField label="Estado civil" name="estado_civil" value={datosEditados.estado_civil} isEditing={modoEdicion} onChange={handleEditChange} options={['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)']} />
              
              <DataField label="Rfc" name="rfc" value={datosEditados.rfc} isEditing={modoEdicion} onChange={handleEditChange} />
              <DataField label="Clave de elector" name="clave_ine" value={datosEditados.clave_ine} isEditing={modoEdicion} onChange={handleEditChange} />
            </div>
          </div>

          {/* Módulo 2: Domicilio y Contacto (Compartido) */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={MapPin} title="Contacto y domicilio" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Mail className="w-5 h-5" /></div>
                <DataField label="Correo electrónico" name="correo" value={datosEditados.correo} isEditing={modoEdicion} onChange={handleEditChange} type="email" />
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Phone className="w-5 h-5" /></div>
                <DataField label="Teléfono celular" name="celular" value={datosEditados.celular} isEditing={modoEdicion} onChange={handleEditChange} type="tel" />
              </div>
              <div className="md:col-span-2 mt-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <DataField label="Dirección completa" name="direccion" value={datosEditados.direccion} isEditing={modoEdicion} onChange={handleEditChange} />
                  </div>
                  <DataField label="Código postal" name="codigo_postal" value={datosEditados.codigo_postal} isEditing={modoEdicion} onChange={handleEditChange} />
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- MÓDULOS DE ATLETA ---------------- */}
          {tipoPerfil === 'atleta' && (
            <>
              {/* Módulo 3: Perfil Médico */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <SectionTitle icon={Activity} title="Perfil médico y biométrico" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-8 h-8 text-red-500" />
                    <DataField label="Tipo de sangre" name="tipo_sangre" value={datosEditados.tipo_sangre} isEditing={modoEdicion} onChange={handleEditChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Weight className="w-8 h-8 text-blue-500" />
                    <DataField label="Peso (kg)" name="peso_kg" value={datosEditados.peso_kg} isEditing={modoEdicion} onChange={handleEditChange} type="number" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Ruler className="w-8 h-8 text-green-500" />
                    <DataField label="Estatura (mts)" name="estatura_mts" value={datosEditados.estatura_mts} isEditing={modoEdicion} onChange={handleEditChange} type="number" />
                  </div>
                  <DataField label="Alergias" name="alergias" value={datosEditados.alergias} isEditing={modoEdicion} onChange={handleEditChange} />
                </div>
              </div>

              {/* Módulo 4: Deportivo y Académico */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <SectionTitle icon={GraduationCap} title="Deportivo y Académico" />
                
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a2031] mb-5">Perfil Deportivo</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <DataField label="Disciplina" name="disciplina" value={datosEditados.disciplina} isEditing={modoEdicion} onChange={handleEditChange} listId="lista-disciplinas" listOptions={catalogoDisciplinas} />
                  <DataField label="División / Categoría" name="division" value={datosEditados.division} isEditing={modoEdicion} onChange={handleEditChange} listId="lista-divisiones" listOptions={catalogoDivisiones} />
                  <DataField label="Club afiliado" name="club" value={datosEditados.club} isEditing={modoEdicion} onChange={handleEditChange} listId="lista-clubes" listOptions={catalogoClubes} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a2031] mb-5 border-t border-gray-100 pt-6">Perfil Académico</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <DataField label="Nivel de estudios" name="nivel_estudios" value={datosEditados.nivel_estudios} isEditing={modoEdicion} onChange={handleEditChange} options={['Primaria', 'Secundaria', 'Preparatoria', 'Licenciatura', 'Maestría']} />
                  <DataField label="Institución educativa" name="institucion_educativa" value={datosEditados.institucion_educativa} isEditing={modoEdicion} onChange={handleEditChange} />
                </div>
                
                <div className="border-t border-gray-100 pt-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Tallas de uniformes oficiales</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl">
                    <DataField label="Camisa" name="talla_camisa" value={datosEditados.talla_camisa} isEditing={modoEdicion} onChange={handleEditChange} options={['XS', 'S', 'M', 'L', 'XL', 'XXL']} />
                    <DataField label="Pantalón" name="talla_pantalon" value={datosEditados.talla_pantalon} isEditing={modoEdicion} onChange={handleEditChange} />
                    <DataField label="Short" name="talla_short" value={datosEditados.talla_short} isEditing={modoEdicion} onChange={handleEditChange} options={['XS', 'S', 'M', 'L', 'XL', 'XXL']} />
                    <DataField label="Calzado (mx)" name="talla_calzado" value={datosEditados.talla_calzado} isEditing={modoEdicion} onChange={handleEditChange} />
                  </div>
                </div>
              </div>

              {/* Módulo 5: Expediente Digital Completo */}
              <div ref={docsRef} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4">
                   <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-[#7a2031]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Expediente digital</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">Los documentos deben subirse en PDF con un máximo de 10 MB por archivo.</p>
                      </div>
                   </div>
                </div>
                
                <div className="mb-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                   <div className="flex justify-between items-center mb-3">
                     <span className="text-sm font-bold text-gray-700">Progreso del expediente</span>
                     <span className="text-lg font-black text-[#7a2031]">{porcentajeExpediente}%</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                     <div className="bg-[#7a2031] h-2.5 rounded-full transition-all duration-1000" style={{width: `${porcentajeExpediente}%`}}></div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500 font-medium">Estado actual:</span>
                     <span className={`flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm ${
                       estatusExpediente === 'VERIFICADO' || estatusExpediente === 'VALIDADO' ? 'bg-[#e5f5e8] text-[#2e7d32]' : 
                       estatusExpediente === 'RECHAZADO' ? 'bg-red-100 text-red-800' :
                       estatusExpediente === 'EN REVISIÓN' ? 'bg-[#fff4e5] text-[#b26a00]' :
                       'bg-gray-100 text-gray-500 border border-gray-200'
                     }`}>
                       {(estatusExpediente === 'VERIFICADO' || estatusExpediente === 'VALIDADO') && <BadgeCheck className="w-3.5 h-3.5 mr-1.5" />}
                       {estatusExpediente === 'RECHAZADO' && <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />}
                       {(estatusExpediente === 'PENDIENTE' || estatusExpediente === 'EN REVISIÓN') && <Clock className="w-3.5 h-3.5 mr-1.5" />}
                       {estatusExpediente}
                     </span>
                   </div>
                </div>

                <div className="space-y-4">
                  {documentos.map(doc => (
                    <div key={doc.id} className={`flex flex-col p-4 rounded-xl border transition-colors ${
                      doc.estado === 'rechazado' ? 'bg-red-50/50 border-red-200' : 
                      doc.subido ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-dashed border-gray-300'
                    }`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 shadow-sm font-bold text-xs shrink-0 ${
                            doc.estado === 'rechazado' ? 'bg-red-100 text-red-600' :
                            doc.subido ? 'bg-red-50 text-red-600' : 'bg-gray-200 text-gray-400'
                          }`}>
                            PDF
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${doc.subido ? 'text-gray-800' : 'text-gray-500'}`}>
                              {doc.nombre} {!doc.obligatorio && <span className="font-normal text-xs text-gray-400 ml-1">(Opcional)</span>}
                            </span>
                            {doc.subido && doc.estado === 'validado' && <span className="text-xs text-green-600 font-bold flex items-center mt-1"><CheckCircle className="w-3 h-3 mr-1" /> Validado</span>}
                            {doc.estado === 'rechazado' && <span className="text-xs text-red-600 font-bold flex items-center mt-1"><AlertTriangle className="w-3 h-3 mr-1" /> Requiere corrección</span>}
                          </div>
                        </div>

                        <div className="flex items-center w-full sm:w-auto justify-end gap-2 shrink-0">
                          {doc.id === 'medico' && (doc.subido || doc.estado === 'rechazado') && (
                            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2 mr-2">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <input 
                                type="date" 
                                className="text-xs font-medium text-gray-700 outline-none py-2 bg-transparent"
                                value={doc.vigencia || ''}
                                onChange={(e) => handleChangeVigencia(doc.id, e.target.value)}
                                disabled={estatusExpediente === 'VALIDADO' || estatusExpediente === 'VERIFICADO'}
                                title="Vigencia de la constancia"
                              />
                            </div>
                          )}

                          {doc.subido ? (
                            <>
                              <button onClick={() => handlePreviewDoc(doc.id)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors border border-gray-200 bg-white" title="Previsualizar documento">
                                <Eye className="w-4 h-4" />
                              </button>
                              {estatusExpediente !== 'VALIDADO' && estatusExpediente !== 'VERIFICADO' && (
                                <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-gray-200 bg-white" title="Eliminar documento">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          ) : (
                            <button onClick={() => handleUploadDoc(doc.id)} className="flex items-center px-4 py-2 bg-[#7a2031] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#5a1523] transition-colors" title="Subir archivo">
                              <Upload className="w-4 h-4 mr-2" /> Subir
                            </button>
                          )}
                        </div>
                      </div>

                      {doc.estado === 'rechazado' && doc.motivoRechazo && (
                        <div className="mt-4 p-3 bg-red-100/50 border border-red-200 rounded-lg flex items-start">
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                          <p className="text-xs font-medium text-red-800 leading-relaxed"><span className="font-bold">Motivo del rechazo:</span> {doc.motivoRechazo}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </>
          )}

          {/* ---------------- MÓDULOS DE ENTRENADOR ---------------- */}
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