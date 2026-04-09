const db = require('../config/db');

const entrenadoresController = {};

// GET /api/entrenadores/dashboard (Reconstruido con esquema exacto)
entrenadoresController.obtenerDashboard = async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;

        // 1. Obtener info del entrenador
        const queryEntrenador = `
            SELECT e.id_entrenador, e.titulo_logro, e.especialidad, u.nombre, u.apellidos
            FROM entrenadores e
            INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
            WHERE e.id_usuario = $1
        `;
        const { rows: entrenadorRows } = await db.query(queryEntrenador, [id_usuario]);
        
        if (entrenadorRows.length === 0) {
            return res.status(404).json({ message: 'Perfil de entrenador no encontrado.' });
        }
        const entrenador = entrenadorRows[0];

        // 2. Obtener notificaciones no leídas
        const queryNotif = `
            SELECT id_notificaciones, titulo, mensaje, fecha_creacion
            FROM notificaciones 
            WHERE id_usuario = $1 AND leido = false
            ORDER BY fecha_creacion DESC LIMIT 5
        `;
        const { rows: notificaciones } = await db.query(queryNotif, [id_usuario]);

        // 3. Obtener clasificación de atletas por estatus (Activos, Inactivos, etc.)
        const queryAtletas = `
            SELECT ce.nombre_estatus, COUNT(a.id_atleta) as total
            FROM atletas a
            INNER JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            WHERE a.id_entrenador = $1
            GROUP BY ce.nombre_estatus
        `;
        const { rows: clasificacionAtletas } = await db.query(queryAtletas, [entrenador.id_entrenador]);

        res.json({
            entrenador,
            notificaciones,
            resumen_atletas: clasificacionAtletas
        });

    } catch (error) {
        console.error('Error en dashboard de entrenador:', error);
        res.status(500).json({ message: 'Error interno del servidor al cargar el dashboard.' });
    }
};

// GET /api/entrenadores (Listar todos - Útil para el Administrador)
entrenadoresController.listarEntrenadores = async (req, res) => {
    try {
        const query = `
            SELECT e.id_entrenador, e.especialidad, e.titulo_logro, u.nombre, u.apellidos, u.correo, u.estado_cuenta
            FROM entrenadores e
            INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
            ORDER BY u.apellidos ASC
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error al listar entrenadores:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// GET /api/entrenadores/:id (Perfil específico)
entrenadoresController.obtenerEntrenadorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT e.id_entrenador, e.titulo_logro, e.fecha_logro, e.descripcion, e.especialidad, e.curp,
                   u.nombre, u.apellidos, u.correo, u.estado_cuenta
            FROM entrenadores e
            INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
            WHERE e.id_entrenador = $1
        `;
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Entrenador no encontrado.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener entrenador por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// PUT /api/entrenadores/:id (Actualizar datos del entrenador)
entrenadoresController.actualizarEntrenador = async (req, res) => {
    try {
        const { id } = req.params; // id_entrenador
        const id_usuario_token = req.user.id_usuario;
        const id_rol = req.user.id_rol;
        const { nombre, apellidos, titulo_logro, descripcion, especialidad } = req.body;

        // Seguridad: Validar que el usuario que hace la petición sea el dueño del perfil o un Admin (rol 3)
        const checkQuery = 'SELECT id_usuario FROM entrenadores WHERE id_entrenador = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Entrenador no encontrado.' });
        }

        if (id_rol !== 3 && checkResult.rows[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ message: 'No tienes permisos para modificar este perfil.' });
        }

        // Actualizamos las 2 tablas usando una CTE para asegurar consistencia
        const query = `
            WITH actualizacion_usuario AS (
                UPDATE usuarios
                SET nombre = $1, apellidos = $2
                WHERE id_usuario = (SELECT id_usuario FROM entrenadores WHERE id_entrenador = $3)
                RETURNING id_usuario, nombre, apellidos
            )
            UPDATE entrenadores
            SET titulo_logro = $4, descripcion = $5, especialidad = $6
            WHERE id_entrenador = $3
            RETURNING id_entrenador, titulo_logro, descripcion, especialidad,
                      (SELECT nombre FROM actualizacion_usuario),
                      (SELECT apellidos FROM actualizacion_usuario);
        `;
        const values = [nombre, apellidos, id, titulo_logro, descripcion, especialidad];
        
        const { rows } = await db.query(query, values);

        res.json({
            message: 'Perfil de entrenador actualizado exitosamente.',
            entrenador: rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar entrenador:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar.' });
    }
};

// GET /api/entrenadores/:id/atletas (Lista de atletas del grupo del entrenador)
entrenadoresController.obtenerAtletasDeEntrenador = async (req, res) => {
    try {
        const { id } = req.params; // id_entrenador
        const id_usuario_token = req.user.id_usuario;
        const id_rol = req.user.id_rol;

        // Seguridad
        const checkQuery = 'SELECT id_usuario FROM entrenadores WHERE id_entrenador = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Entrenador no encontrado.' });
        }

        if (id_rol !== 3 && checkResult.rows[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ message: 'No tienes permisos para ver los atletas de este grupo.' });
        }

        // Obtener la lista detallada de atletas
        const query = `
            SELECT a.id_atleta, a.curp, a.fecha_nacimiento, 
                   u.nombre, u.apellidos, u.correo, u.estado_cuenta,
                   ce.nombre_estatus, ct.nomenclatura AS talla
            FROM atletas a
            INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
            INNER JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            INNER JOIN catalogo_tallas ct ON a.id_talla = ct.id_talla
            WHERE a.id_entrenador = $1
            ORDER BY u.apellidos ASC
        `;
        
        const { rows } = await db.query(query, [id]);
        
        res.json(rows);

    } catch (error) {
        console.error('Error al obtener atletas del entrenador:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = entrenadoresController;