import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, User } from 'lucide-react';

export default function VistaRegistro({ cambiarVista }) {
  const [datosFormulario, setDatosFormulario] = useState({ 
    nombre: '', 
    apellidos: '', 
    correo: '', 
    contrasena: '',
    confirmarContrasena: '' 
  });
  const [errores, setErrores] = useState({});

  const manejarEnvio = (e) => {
    e.preventDefault();
    let nuevosErrores = {};
    
    if (!datosFormulario.nombre) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!datosFormulario.apellidos) nuevosErrores.apellidos = 'Los apellidos son obligatorios';
    if (!datosFormulario.correo) nuevosErrores.correo = 'El correo es obligatorio';
    if (!datosFormulario.contrasena) nuevosErrores.contrasena = 'La contraseña es obligatoria';
    
    if (!datosFormulario.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Debes confirmar tu contraseña';
    } else if (datosFormulario.contrasena !== datosFormulario.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    console.log('Datos listos para la API:', datosFormulario);
    alert('Frontend listo. Falta conectar con el Backend para guardar en BD.');
    cambiarVista('login');
  };

  const manejarCambio = (campo, valor) => {
    setDatosFormulario({ ...datosFormulario, [campo]: valor });
    if (errores[campo]) setErrores({ ...errores, [campo]: null });
  };

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in mt-2 mb-4">
      <button onClick={() => cambiarVista('inicio')} className="text-gray-400 hover:text-gray-900 mb-4 transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-1">Registro</h2>
      <p className="text-gray-500 mb-6 font-light text-sm">Crea tu cuenta de entrenador</p>

      <form onSubmit={manejarEnvio} className="space-y-3" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre</label>
            <div className="relative shadow-sm rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className={`h-4 w-4 ${errores.nombre ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="text" placeholder="Juan"
                className={`block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.nombre ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
                value={datosFormulario.nombre}
                onChange={(e) => manejarCambio('nombre', e.target.value)}
              />
            </div>
            {errores.nombre && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.nombre}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Apellidos</label>
            <div className="relative shadow-sm rounded-xl">
              <input
                type="text" placeholder="Pérez"
                className={`block w-full px-4 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.apellidos ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
                value={datosFormulario.apellidos}
                onChange={(e) => manejarCambio('apellidos', e.target.value)}
              />
            </div>
            {errores.apellidos && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.apellidos}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Correo electrónico</label>
          <div className="relative shadow-sm rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={`h-4 w-4 ${errores.correo ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="email" placeholder="tu@correo.com"
              className={`block w-full pl-11 pr-4 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.correo ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
              value={datosFormulario.correo}
              onChange={(e) => manejarCambio('correo', e.target.value)}
            />
          </div>
          {errores.correo && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.correo}</p>}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Contraseña</label>
            <div className="relative shadow-sm rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`h-4 w-4 ${errores.contrasena ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="password" placeholder="••••••••"
                className={`block w-full pl-11 pr-4 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.contrasena ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
                value={datosFormulario.contrasena}
                onChange={(e) => manejarCambio('contrasena', e.target.value)}
              />
            </div>
            {errores.contrasena && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.contrasena}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Confirmar contraseña</label>
            <div className="relative shadow-sm rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`h-4 w-4 ${errores.confirmarContrasena ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="password" placeholder="••••••••"
                className={`block w-full pl-11 pr-4 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.confirmarContrasena ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
                value={datosFormulario.confirmarContrasena}
                onChange={(e) => manejarCambio('confirmarContrasena', e.target.value)}
              />
            </div>
            {errores.confirmarContrasena && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.confirmarContrasena}</p>}
          </div>
        </div>

        <button type="submit" className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg font-bold text-white bg-[#c2a649] hover:bg-[#a0883b] transition-all transform hover:scale-105 mt-4">
          Crear cuenta
        </button>
      </form>

      <div className="mt-6 text-center border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <button 
            onClick={() => cambiarVista('login')}
            className="font-bold text-[#7a2031] hover:text-[#5a1523] transition-colors"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}
