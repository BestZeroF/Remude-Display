const db = require('../config/db');

const documentosController = {};

// POST /api/documentos
documentosController.subirDocumento = async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;
        const { id_tipodoc, fecha_vencimiento } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No se proporcionó ningún archivo adjunto.' });
        }

        const ruta_archivo = req.file.path;
        // Asumimos que "1" en catalogo_estatus es "Pendiente de Revisión"
        const id_estatus = 1; 

        const query = `
            INSERT INTO documentos (id_usuario, id_tipodoc, id_estatus, ruta_archivo, fecha_vencimiento, fecha_subida)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        // Si no envían fecha de vencimiento (ej. acta de nacimiento), se guarda como null
        const values = [id_usuario, id_tipodoc, id_estatus, ruta_archivo, fecha_vencimiento || null];
        
        const { rows } = await db.query(query, values);

        res.status(201).json({
            message: 'Documento subido exitosamente y en espera de revisión.',
            documento: rows[0]
        });
    } catch (error) {
        console.error('Error al subir documento:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el archivo.' });
    }
};

// GET /api/documentos/usuario/:id_usuario
documentosController.obtenerDocumentosUsuario = async (req, res) => {
    try {
        const id_usuario_param = req.params.id_usuario;
        const id_usuario_req = req.user.id_usuario;
        const id_rol = req.user.id_rol;

        // Seguridad: Un Atleta (rol 1) solo puede ver sus propios documentos.
        if (id_rol === 1 && parseInt(id_usuario_param) !== id_usuario_req) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para ver estos documentos.' });
        }

        const query = `
            SELECT d.id_documento, d.ruta_archivo, d.motivo_rechazo, d.fecha_subida, d.fecha_vencimiento,
                   td.nombre_tipo, e.nombre_estatus
            FROM documentos d
            INNER JOIN catalogo_tiposdocumento td ON d.id_tipodoc = td.id_tipodoc
            INNER JOIN catalogo_estatus e ON d.id_estatus = e.id_estatus
            WHERE d.id_usuario = $1
            ORDER BY d.fecha_subida DESC
        `;
        const { rows } = await db.query(query, [id_usuario_param]);
        
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener documentos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// PUT /api/documentos/:id_documento/revision
documentosController.revisarDocumento = async (req, res) => {
    try {
        const { id_documento } = req.params;
        const { id_estatus, motivo_rechazo } = req.body;
        const id_rol = req.user.id_rol;

        // Seguridad: Solo los Administradores (rol 3) pueden cambiar el estatus de un documento.
        if (id_rol !== 3) {
            return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador.' });
        }

        const query = `
            UPDATE documentos
            SET id_estatus = $1, motivo_rechazo = $2
            WHERE id_documento = $3
            RETURNING *
        `;
        const values = [id_estatus, motivo_rechazo || null, id_documento];
        
        const { rows } = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'El documento especificado no existe.' });
        }

        res.json({
            message: 'Estatus del documento actualizado exitosamente.',
            documento: rows[0]
        });
    } catch (error) {
        console.error('Error al revisar documento:', error);
        // Manejo de error de llave foránea (si mandan un id_estatus que no existe en catalogo_estatus)
        if (error.code === '23503') {
            return res.status(400).json({ message: 'El estatus proporcionado no es válido.' });
        }
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// GET /api/documentos/vencimientos
documentosController.obtenerVencimientos = async (req, res) => {
    try {
        const id_rol = req.user.id_rol;

        // Seguridad: Solo los Administradores (rol 3) ven los vencimientos globales.
        // (Podrías expandir esto para que el Entrenador vea los de sus atletas).
        if (id_rol !== 3) {
            return res.status(403).json({ message: 'Acceso denegado.' });
        }

        // Busca documentos que venzan en los próximos 30 días o que ya estén vencidos
        const query = `
            SELECT d.id_documento, d.fecha_vencimiento, u.nombre, u.apellidos, u.correo, td.nombre_tipo
            FROM documentos d
            INNER JOIN usuarios u ON d.id_usuario = u.id_usuario
            INNER JOIN catalogo_tiposdocumento td ON d.id_tipodoc = td.id_tipodoc
            WHERE d.fecha_vencimiento IS NOT NULL 
              AND d.fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days'
            ORDER BY d.fecha_vencimiento ASC
        `;
        const { rows } = await db.query(query);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener vencimientos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = documentosController;