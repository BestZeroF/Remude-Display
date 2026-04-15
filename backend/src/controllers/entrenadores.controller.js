const db = require('../config/db');

const entrenadoresController = {};

// GET /api/entrenadores/dashboard
entrenadoresController.obtenerDashboard = async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;

        // 1. Obtener info del entrenador 
        const queryEntrenador = `
            SELECT e.id_entrenador, e.titulo_logro, e.especialidad, u.nombre, u.primer_apellido, u.segundo_apellido
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

        // 3. Obtener clasificación de atletas por estatus
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

// ==========================================
// NUEVO V6: GET /api/entrenadores/mis-atletas
// ==========================================
entrenadoresController.obtenerMisAtletas = async (req, res) => {
    try {
        const id_usuario_token = req.user.id_usuario;
        const { buscar, estatus, disciplina } = req.query; 

        // 1. Obtener el id_entrenador asociado a la cuenta que hace la petición
        const queryEntrenador = 'SELECT id_entrenador FROM entrenadores WHERE id_usuario = $1';
        const { rows: entrenadorRows } = await db.query(queryEntrenador, [id_usuario_token]);

        if (entrenadorRows.length === 0) {
            return res.status(404).json({ message: 'No se encontró el perfil de entrenador.' });
        }
        const id_entrenador = entrenadorRows[0].id_entrenador;

        // 2. Construir la consulta dinámica (Añadido u.id_usuario)
        let query = `
            SELECT 
                u.id_usuario,
                a.id_atleta, 
                CONCAT(u.nombre, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, '')) AS nombre_completo, 
                a.curp, 
                COALESCE(d.nombre_disciplina, 'Sin asignar') AS disciplina, 
                ce.nombre_estatus AS estatus_expediente,
                (
                    CASE WHEN pp.id_usuario IS NOT NULL THEN 25 ELSE 0 END +
                    CASE WHEN dom.id_usuario IS NOT NULL THEN 25 ELSE 0 END +
                    CASE WHEN pm.id_usuario IS NOT NULL THEN 25 ELSE 0 END +
                    CASE WHEN da.id_usuario IS NOT NULL THEN 25 ELSE 0 END
                ) AS progreso_ficha,
                LEAST((SELECT COUNT(*) FROM documentos doc WHERE doc.id_usuario = u.id_usuario) * 25, 100) AS progreso_documentos
            FROM atletas a
            INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
            INNER JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            LEFT JOIN atleta_disciplina ad ON a.id_atleta = ad.id_atleta
            LEFT JOIN disciplinas d ON ad.id_disciplina = d.id_disciplina
            LEFT JOIN perfiles_personales pp ON u.id_usuario = pp.id_usuario
            LEFT JOIN domicilios dom ON u.id_usuario = dom.id_usuario
            LEFT JOIN perfiles_medicos pm ON u.id_usuario = pm.id_usuario
            LEFT JOIN detalles_atletas da ON u.id_usuario = da.id_usuario
            WHERE a.id_entrenador = $1
        `;

        const values = [id_entrenador];
        let paramIndex = 2; 

        // 3. Aplicar Filtros (si existen)
        if (buscar) {
            query += ` AND (u.nombre ILIKE $${paramIndex} OR u.primer_apellido ILIKE $${paramIndex} OR a.curp ILIKE $${paramIndex})`;
            values.push(`%${buscar}%`);
            paramIndex++;
        }

        if (estatus) {
            query += ` AND ce.nombre_estatus ILIKE $${paramIndex}`;
            values.push(`%${estatus}%`);
            paramIndex++;
        }

        if (disciplina) {
            query += ` AND d.nombre_disciplina ILIKE $${paramIndex}`;
            values.push(`%${disciplina}%`);
            paramIndex++;
        }

        query += ` ORDER BY u.primer_apellido ASC`;

        // 4. Ejecutar consulta
        const { rows } = await db.query(query, values);
        
        // 5. Formatear resultados (Añadido id_usuario al mapeo)
        const resultadoFormateado = rows.map(row => ({
            id_usuario: row.id_usuario,
            id_atleta: row.id_atleta,
            nombre_completo: row.nombre_completo.trim().replace(/\s+/g, ' '),
            curp: row.curp,
            disciplina: row.disciplina,
            estatus_expediente: row.estatus_expediente,
            progreso_ficha: parseInt(row.progreso_ficha),
            progreso_documentos: parseInt(row.progreso_documentos)
        }));

        res.json(resultadoFormateado);

    } catch (error) {
        console.error('Error al obtener mis atletas:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// GET /api/entrenadores (Listar todos - Útil para el Administrador)
entrenadoresController.listarEntrenadores = async (req, res) => {
    try {
        const query = `
            SELECT e.id_entrenador, e.especialidad, e.titulo_logro, u.id_usuario, u.nombre, u.primer_apellido, u.segundo_apellido, u.correo, u.estado_cuenta
            FROM entrenadores e
            INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
            ORDER BY u.primer_apellido ASC
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
                   u.id_usuario, u.nombre, u.primer_apellido, u.segundo_apellido, u.correo, u.estado_cuenta
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
        const { id } = req.params; 
        const id_usuario_token = req.user.id_usuario;
        const id_rol = req.user.id_rol;
        const { nombre, primer_apellido, segundo_apellido, titulo_logro, descripcion, especialidad } = req.body;

        const checkQuery = 'SELECT id_usuario FROM entrenadores WHERE id_entrenador = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Entrenador no encontrado.' });
        }

        if (id_rol !== 3 && checkResult.rows[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ message: 'No tienes permisos para modificar este perfil.' });
        }

        const query = `
            WITH actualizacion_usuario AS (
                UPDATE usuarios
                SET nombre = COALESCE($1, nombre),
                    primer_apellido = COALESCE($2, primer_apellido),
                    segundo_apellido = COALESCE($3, segundo_apellido)
                WHERE id_usuario = (SELECT id_usuario FROM entrenadores WHERE id_entrenador = $4)
                RETURNING id_usuario, nombre, primer_apellido, segundo_apellido
            )
            UPDATE entrenadores
            SET titulo_logro = COALESCE($5, titulo_logro), 
                descripcion = COALESCE($6, descripcion), 
                especialidad = COALESCE($7, especialidad)
            WHERE id_entrenador = $4
            RETURNING id_entrenador, titulo_logro, descripcion, especialidad,
                      (SELECT nombre FROM actualizacion_usuario),
                      (SELECT primer_apellido FROM actualizacion_usuario),
                      (SELECT segundo_apellido FROM actualizacion_usuario);
        `;
        const values = [nombre, primer_apellido, segundo_apellido, id, titulo_logro, descripcion, especialidad];
        
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
        const { id } = req.params; 
        const id_usuario_token = req.user.id_usuario;
        const id_rol = req.user.id_rol;

        const checkQuery = 'SELECT id_usuario FROM entrenadores WHERE id_entrenador = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Entrenador no encontrado.' });
        }

        if (id_rol !== 3 && checkResult.rows[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ message: 'No tienes permisos para ver los atletas de este grupo.' });
        }

        // Añadido u.id_usuario aquí también por consistencia
        const query = `
            SELECT a.id_atleta, a.curp, a.fecha_nacimiento, 
                   u.id_usuario, u.nombre, u.primer_apellido, u.segundo_apellido, u.correo, u.estado_cuenta,
                   ce.nombre_estatus, tc.nomenclatura AS talla_camisa
            FROM atletas a
            INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
            INNER JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            LEFT JOIN detalles_atletas da ON u.id_usuario = da.id_usuario
            LEFT JOIN catalogo_tallas tc ON da.id_talla_camisa = tc.id_talla
            WHERE a.id_entrenador = $1
            ORDER BY u.primer_apellido ASC
        `;
        
        const { rows } = await db.query(query, [id]);
        
        res.json(rows);

    } catch (error) {
        console.error('Error al obtener atletas del entrenador:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = entrenadoresController;