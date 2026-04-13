import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, CheckCircle, Search, User, MapPin, Activity, Shirt, AlertTriangle, X } from 'lucide-react';

const ESTADO_INICIAL_FORMULARIO = {
  idUsuarioAtleta: null, 
  curp: '',
  nombre: '', primerApellido: '', segundoApellido: '', fechaNacimiento: '', 
  rfc: '', nss: '', ine: '', estadoCivil: '', sexo: '', genero: '',
  lugarNacimiento: '', municipioOrigen: '',
  correo: '', telefonoFijo: '', celular: '',
  codigoPostal: '', colonia: '', calle: '', numExterior: '', numInterior: '', 
  manzana: '', lote: '', cruzamientos: '', municipioResidencia: '',
  disciplina: '', categoria: '', tipoSangre: '', alergias: '', peso: '', estatura: '',
  tallaCamisa: '', tallaPantalon: '', tallaShort: '', tallaChamarra: '', tallaTenis: '',
  nivelEstudios: '', institucion: '', carrera: ''
};

const mapCatalogo = {
  sexo: { 'HOMBRE': 1, 'MUJER': 2, 'INTERSEXUAL': 3 },
  genero: { 'MASCULINO': 1, 'FEMENINO': 2, 'NO BINARIO': 3, 'PREFIERO NO DECIRLO': 4 },
  estadoCivil: { 'SOLTERO(A)': 1, 'CASADO(A)': 2, 'DIVORCIADO(A)': 3, 'VIUDO(A)': 4, 'UNIÓN LIBRE': 5 },
  tipoSangre: { 'A+': 1, 'A-': 2, 'B+': 3, 'B-': 4, 'AB+': 5, 'AB-': 6, 'O+': 7, 'O-': 8 },
  disciplina: { 'ATLETISMO': 1, 'FÚTBOL': 2, 'BÉISBOL': 3, 'BÁSQUETBOL': 4, 'NATACIÓN': 5 },
  categoria: { 'INFANTIL': 1, 'JUVENIL': 2, 'LIBRE': 3, 'VETERANOS': 4 },
  talla: { 'XS': 4, 'S': 5, 'M': 6, 'L': 7, 'XL': 8, 'XXL': 8 }, 
  nivelEstudios: { 'PRIMARIA': 1, 'SECUNDARIA': 2, 'PREPARATORIA': 3, 'LICENCIATURA': 4, 'MAESTRÍA': 5 }
};

const getID = (catalogo, valorStr) => {
  if (!valorStr) return null;
  return mapCatalogo[catalogo][valorStr.toUpperCase()] || null;
};

export default function VistaInscripcionAtleta({ intentoNavegacion, confirmarNavegacion, cancelarNavegacion, solicitarNavegacion, usuarioAutenticado }) {
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 5;
  const [cargando, setCargando] = useState(false);
  const [guardandoYMD, setGuardandoYMD] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [atletaExistente, setAtletaExistente] = useState(null);
  
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'exito' });
  const [datosFormulario, setDatosFormulario] = useState(ESTADO_INICIAL_FORMULARIO);

  const totalCampos = Object.keys(datosFormulario).length - 1; 
  const camposLlenos = Object.values(datosFormulario).filter(valor => typeof valor === 'string' && valor.trim() !== '').length;
  const porcentajeProgreso = (camposLlenos / totalCampos) * 100;

  useEffect(() => {
    if (intentoNavegacion && pasoActual === 1) {
      if (intentoNavegacion === 'inscripcion') {
        setDatosFormulario(ESTADO_INICIAL_FORMULARIO);
        setPasoActual(1);
        cancelarNavegacion();
      } else {
        confirmarNavegacion(intentoNavegacion);
      }
    }
  }, [intentoNavegacion, pasoActual, cancelarNavegacion, confirmarNavegacion]);

  const manejarCambio = (campo, valor) => {
    setDatosFormulario({ ...datosFormulario, [campo]: valor });
    if (campo === 'curp') {
      setErrorValidacion('');
      setAtletaExistente(null);
    }
  };

  const validarCurpYAvanzar = async () => {
    if (!datosFormulario.curp || datosFormulario.curp.length !== 18) {
      setErrorValidacion('La CURP debe tener exactamente 18 caracteres.');
      return;
    }

    setCargando(true);
    setErrorValidacion('');
    setNotificacion({ visible: false, mensaje: '', tipo: '' });

    const token = localStorage.getItem('token_remude');

    try {
      const URL_VALIDAR_CURP = `http://localhost:3000/api/atletas/validar-curp/${datosFormulario.curp}`;
      const respuesta = await fetch(URL_VALIDAR_CURP, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (respuesta.status === 404) {
         setErrorValidacion('Error 404: La ruta para validar CURP no se encuentra en el backend. Revisa atletas.routes.js');
         return;
      }

      const data = await respuesta.json();

      if (respuesta.ok) {
        if (data.existe) {
          setAtletaExistente({
            tipo: data.tipo || 'atleta',
            nombre: data.nombre || 'Nombre Desconocido',
            entrenadorActual: data.entrenadorActual || 'Entrenador Desconocido'
          });
        } else {
          setPasoActual(2);
        }
      } else {
         setErrorValidacion(data.message || 'Error al validar la CURP con el servidor.');
      }
    } catch (error) {
      console.error('Error validando CURP:', error);
      setErrorValidacion('Error de conexión. El servidor no responde a la validación de CURP.');
    } finally {
      setCargando(false);
    }
  };

  const retrocederPaso = () => setPasoActual(prev => Math.max(prev - 1, 1));
  const avanzarPaso = () => setPasoActual(prev => Math.min(prev + 1, totalPasos));

  const enviarFormulario = async (esAvance = false, destinoFinal = null) => {
    setCargando(true);
    setNotificacion({ visible: false, mensaje: '', tipo: '' }); 

    const token = localStorage.getItem('token_remude');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    
    const nombreLimpio = `${datosFormulario.nombre} ${datosFormulario.primerApellido}`.trim();
    const textoAtleta = nombreLimpio ? ` para el atleta ${nombreLimpio}` : '';

    const procesarExito = () => {
      if (destinoFinal) {
        if (destinoFinal === 'inscripcion') {
          setDatosFormulario(ESTADO_INICIAL_FORMULARIO);
          setPasoActual(1);
          cancelarNavegacion();
          setNotificacion({ visible: true, mensaje: `Se han guardado los avances con éxito${textoAtleta}. Formulario listo para un nuevo registro.`, tipo: 'exito' });
        } else {
          confirmarNavegacion(destinoFinal);
        }
        return;
      }

      if (esAvance) {
        setNotificacion({ visible: true, mensaje: `Se han guardado los avances con éxito${textoAtleta}.`, tipo: 'exito' });
      } else {
        setNotificacion({ visible: true, mensaje: `¡Registro finalizado con éxito${textoAtleta}!`, tipo: 'exito' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    try {
      let currentUserId = datosFormulario.idUsuarioAtleta;

      if (!currentUserId && datosFormulario.nombre) {
        const payloadBase = {
          nombre: datosFormulario.nombre,
          primer_apellido: datosFormulario.primerApellido,
          segundo_apellido: datosFormulario.segundoApellido || "",
          correo: datosFormulario.correo || `temp_${Date.now()}@remude.com`, 
          password: "Remude_password123!", 
          curp: datosFormulario.curp,
          id_entrenador: usuarioAutenticado?.id_usuario
        };

        const resBase = await fetch('http://localhost:3000/api/auth/registro/atleta', { method: 'POST', headers, body: JSON.stringify(payloadBase) });
        const dataBase = await resBase.json();
        
        if (resBase.ok) {
          currentUserId = dataBase.id_usuario;
          setDatosFormulario(prev => ({ ...prev, idUsuarioAtleta: currentUserId }));
        } else {
          throw new Error(dataBase.message || dataBase.error || dataBase.detail || "Error al registrar el usuario base del atleta.");
        }
      }

      if (currentUserId) {
        const payloadPersonal = {
          id_sexo: getID('sexo', datosFormulario.sexo),
          id_genero: getID('genero', datosFormulario.genero),
          id_estadocivil: getID('estadoCivil', datosFormulario.estadoCivil),
          rfc: datosFormulario.rfc,
          nss: datosFormulario.nss,
          clave_ine: datosFormulario.ine,
          lugar_nacimiento: datosFormulario.lugarNacimiento
        };
        await fetch(`http://localhost:3000/api/perfiles/${currentUserId}/personal`, { method: 'PUT', headers, body: JSON.stringify(payloadPersonal) });

        if (datosFormulario.celular || datosFormulario.codigoPostal) {
          const payloadDomicilio = {
            celular: datosFormulario.celular,
            telefono_fijo: datosFormulario.telefonoFijo,
            codigo_postal: datosFormulario.codigoPostal,
            colonia: datosFormulario.colonia,
            direccion_calle: datosFormulario.calle,
            cruzamientos: datosFormulario.cruzamientos,
            num_exterior: datosFormulario.numExterior,
            num_interior: datosFormulario.numInterior,
            manzana: datosFormulario.manzana,
            lote: datosFormulario.lote
          };
          await fetch(`http://localhost:3000/api/perfiles/${currentUserId}/domicilio`, { method: 'PUT', headers, body: JSON.stringify(payloadDomicilio) });
        }

        if (datosFormulario.peso || datosFormulario.tipoSangre) {
          const payloadMedico = {
            id_tiposangre: getID('tipoSangre', datosFormulario.tipoSangre),
            peso_kg: parseFloat(datosFormulario.peso) || null,
            estatura_mts: parseFloat(datosFormulario.estatura) || null,
            alergias_condiciones: datosFormulario.alergias
          };
          await fetch(`http://localhost:3000/api/perfiles/${currentUserId}/medico`, { method: 'PUT', headers, body: JSON.stringify(payloadMedico) });
        }

        if (datosFormulario.tallaCamisa || datosFormulario.disciplina) {
          const payloadDetalles = {
            id_categoria: getID('categoria', datosFormulario.categoria),
            id_talla_camisa: getID('talla', datosFormulario.tallaCamisa),
            id_talla_pantalon: getID('talla', datosFormulario.tallaPantalon),
            id_talla_short: getID('talla', datosFormulario.tallaShort),
            id_talla_chamarra: getID('talla', datosFormulario.tallaChamarra),
            talla_calzado: parseFloat(datosFormulario.tallaTenis) || null,
            id_nivel_estudios: getID('nivelEstudios', datosFormulario.nivelEstudios),
            institucion_escolar: datosFormulario.institucion
          };
          await fetch(`http://localhost:3000/api/perfiles/${currentUserId}/detalles`, { method: 'PUT', headers, body: JSON.stringify(payloadDetalles) });
        }

        if (!esAvance) {
          await fetch(`http://localhost:3000/api/perfiles/${currentUserId}/enviar-revision`, { method: 'PUT', headers });
        }
      }

      procesarExito(); 
      
    } catch (error) {
      console.error('Error enviando datos:', error);
      setNotificacion({ visible: true, mensaje: error.message || 'Error al conectar con el servidor.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in pb-10 relative">
      
      {intentoNavegacion && pasoActual > 1 && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">¿Guardar avances?</h3>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Estás a punto de salir de la inscripción o reiniciar el formulario. ¿Deseas guardar en la base de datos la información que has ingresado hasta ahora?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={async () => {
                  setGuardandoYMD(true);
                  await enviarFormulario(true, intentoNavegacion);
                  setGuardandoYMD(false);
                }} 
                disabled={guardandoYMD}
                className={`text-white py-3 rounded-xl font-bold shadow-md transition-all ${guardandoYMD ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7a2031] hover:bg-[#5a1523]'}`}
              >
                {guardandoYMD ? 'Guardando avance...' : 'Guardar y salir'}
              </button>
              <button 
                onClick={() => {
                  if (intentoNavegacion === 'inscripcion') {
                    setDatosFormulario(ESTADO_INICIAL_FORMULARIO);
                    setPasoActual(1);
                    cancelarNavegacion();
                  } else {
                    confirmarNavegacion(intentoNavegacion);
                  }
                }} 
                className="bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Salir sin guardar
              </button>
              <button onClick={cancelarNavegacion} className="text-gray-400 text-sm font-bold mt-2 hover:text-gray-600 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {notificacion.visible && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-60 w-[90%] max-w-2xl p-4 rounded-xl shadow-xl flex justify-between items-start animate-fade-in-down ${notificacion.tipo === 'exito' ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'}`}>
          <div className="flex items-start">
            {notificacion.tipo === 'exito' ? <CheckCircle className="w-6 h-6 mr-3 text-white shrink-0 mt-0.5" /> : <AlertTriangle className="w-6 h-6 mr-3 text-white shrink-0 mt-0.5" />}
            <div className="flex flex-col">
              <p className="text-sm font-bold leading-relaxed">{notificacion.mensaje}</p>
              
              {notificacion.tipo === 'exito' && (
                <button 
                  onClick={() => {
                    setNotificacion({ visible: false, mensaje: '', tipo: '' });
                    setDatosFormulario(ESTADO_INICIAL_FORMULARIO);
                    setPasoActual(1);
                  }}
                  className="text-left text-xs font-bold mt-2 text-white/90 hover:text-white underline underline-offset-2 transition-colors inline-block"
                >
                  ¿Deseas inscribir a otro atleta? Haz clic aquí para limpiar el formulario.
                </button>
              )}
            </div>
          </div>
          <button onClick={() => setNotificacion({ ...notificacion, visible: false })} className="p-1 hover:bg-black/10 rounded-lg transition-colors ml-4 shrink-0">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center mb-8 mt-4">
        <button onClick={() => solicitarNavegacion('resumen')} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow mr-4 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Inscripción de atleta</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Completa los datos estructurados para el padrón municipal.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paso {pasoActual} de {totalPasos}</span>
            <span className="text-sm font-black text-[#7a2031]">{Math.round(porcentajeProgreso)}% completado</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-[#7a2031] h-full transition-all duration-500 ease-out" style={{ width: `${porcentajeProgreso}%` }}></div>
          </div>
        </div>

        <div className="p-8">
          
          {pasoActual === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#c2a649]/10 rounded-lg"><Search className="w-6 h-6 text-[#c2a649]" /></div>
                <h3 className="text-xl font-bold text-gray-900">Validación de identidad</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-6 flex">
                <span className="font-bold mr-2">Info:</span> Ingresa la CURP del atleta para verificar si ya existe en el sistema antes de llenar todo el formulario.
              </div>
              
              {atletaExistente && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl mb-6 animate-fade-in">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-500 mr-3 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">¡Esta CURP ya está registrada en el padrón!</h4>
                      
                      {atletaExistente.tipo === 'entrenador' ? (
                        <p className="text-sm text-red-800 mb-4">
                          Esta CURP le pertenece al entrenador(a) <strong>{atletaExistente.nombre}</strong>. No puedes registrar a un entrenador como atleta con la misma CURP.
                        </p>
                      ) : (
                        <p className="text-sm text-red-800 mb-4">
                          El atleta <strong>{atletaExistente.nombre}</strong> se encuentra actualmente bajo la delegación del entrenador(a) <strong>{atletaExistente.entrenadorActual}</strong>.
                        </p>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        {atletaExistente.tipo === 'atleta' && (
                          <button 
                            onClick={() => alert("Función para solicitar reasignación en construcción...")}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-red-700 transition-colors"
                          >
                            Solicitar cambio de entrenador
                          </button>
                        )}
                        <button 
                          onClick={() => { setAtletaExistente(null); setDatosFormulario({...datosFormulario, curp: ''}); }}
                          className="px-4 py-2 bg-white text-red-600 text-sm font-bold rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          Ingresar otra CURP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!atletaExistente && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Clave Única de Registro de Población (CURP) *</label>
                    <input
                      type="text" placeholder="Ingresa los 18 caracteres" maxLength="18"
                      className={`block w-full px-4 py-4 bg-gray-50 rounded-xl outline-none transition-all text-gray-800 shadow-sm font-mono uppercase ${errorValidacion ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#7a2031]'}`}
                      value={datosFormulario.curp}
                      onChange={(e) => manejarCambio('curp', e.target.value.toUpperCase())}
                    />
                    {errorValidacion && <p className="text-red-500 text-xs font-bold mt-2">{errorValidacion}</p>}
                  </div>
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={validarCurpYAvanzar} 
                      disabled={cargando}
                      className={`text-white px-8 py-3 rounded-xl font-bold shadow-md transition-colors flex items-center ${cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7a2031] hover:bg-[#5a1523]'}`}
                    >
                      {cargando ? 'Validando...' : 'Validar CURP e Iniciar'} 
                      {!cargando && <ChevronRight className="w-5 h-5 ml-2" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {pasoActual === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#c2a649]/10 rounded-lg"><User className="w-6 h-6 text-[#c2a649]" /></div>
                <h3 className="text-xl font-bold text-gray-900">Datos personales</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="Nombre(s) *" valor={datosFormulario.nombre} cambiar={(v) => manejarCambio('nombre', v)} />
                <InputGroup label="Primer apellido *" valor={datosFormulario.primerApellido} cambiar={(v) => manejarCambio('primerApellido', v)} />
                <InputGroup label="Segundo apellido" valor={datosFormulario.segundoApellido} cambiar={(v) => manejarCambio('segundoApellido', v)} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="Fecha de nacimiento *" tipo="date" valor={datosFormulario.fechaNacimiento} cambiar={(v) => manejarCambio('fechaNacimiento', v)} />
                <SelectGroup label="Sexo *" opciones={['HOMBRE', 'MUJER']} valor={datosFormulario.sexo} cambiar={(v) => manejarCambio('sexo', v)} />
                <SelectGroup label="Género *" opciones={['MASCULINO', 'FEMENINO', 'OTRO']} valor={datosFormulario.genero} cambiar={(v) => manejarCambio('genero', v)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="RFC" valor={datosFormulario.rfc} cambiar={(v) => manejarCambio('rfc', v)} />
                <InputGroup label="NSS (Seguro Social)" valor={datosFormulario.nss} cambiar={(v) => manejarCambio('nss', v)} />
                <InputGroup label="Clave de Elector (INE)" valor={datosFormulario.ine} cambiar={(v) => manejarCambio('ine', v)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectGroup label="Estado civil *" opciones={['SOLTERO(A)', 'CASADO(A)', 'DIVORCIADO(A)', 'VIUDO(A)']} valor={datosFormulario.estadoCivil} cambiar={(v) => manejarCambio('estadoCivil', v)} />
                <InputGroup label="Lugar de nacimiento *" valor={datosFormulario.lugarNacimiento} cambiar={(v) => manejarCambio('lugarNacimiento', v)} />
              </div>

              <BotonesNavegacion retroceder={retrocederPaso} avanzar={avanzarPaso} guardar={() => enviarFormulario(true)} cargando={cargando} />
            </div>
          )}

          {pasoActual === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#c2a649]/10 rounded-lg"><MapPin className="w-6 h-6 text-[#c2a649]" /></div>
                <h3 className="text-xl font-bold text-gray-900">Domicilio y contacto</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="Correo electrónico *" tipo="email" valor={datosFormulario.correo} cambiar={(v) => manejarCambio('correo', v)} />
                <InputGroup label="Celular *" tipo="tel" valor={datosFormulario.celular} cambiar={(v) => manejarCambio('celular', v)} />
                <InputGroup label="Teléfono Fijo" tipo="tel" valor={datosFormulario.telefonoFijo} cambiar={(v) => manejarCambio('telefonoFijo', v)} />
              </div>

              <div className="border-t border-gray-100 my-6 pt-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <InputGroup label="Código Postal *" valor={datosFormulario.codigoPostal} cambiar={(v) => manejarCambio('codigoPostal', v)} />
                <div className="md:col-span-3">
                  <InputGroup label="Colonia *" valor={datosFormulario.colonia} cambiar={(v) => manejarCambio('colonia', v)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <InputGroup label="Dirección (Calle) *" valor={datosFormulario.calle} cambiar={(v) => manejarCambio('calle', v)} />
                </div>
                <InputGroup label="Cruzamientos" valor={datosFormulario.cruzamientos} cambiar={(v) => manejarCambio('cruzamientos', v)} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <InputGroup label="Núm. Exterior *" valor={datosFormulario.numExterior} cambiar={(v) => manejarCambio('numExterior', v)} />
                <InputGroup label="Núm. Interior" valor={datosFormulario.numInterior} cambiar={(v) => manejarCambio('numInterior', v)} />
                <InputGroup label="Manzana" valor={datosFormulario.manzana} cambiar={(v) => manejarCambio('manzana', v)} />
                <InputGroup label="Lote" valor={datosFormulario.lote} cambiar={(v) => manejarCambio('lote', v)} />
              </div>

              <BotonesNavegacion retroceder={retrocederPaso} avanzar={avanzarPaso} guardar={() => enviarFormulario(true)} cargando={cargando} />
            </div>
          )}

          {pasoActual === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#c2a649]/10 rounded-lg"><Activity className="w-6 h-6 text-[#c2a649]" /></div>
                <h3 className="text-xl font-bold text-gray-900">Perfil deportivo y médico</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectGroup label="Disciplina *" opciones={['Atletismo', 'Fútbol', 'Básquetbol', 'Béisbol', 'Natación', 'Boxeo']} valor={datosFormulario.disciplina} cambiar={(v) => manejarCambio('disciplina', v)} />
                <SelectGroup label="Categoría *" opciones={['Infantil', 'Juvenil Menor', 'Juvenil Mayor', 'Libre', 'Veteranos']} valor={datosFormulario.categoria} cambiar={(v) => manejarCambio('categoria', v)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectGroup label="Tipo de sangre *" opciones={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} valor={datosFormulario.tipoSangre} cambiar={(v) => manejarCambio('tipoSangre', v)} />
                <InputGroup label="Peso (Kg) *" placeholder="Ej. 65" valor={datosFormulario.peso} cambiar={(v) => manejarCambio('peso', v)} />
                <InputGroup label="Estatura (Mts) *" placeholder="Ej. 1.70" valor={datosFormulario.estatura} cambiar={(v) => manejarCambio('estatura', v)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Alergias o condiciones médicas</label>
                <textarea 
                  rows="3" placeholder="Especifique alergias o enfermedades crónicas..."
                  className="block w-full px-4 py-3 bg-gray-50 rounded-xl outline-none transition-all text-gray-800 shadow-sm focus:ring-2 focus:ring-[#7a2031] resize-none"
                  value={datosFormulario.alergias} onChange={(e) => manejarCambio('alergias', e.target.value)}
                ></textarea>
              </div>

              <BotonesNavegacion retroceder={retrocederPaso} avanzar={avanzarPaso} guardar={() => enviarFormulario(true)} cargando={cargando} />
            </div>
          )}

          {pasoActual === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#c2a649]/10 rounded-lg"><Shirt className="w-6 h-6 text-[#c2a649]" /></div>
                <h3 className="text-xl font-bold text-gray-900">Uniformes y extras</h3>
              </div>

              <p className="text-sm font-bold text-gray-500 uppercase">Tallas de uniforme</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <SelectGroup label="Camisa/Playera" opciones={['XS', 'S', 'M', 'L', 'XL', 'XXL']} valor={datosFormulario.tallaCamisa} cambiar={(v) => manejarCambio('tallaCamisa', v)} />
                <SelectGroup label="Pantalón" opciones={['XS', 'S', 'M', 'L', 'XL', 'XXL']} valor={datosFormulario.tallaPantalon} cambiar={(v) => manejarCambio('tallaPantalon', v)} />
                <SelectGroup label="Short" opciones={['XS', 'S', 'M', 'L', 'XL', 'XXL']} valor={datosFormulario.tallaShort} cambiar={(v) => manejarCambio('tallaShort', v)} />
                <SelectGroup label="Chamarra" opciones={['XS', 'S', 'M', 'L', 'XL', 'XXL']} valor={datosFormulario.tallaChamarra} cambiar={(v) => manejarCambio('tallaChamarra', v)} />
                <InputGroup label="Calzado (MX)" placeholder="Ej. 27.5" valor={datosFormulario.tallaTenis} cambiar={(v) => manejarCambio('tallaTenis', v)} />
              </div>

              <div className="border-t border-gray-100 my-6 pt-6"></div>
              
              <p className="text-sm font-bold text-gray-500 uppercase mb-4">Perfil Académico</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectGroup label="Nivel de estudios" opciones={['Primaria', 'Secundaria', 'Preparatoria', 'Licenciatura', 'Maestría']} valor={datosFormulario.nivelEstudios} cambiar={(v) => manejarCambio('nivelEstudios', v)} />
                <div className="md:col-span-2">
                  <InputGroup label="Institución Escolar" valor={datosFormulario.institucion} cambiar={(v) => manejarCambio('institucion', v)} />
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 mt-4 border-t border-gray-100">
                <button onClick={retrocederPaso} className="text-gray-500 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                  Volver
                </button>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => enviarFormulario(true)}
                    disabled={cargando}
                    className="text-[#7a2031] font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    {cargando ? 'Guardando...' : 'Guardar avance'}
                  </button>
                  <button 
                    onClick={() => enviarFormulario(false)} 
                    disabled={cargando}
                    className={`px-8 py-3 rounded-xl font-bold shadow-md transition-colors flex items-center ${cargando ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    {cargando ? 'Finalizando...' : <><CheckCircle className="w-5 h-5 mr-2" /> Finalizar registro</>}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, tipo = "text", placeholder = "", valor, cambiar }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{label}</label>
      <input
        type={tipo} placeholder={placeholder}
        className="block w-full px-4 py-3 bg-gray-50 rounded-xl outline-none transition-all text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-[#7a2031] focus:bg-white"
        value={valor} onChange={(e) => cambiar(e.target.value)}
      />
    </div>
  );
}

function SelectGroup({ label, opciones, valor, cambiar }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{label}</label>
      <select
        className="block w-full px-4 py-3 bg-gray-50 rounded-xl outline-none transition-all text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-[#7a2031] focus:bg-white cursor-pointer"
        value={valor} onChange={(e) => cambiar(e.target.value)}
      >
        <option value="" disabled>Seleccione...</option>
        {opciones.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function BotonesNavegacion({ retroceder, avanzar, guardar, cargando }) {
  return (
    <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-100">
      <button onClick={retroceder} className="text-gray-500 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
        Volver
      </button>
      <div className="flex space-x-4">
        <button
          onClick={guardar}
          disabled={cargando}
          className="text-[#7a2031] font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors"
        >
          {cargando ? 'Guardando...' : 'Guardar avance'}
        </button>
        <button onClick={avanzar} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-gray-800 transition-colors flex items-center">
          Siguiente paso <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
