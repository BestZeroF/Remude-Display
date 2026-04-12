import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, User, CreditCard } from 'lucide-react';

export default function VistaRegistro({ cambiarVista }) {
  const [datosFormulario, setDatosFormulario] = useState({ 
    nombre: '', 
    apellidoPaterno: '', 
    apellidoMaterno: '', 
    correo: '', 
    curp: '', 
    contrasena: '',
    confirmarContrasena: '' 
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    let nuevosErrores = {};
    
    if (!datosFormulario.nombre) nuevosErrores.nombre = 'Obligatorio';
    if (!datosFormulario.apellidoPaterno) nuevosErrores.apellidoPaterno = 'Obligatorio';
    if (!datosFormulario.correo) nuevosErrores.correo = 'Obligatorio';
    if (!datosFormulario.curp) nuevosErrores.curp = 'Obligatorio';
    if (!datosFormulario.contrasena) nuevosErrores.contrasena = 'Obligatorio';
    
    if (!datosFormulario.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Confirmar';
    } else if (datosFormulario.contrasena !== datosFormulario.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'No coinciden';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setCargando(true);
    setErrores({});

    try {
      // 1. Validar CURP (Opcional, asume que el backend tiene la ruta)
      const URL_VALIDAR = `http://localhost:3000/api/atletas/validar-curp/${datosFormulario.curp}`;
      try {
        const resValidacion = await fetch(URL_VALIDAR);
        if (resValidacion.ok) {
          const dataValidacion = await resValidacion.json();
          if (dataValidacion.existe) {
            setErrores({ curp: 'Esta CURP ya se encuentra registrada' });
            setCargando(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Endpoint de validación no disponible, procediendo al registro...', error);
      }

      // 2. Ejecutar Registro de Entrenador (API v2)
      const URL_REGISTRO = 'http://localhost:3000/api/auth/registro/entrenador';
      const respuesta = await fetch(URL_REGISTRO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: datosFormulario.nombre,
          primer_apellido: datosFormulario.apellidoPaterno,
          segundo_apellido: datosFormulario.apellidoMaterno,
          correo: datosFormulario.correo,
          curp: datosFormulario.curp,
          password: datosFormulario.contrasena,
          especialidad: "Por definir",
          // Se envía el id_rol explicitamente para evitar errores 500 en bases de datos con constraints estrictas
          id_rol: 2 
        })
      });

      const data = await respuesta.json();

      if (respuesta.ok || respuesta.status === 201) {
        alert('Cuenta creada exitosamente. Por favor, inicia sesión.');
        cambiarVista('login');
      } else {
        // Muestra detalles específicos del error si la BD los devuelve para mejor depuración
        const errorMsg = data.detail || data.error || data.message || 'Hubo un error interno del servidor al crear la cuenta.';
        setErrores({ general: errorMsg });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrores({ general: 'Error conectando con el servidor. Verifica tu conexión.' });
    } finally {
      setCargando(false);
    }
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

      {errores.general && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-bold text-center wrap-break-word">
          {errores.general}
        </div>
      )}

      <form onSubmit={manejarEnvio} className="space-y-3" noValidate>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre(s)</label>
          <div className="relative shadow-sm rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className={`h-4 w-4 ${errores.nombre ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="text" placeholder="Ej. Juan Carlos"
              className={`block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.nombre ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
              value={datosFormulario.nombre}
              onChange={(e) => manejarCambio('nombre', e.target.value)}
            />
          </div>
          {errores.nombre && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.nombre}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Apellido Paterno</label>
            <div className="relative shadow-sm rounded-xl">
              <input
                type="text" placeholder="Pérez"
                className={`block w-full px-4 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.apellidoPaterno ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
                value={datosFormulario.apellidoPaterno}
                onChange={(e) => manejarCambio('apellidoPaterno', e.target.value)}
              />
            </div>
            {errores.apellidoPaterno && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.apellidoPaterno}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Apellido Materno</label>
            <div className="relative shadow-sm rounded-xl">
              <input
                type="text" placeholder="López"
                className={`block w-full px-4 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.apellidoMaterno ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
                value={datosFormulario.apellidoMaterno}
                onChange={(e) => manejarCambio('apellidoMaterno', e.target.value)}
              />
            </div>
            {errores.apellidoMaterno && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.apellidoMaterno}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">CURP</label>
          <div className="relative shadow-sm rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className={`h-4 w-4 ${errores.curp ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="text" placeholder="18 Caracteres" maxLength="18"
              className={`block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 uppercase font-mono ${errores.curp ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
              value={datosFormulario.curp}
              onChange={(e) => manejarCambio('curp', e.target.value.toUpperCase())}
            />
          </div>
          {errores.curp && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.curp}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Correo electrónico</label>
          <div className="relative shadow-sm rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`h-4 w-4 ${errores.correo ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="email" placeholder="tu@correo.com"
              className={`block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.correo ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
              value={datosFormulario.correo}
              onChange={(e) => manejarCambio('correo', e.target.value)}
            />
          </div>
          {errores.correo && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.correo}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Contraseña</label>
            <div className="relative shadow-sm rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-4 w-4 ${errores.contrasena ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="password" placeholder="••••••••"
                className={`block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.contrasena ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
                value={datosFormulario.contrasena}
                onChange={(e) => manejarCambio('contrasena', e.target.value)}
              />
            </div>
            {errores.contrasena && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.contrasena}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Confirmar clave</label>
            <div className="relative shadow-sm rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-4 w-4 ${errores.confirmarContrasena ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="password" placeholder="••••••••"
                className={`block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl outline-none transition-all text-sm text-gray-800 ${errores.confirmarContrasena ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#c2a649]'}`}
                value={datosFormulario.confirmarContrasena}
                onChange={(e) => manejarCambio('confirmarContrasena', e.target.value)}
              />
            </div>
            {errores.confirmarContrasena && <p className="text-red-500 text-[10px] mt-1 font-bold">{errores.confirmarContrasena}</p>}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={cargando}
          className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg font-bold text-white transition-all transform ${cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c2a649] hover:bg-[#a0883b] hover:scale-105'} mt-4`}
        >
          {cargando ? 'Guardando...' : 'Crear cuenta'}
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
