const db = require('../config/db');

const adminController = {};

// GET /api/admin/usuarios -> Ver absolutamente a todos
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
                a.estado_validacion,
                ue.nombre AS nombre_entrenador,
                ue.primer_apellido AS apellido_entrenador
            FROM usuarios u
            INNER JOIN catalogo_roles cr ON u.id_rol = cr.id_rol
            LEFT JOIN atletas a ON u.id_usuario = a.id_usuario
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

// PUT /api/admin/atletas/:id_atleta/reasignar
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
        if (error.code === '23503') { // Llave foránea (El entrenador no existe)
            return res.status(400).json({ message: 'El entrenador asignado no existe.' });
        }
        console.error('Error al reasignar:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// PUT /api/admin/dictamen/:id_usuario -> Aprobar o devolver
adminController.dictaminarPerfil = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { dictamen } = req.body; // 'APROBADO' o 'CORRECCION'

        if (!['APROBADO', 'CORRECCION'].includes(dictamen)) {
            return res.status(400).json({ message: 'Dictamen inválido. Use APROBADO o CORRECCION.' });
        }

        const query = `
            UPDATE atletas 
            SET estado_validacion = $1 
            WHERE id_usuario = $2 
            RETURNING id_atleta, estado_validacion
        `;
        const { rows } = await db.query(query, [dictamen, id_usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Atleta no encontrado.' });
        }

        res.json({ message: `Perfil del atleta marcado como: ${dictamen}`, data: rows[0] });
    } catch (error) {
        console.error('Error al dictaminar:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// DELETE /api/admin/usuarios/:id_usuario -> Baja lógica de cualquier usuario
adminController.eliminarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        // Desactivamos la cuenta a nivel global para que no pueda loguearse
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

        // Adicionalmente, si es atleta, lo marcamos inactivo (id_estatus = 2)
        await db.query(`UPDATE atletas SET id_estatus = 2 WHERE id_usuario = $1`, [id_usuario]);

        res.json({ message: 'Usuario dado de baja exitosamente (Soft Delete).', data: rows[0] });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = adminController;