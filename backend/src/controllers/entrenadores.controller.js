const db = require('../config/db');

// Obtener el dashboard resumen del entrenador
const getDashboardResumen = async (req, res) => {
    // Por ahora, simularemos que el usuario 1 está haciendo la petición
    // Cambiaremos esto a req.user.id_usuario cuando activemos el middleware
    const id_usuario = 1; 

    try {
        // 1. Obtener datos del usuario y del entrenador
        const entrenadorQuery = await db.query(`
            SELECT u.nombre, u.apellidos, e.id_entrenador, e.especialidad
            FROM usuarios u
            JOIN entrenadores e ON u.id_usuario = e.id_usuario
            WHERE u.id_usuario = $1
        `, [id_usuario]);

        if (entrenadorQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Perfil de entrenador no encontrado' });
        }

        const entrenadorInfo = entrenadorQuery.rows[0];
        const id_entrenador = entrenadorInfo.id_entrenador;

        // 2. Obtener notificaciones
        const notificacionesQuery = await db.query(`
            SELECT id_notificaciones AS id_notificacion, mensaje, leido
            FROM notificaciones
            WHERE id_usuario = $1
            ORDER BY fecha_creacion DESC
            LIMIT 10
        `, [id_usuario]);

        // 3. Obtener los atletas asociados a este entrenador
        const atletasQuery = await db.query(`
            SELECT a.id_atleta, u.nombre, u.apellidos, ce.nombre_estatus
            FROM atletas a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
            JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            WHERE a.id_entrenador = $1
        `, [id_entrenador]);

        // 4. Clasificar a los atletas
        const atletasClasificados = {
            pendientes: [],
            en_revision: [],
            validados: [],
            rechazados: []
        };

        let totalAtletas = 0;

        atletasQuery.rows.forEach(row => {
            const nombreCompleto = `${row.nombre} ${row.apellidos}`.trim();
            const atletaFormat = { id_atleta: row.id_atleta, nombre: nombreCompleto };
            const estatusStr = row.nombre_estatus.toLowerCase();

            if (estatusStr.includes('pendiente')) {
                atletasClasificados.pendientes.push(atletaFormat);
            } else if (estatusStr.includes('revisión') || estatusStr.includes('revision')) {
                atletasClasificados.en_revision.push(atletaFormat);
            } else if (estatusStr.includes('validado') || estatusStr.includes('aprobado')) {
                atletasClasificados.validados.push(atletaFormat);
            } else if (estatusStr.includes('rechazado')) {
                atletasClasificados.rechazados.push(atletaFormat);
            } else {
                atletasClasificados.pendientes.push(atletaFormat); 
            }
            totalAtletas++;
        });

        // 5. Retornar el JSON
        res.status(200).json({
            usuario: {
                nombre: `${entrenadorInfo.nombre} ${entrenadorInfo.apellidos}`.trim(),
                disciplina: entrenadorInfo.especialidad
            },
            notificaciones: notificacionesQuery.rows,
            atletas: atletasClasificados,
            totalAtletas: totalAtletas
        });

    } catch (error) {
        console.error('Error al obtener el dashboard del entrenador:', error);
        res.status(500).json({ error: 'Error interno del servidor al cargar el dashboard' });
    }
};

module.exports = {
    getDashboardResumen
};