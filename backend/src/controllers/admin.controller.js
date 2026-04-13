const db = require('../config/db');

const adminController = {};

// ==========================================
// [NUEVO] GET /api/admin/dashboard
// Para alimentar los KPIs y la tabla rápida de la vista principal
// ==========================================
adminController.getDashboardData = async (req, res) => {
    try {
        // 1. Totales principales
        const resAtletas = await db.query('SELECT COUNT(*) FROM atletas');
        const resEntrenadores = await db.query('SELECT COUNT(*) FROM entrenadores');
        
        // Basado en Regla de Oro #4: 2 = En Revisión, 4 = Rechazado
        const resRevision = await db.query('SELECT COUNT(*) FROM atletas WHERE id_estatus = 2');
        const resRechazados = await db.query('SELECT COUNT(*) FROM atletas WHERE id_estatus = 4');

        // 2. Obtener los últimos registros (Actividad Reciente)
        // Usamos una versión simplificada de tu query de usuarios para el dashboard
        const queryRecientes = `
            SELECT 
                a.id_atleta as id, 
                u.nombre || ' ' || u.primer_apellido as nombre, 
                a.curp, 
                'General' as disciplina, 
                ce.nombre_estatus as estatus,
                ue.nombre as entrenador
            FROM atletas a
            INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
            INNER JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            LEFT JOIN entrenadores ent_asignado ON a.id_entrenador = ent_asignado.id_entrenador
            LEFT JOIN usuarios ue ON ent_asignado.id_usuario = ue.id_usuario
            ORDER BY a.id_atleta DESC
            LIMIT 5;
        `;
        const { rows: recientes } = await db.query(queryRecientes);

        res.json({
            totales: {
                atletas: parseInt(resAtletas.rows[0].count),
                entrenadores: parseInt(resEntrenadores.rows[0].count),
                enRevision: parseInt(resRevision.rows[0].count),
                rechazados: parseInt(resRechazados.rows[0].count)
            },
            recientes
        });
    } catch (error) {
        console.error('Error en dashboard admin:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================
// GET /api/admin/usuarios -> Ver absolutamente a todos
// ==========================================
adminController.obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id_usuario, 
                u.correo, 
                u.estado_cuenta, 
                cr.nombre_rol,
                u.nombre,
                u.primer_apellido,
                u.segundo_apellido,
                COALESCE(a.curp, e.curp) as curp,
                ce.nombre_estatus AS estatus_atleta,
                ue.nombre AS nombre_entrenador,
                ue.primer_apellido AS apellido_entrenador
            FROM usuarios u
            INNER JOIN catalogo_roles cr ON u.id_rol = cr.id_rol
            LEFT JOIN atletas a ON u.id_usuario = a.id_usuario
            LEFT JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            LEFT JOIN entrenadores e ON u.id_usuario = e.id_usuario
            LEFT JOIN administrativos ad ON u.id_usuario = ad.id_usuario
            LEFT JOIN entrenadores ent_asignado ON a.id_entrenador = ent_asignado.id_entrenador
            LEFT JOIN usuarios ue ON ent_asignado.id_usuario = ue.id_usuario
            ORDER BY u.id_usuario DESC;
        `;
        const { rows } = await db.query(query);
        res.json({ usuarios: rows });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================
// PUT /api/admin/atletas/:id_atleta/reasignar
// ==========================================
adminController.reasignarAtleta = async (req, res) => {
    try {
        const { id_atleta } = req.params;
        const { nuevo_id_entrenador } = req.body;

        if (!nuevo_id_entrenador) {
            return res.status(400).json({ message: 'Se requiere el ID del nuevo entrenador.' });
        }

        const query = `
            UPDATE atletas 
            SET id_entrenador = $1 
            WHERE id_atleta = $2 
            RETURNING id_atleta, id_entrenador
        `;
        const { rows } = await db.query(query, [nuevo_id_entrenador, id_atleta]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Atleta no encontrado.' });
        }

        res.json({ message: 'Atleta reasignado exitosamente.', data: rows[0] });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ message: 'El entrenador asignado no existe.' });
        }
        console.error('Error al reasignar:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================
// PUT /api/admin/dictamen/:id_usuario
// ==========================================
adminController.dictaminarPerfil = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { id_estatus } = req.body; 

        if (!id_estatus || isNaN(id_estatus)) {
            return res.status(400).json({ message: 'Se requiere un id_estatus válido (numérico).' });
        }

        const query = `
            UPDATE atletas 
            SET id_estatus = $1 
            WHERE id_usuario = $2 
            RETURNING id_atleta, id_estatus
        `;
        const { rows } = await db.query(query, [id_estatus, id_usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Atleta no encontrado.' });
        }

        res.json({ message: `Estatus del perfil actualizado correctamente`, data: rows[0] });
    } catch (error) {
        console.error('Error al dictaminar:', error);
        if (error.code === '23503') return res.status(400).json({ message: 'El estatus proporcionado no existe en el catálogo.' });
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================
// DELETE /api/admin/usuarios/:id_usuario
// ==========================================
adminController.eliminarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const query = `
            UPDATE usuarios 
            SET estado_cuenta = false 
            WHERE id_usuario = $1 
            RETURNING id_usuario, correo
        `;
        const { rows } = await db.query(query, [id_usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Si es atleta, lo marcamos inactivo (id_estatus = 2 o el que corresponda a Inactivo en tu BD)
        await db.query(`UPDATE atletas SET id_estatus = 2 WHERE id_usuario = $1`, [id_usuario]);

        res.json({ message: 'Usuario dado de baja exitosamente (Soft Delete).', data: rows[0] });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = adminController;