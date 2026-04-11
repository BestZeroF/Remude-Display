import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Zap } from 'lucide-react';

export default function VistaLogin({ cambiarVista, setUsuario }) {
  const [datosFormulario, setDatosFormulario] = useState({ correo: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    let nuevosErrores = {};
    if (!datosFormulario.correo) nuevosErrores.correo = 'El correo electrónico es obligatorio';
    if (!datosFormulario.contrasena) nuevosErrores.contrasena = 'La contraseña es obligatoria';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setCargando(true);
    
    // --- CONEXIÓN REAL AL BACKEND ---
    const URL_LOGIN = 'http://localhost:3000/api/auth/login'; 

    try {
      const respuesta = await fetch(URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: datosFormulario.correo,
          password: datosFormulario.contrasena
        })
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem('token_remude', data.token);
        setUsuario(data.usuario); 
        cambiarVista('panelEntrenador');
      } else {
        setErrores({ general: data.message || 'Error al iniciar sesión' });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setErrores({ general: 'Error al conectar con el servidor. Revisa que el backend esté encendido.' });
    } finally {
      setCargando(false);
    }
  };

  // --- FUNCIÓN DEL BOTÓN TRAMPA ---
  const entrarModoPrueba = () => {
    localStorage.setItem('token_remude', 'MODO_PRUEBA');
    setUsuario({ nombre: 'Victoria', apellidos: 'Piña', correo: 'admin@remude.com' });
    cambiarVista('panelEntrenador');
  };

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in mt-2 mb-4">
      <button onClick={() => cambiarVista('inicio')} className="text-gray-400 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-2">Acceso</h2>
      <p className="text-gray-500 mb-6 font-light">Ingresa tus credenciales para continuar</p>

      {errores.general && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-bold text-center">
          {errores.general}
        </div>
      )}

      <form onSubmit={manejarEnvio} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Correo electrónico</label>
          <div className="relative shadow-sm rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 ${errores.correo ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="email" placeholder="tu@correo.com"
              className={`block w-full pl-12 pr-4 py-3 bg-white rounded-xl outline-none transition-all text-gray-800 ${errores.correo ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#7a2031]'}`}
              value={datosFormulario.correo}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, correo: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contraseña</label>
          <div className="relative shadow-sm rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 ${errores.contrasena ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="password" placeholder="••••••••"
              className={`block w-full pl-12 pr-4 py-3 bg-white rounded-xl outline-none transition-all text-gray-800 ${errores.contrasena ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#7a2031]'}`}
              value={datosFormulario.contrasena}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, contrasena: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end mt-3">
            <button type="button" className="text-xs font-bold text-gray-500 hover:text-[#7a2031] transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={cargando}
          className={`w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg font-bold text-white transition-all transform ${cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7a2031] hover:bg-[#5a1523] hover:scale-105'} mt-8`}
        >
          {cargando ? 'Procesando...' : 'Iniciar sesión'}
        </button>
      </form>

      {/* BOTÓN TRAMPA PARA SALTAR EL LOGIN */}
      <button 
        onClick={entrarModoPrueba}
        className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors mt-3 border border-gray-200"
      >
        <Zap className="w-4 h-4 mr-2 text-yellow-500" />
        Entrar sin conexión (Modo Prueba)
      </button>

      <div className="mt-6 text-center border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button 
            onClick={() => cambiarVista('registro')}
            className="font-bold text-[#c2a649] hover:text-[#a0883b] transition-colors"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
