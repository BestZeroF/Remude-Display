const db = require('../config/db');

const atletasController = {};

// Función auxiliar para verificar permisos (DRY)
const verificarPermisosAtleta = async (id_atleta_param, id_usuario_token, id_rol_token) => {
    const checkQuery = `
        SELECT a.id_usuario, a.id_entrenador, e.id_usuario AS id_usuario_entrenador
        FROM atletas a
        LEFT JOIN entrenadores e ON a.id_entrenador = e.id_entrenador
        WHERE a.id_atleta = $1
    `;
    const { rows } = await db.query(checkQuery, [id_atleta_param]);
    
    if (rows.length === 0) return { error: 'Atleta no encontrado.', status: 404 };
    
    const atleta = rows[0];
    
    // Admin (3) puede ver todo
    if (id_rol_token === 3) return { permitido: true };
    // El propio atleta (1) puede ver su perfil
    if (id_rol_token === 1 && atleta.id_usuario === id_usuario_token) return { permitido: true };
    // El entrenador (2) solo puede ver a los atletas asignados a él
    if (id_rol_token === 2 && atleta.id_usuario_entrenador === id_usuario_token) return { permitido: true };
    
    return { error: 'Acceso denegado. No tienes permisos sobre este atleta.', status: 403 };
};

// GET /api/atletas/:id (Perfil completo)
atletasController.obtenerAtletaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const query = `
            SELECT a.id_atleta, a.curp, a.fecha_nacimiento, 
                   u.nombre, u.apellidos, u.correo, u.estado_cuenta,
                   ce.nombre_estatus, ct.nomenclatura AS talla,
                   d.nombre_disciplina
            FROM atletas a
            INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
            INNER JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            INNER JOIN catalogo_tallas ct ON a.id_talla = ct.id_talla
            LEFT JOIN atleta_disciplina ad ON a.id_atleta = ad.id_atleta
            LEFT JOIN disciplinas d ON ad.id_disciplina = d.id_disciplina
            WHERE a.id_atleta = $1
        `;
        const { rows } = await db.query(query, [id]);

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener atleta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// PUT /api/atletas/:id (Actualizar info personal)
atletasController.actualizarAtleta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellidos, id_talla, fecha_nacimiento } = req.body;
        
        // Solo el mismo atleta o un admin deberían poder editar esta info personal básica
        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const query = `
            WITH actualizacion_usuario AS (
                UPDATE usuarios
                SET nombre = $1, apellidos = $2
                WHERE id_usuario = (SELECT id_usuario FROM atletas WHERE id_atleta = $3)
                RETURNING id_usuario, nombre, apellidos
            )
            UPDATE atletas
            SET id_talla = $4, fecha_nacimiento = $5
            WHERE id_atleta = $3
            RETURNING id_atleta, id_talla, fecha_nacimiento,
                      (SELECT nombre FROM actualizacion_usuario),
                      (SELECT apellidos FROM actualizacion_usuario);
        `;
        const values = [nombre, apellidos, id, id_talla, fecha_nacimiento];
        
        const { rows } = await db.query(query, values);

        res.json({
            message: 'Información del atleta actualizada exitosamente.',
            atleta: rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar atleta:', error);
        if (error.code === '23503') {
            return res.status(400).json({ message: 'La talla especificada no es válida.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar.' });
    }
};

// DELETE /api/atletas/:id (Soft delete: Dar de baja cambiando estatus)
atletasController.darDeBajaAtleta = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Solo un Administrador (3) o su Entrenador (2) pueden dar de baja
        if (req.user.id_rol === 1) {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
        }

        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        // Asumimos que el id_estatus = 2 corresponde a "Inactivo" en catalogo_estatus
        const ESTATUS_INACTIVO = 2; 

        const query = `
            UPDATE atletas
            SET id_estatus = $1
            WHERE id_atleta = $2
            RETURNING id_atleta, id_estatus
        `;
        const { rows } = await db.query(query, [ESTATUS_INACTIVO, id]);

        res.json({ 
            message: 'El atleta ha sido dado de baja exitosamente.',
            atleta: rows[0]
        });
    } catch (error) {
        console.error('Error al dar de baja atleta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// GET /api/atletas/:id/historial (Cargar historial deportivo)
atletasController.obtenerHistorial = async (req, res) => {
    try {
        const { id } = req.params;

        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const query = `
            SELECT id_historial, descripcion, fecha_evento
            FROM historial_deportivo
            WHERE id_atleta = $1
            ORDER BY fecha_evento DESC
        `;
        const { rows } = await db.query(query, [id]);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener historial deportivo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = atletasController;