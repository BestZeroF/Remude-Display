require('dotenv').config();
const db = require('./src/config/db'); // Ajusta la ruta si es necesario

const limpiarBaseDeDatos = async () => {
    try {
        console.warn('===========================================');
        console.warn('⚠️  INICIANDO VACIADO DE BASE DE DATOS  ⚠️');
        console.warn('===========================================');
        
        // TRUNCATE vacía las tablas sin borrar su estructura.
        // CASCADE fuerza el borrado de cualquier tabla que dependa de estas (atletas, entrenadores, perfiles, etc.)
        // IMPORTANTE: NO incluimos los catálogos (catalogo_roles, catalogo_estatus, etc.) 
        // para que la aplicación pueda seguir funcionando al crear nuevos usuarios.
        const query = `
            TRUNCATE TABLE 
                usuarios, 
                notificaciones,
                documentos,
                historial_deportivo,
                solicitudes_reasignacion,
                administrativos
            CASCADE;
        `;
        
        await db.query(query);
        
        console.log('✅ Base de datos limpiada exitosamente.');
        console.log('👉 Todas las cuentas, atletas, entrenadores y documentos han sido eliminados.');
        console.log('👉 Los catálogos (roles, disciplinas, etc.) se mantienen intactos.');
        
        // Cerramos la conexión y terminamos el proceso
        process.exit(0);
    } catch (error) {
        console.error('❌ Error catastrófico al limpiar la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar la función
limpiarBaseDeDatos();