// src/views/admin/VistaConfiguracion.jsx
import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Lock, Save, AlertCircle, CheckCircle, Power, User } from 'lucide-react';

export default function VistaConfiguracion() {
  const [cargando, setCargando] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    nombre: 'Cargando...',
    correo: 'cargando@remude.com',
    rol: 'Administrador General'
  });
  
  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  const [inscripcionesAbiertas, setInscripcionesAbiertas] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Simulamos la carga de datos del admin al montar el componente
  // En un entorno real, decodificarías el token o harías un fetch a /api/perfiles/me
  useEffect(() => {
    // Aquí puedes decodificar el JWT almacenado en localStorage para obtener el nombre real
    const cargarDatos = async () => {
      // Simulando delay de red
      setTimeout(() => {
        setAdminInfo({
          nombre: 'Admin General Bacalar', // Reemplazar con datos del backend/token
          correo: 'admin@bacalar.gob.mx',
          rol: 'Administrador del Sistema'
        });
      }, 500);
    };
    cargarDatos();
  }, []);

  const manejarCambioPassword = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (passwords.nueva !== passwords.confirmar) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden.' });
      return;
    }

    if (passwords.nueva.length < 6) {
      setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setCargando(true);
    try {
      // AQUÍ IRÍA TU FETCH AL BACKEND: PUT /api/auth/cambiar-password
      // const respuesta = await fetch('http://localhost:3000/api/auth/cambiar-password', { ... })
      
      // Simulación de éxito
      setTimeout(() => {
        setMensaje({ tipo: 'exito', texto: 'Contraseña actualizada correctamente.' });
        setPasswords({ actual: '', nueva: '', confirmar: '' });
        setCargando(false);
      }, 1000);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al cambiar la contraseña. Intente nuevamente.' });
      setCargando(false);
    }
  };

  const toggleInscripciones = async () => {
    // Almacenamos el nuevo estado propuesto
    const nuevoEstado = !inscripcionesAbiertas;
    setInscripcionesAbiertas(nuevoEstado);
    
    // AQUÍ IRÍA TU FETCH AL BACKEND para actualizar la configuración global
    // fetch('http://localhost:3000/api/admin/configuracion/inscripciones', { method: 'PUT', body: JSON.stringify({ abiertas: nuevoEstado }) })
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-10 animate-fade-in flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>
      
      <div className="mb-6 mt-2 shrink-0">
        <h2 className="text-3xl font-black text-[#7a2031] tracking-tight flex items-center">
          <Settings className="w-8 h-8 mr-3" /> Configuración del Sistema
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Gestiona tus credenciales y el comportamiento global de la plataforma Remude.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Perfil y Controles Globales */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Tarjeta de Identidad Admin */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-900 to-gray-800"></div>
            
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center p-1.5 shadow-lg relative z-10 mt-6 mb-4">
              <div className="w-full h-full rounded-full bg-[#7a2031] flex items-center justify-center text-white text-3xl font-black border-4 border-white">
                A
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mt-2">{adminInfo.nombre}</h3>
            <span className="text-xs font-medium text-gray-500 mb-4">{adminInfo.correo}</span>
            
            <div className="flex items-center justify-center bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-200 shadow-inner w-full">
              <ShieldCheck className="w-5 h-5 mr-2 text-amber-600" />
              <span className="text-sm font-bold uppercase tracking-wider">{adminInfo.rol}</span>
            </div>
          </div>

          {/* Tarjeta de Control de Inscripciones (Interruptor) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Power className="w-5 h-5 mr-2 text-gray-400" />
                Inscripciones
              </h3>
            </div>
            
            <p className="text-xs text-gray-500 mb-6">
              Abre o cierra el registro de nuevos atletas y entrenadores en la plataforma. Si está cerrado, nadie podrá crear nuevas cuentas.
            </p>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <span className={`text-sm font-bold block ${inscripcionesAbiertas ? 'text-green-600' : 'text-red-600'}`}>
                  {inscripcionesAbiertas ? 'ABIERTAS' : 'CERRADAS'}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado Actual</span>
              </div>
              
              {/* Botón Toggle Moderno */}
              <button
                onClick={toggleInscripciones}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none shadow-inner ${
                  inscripcionesAbiertas ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    inscripcionesAbiertas ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Seguridad y Contraseña */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
              <Lock className="w-6 h-6 mr-3 text-[#7a2031]" />
              Seguridad y Contraseña
            </h3>
            
            {mensaje.texto && (
              <div className={`p-4 rounded-xl mb-6 flex items-center text-sm font-bold border ${
                mensaje.tipo === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                {mensaje.tipo === 'error' ? <AlertCircle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                {mensaje.texto}
              </div>
            )}

            <form onSubmit={manejarCambioPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  placeholder="Ingrese su contraseña actual"
                  required
                  value={passwords.actual}
                  onChange={(e) => setPasswords({...passwords, actual: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#7a2031] outline-none transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    value={passwords.nueva}
                    onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#7a2031] outline-none transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Confirmar Nueva
                  </label>
                  <input
                    type="password"
                    placeholder="Repita la nueva contraseña"
                    required
                    value={passwords.confirmar}
                    onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#7a2031] outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={cargando}
                  className="bg-[#7a2031] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#5a1523] transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {cargando ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  Actualizar Credenciales
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}