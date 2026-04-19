const db = require('../config/db');

const eventosController = {};

// ==========================================
// GET /api/eventos -> Listar todos los eventos
// ==========================================
eventosController.obtenerEventos = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.id_evento, e.nombre_evento, e.fecha_inicio, e.fecha_fin, e.descripcion,
                u.nombre AS admin_nombre, u.primer_apellido AS admin_apellido
            FROM eventos e
            LEFT JOIN administrativos a ON e.id_admin = a.id_admin
            LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
            ORDER BY e.fecha_inicio ASC;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        res.status(500).json({ message: "Error interno del servidor al cargar el calendario." });
    }
};

// ==========================================
// POST /api/eventos -> Crear evento (Tu lógica original mejorada)
// ==========================================
eventosController.crearEvento = async (req, res) => {
    const id_usuario_token = req.user.id_usuario;
    const id_rol_token = req.user.id_rol;
    
    const { nombre_evento, fecha_inicio, fecha_fin, descripcion } = req.body;

    if (id_rol_token !== 3) {
        return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden crear eventos." });
    }

    if (!nombre_evento || !fecha_inicio) {
        return res.status(400).json({ message: "Faltan campos obligatorios: nombre_evento y fecha_inicio." });
    }

    try {
        const adminQuery = 'SELECT id_admin FROM administrativos WHERE id_usuario = $1';
        const { rows: adminRows } = await db.query(adminQuery, [id_usuario_token]);

        if (adminRows.length === 0) {
            return res.status(403).json({ message: "No se encontró un perfil administrativo válido asociado a tu cuenta." });
        }

        const id_admin_real = adminRows[0].id_admin;

        const query = `
            INSERT INTO eventos (id_admin, nombre_evento, fecha_inicio, fecha_fin, descripcion)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [id_admin_real, nombre_evento, fecha_inicio, fecha_fin || null, descripcion || ''];

        const { rows } = await db.query(query, values);
        res.status(201).json({ message: "Evento registrado exitosamente.", evento: rows[0] });
    } catch (error) {
        console.error("Error al registrar evento:", error);
        res.status(500).json({ message: "Error interno del servidor al registrar el evento." });
    }
};

// ==========================================
// DELETE /api/eventos/:id -> Eliminar evento
// ==========================================
eventosController.eliminarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (req.user.id_rol !== 3) {
            return res.status(403).json({ message: "Acceso denegado." });
        }

        const { rows } = await db.query('DELETE FROM eventos WHERE id_evento = $1 RETURNING *', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Evento no encontrado." });
        }

        res.json({ message: "Evento eliminado correctamente del calendario." });
    } catch (error) {
        console.error("Error al eliminar evento:", error);
        res.status(500).json({ message: "Error al intentar eliminar el evento." });
    }
};

module.exports = eventosController;