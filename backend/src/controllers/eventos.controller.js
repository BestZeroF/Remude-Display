const db = require('../config/db');

const eventosController = {};

eventosController.crearEvento = async (req, res) => {
    // 1. Seguridad: Extraemos quién hace la petición desde el token JWT
    const id_usuario_token = req.user.id_usuario;
    const id_rol_token = req.user.id_rol;
    
    const { nombre_evento, fecha_inicio, fecha_fin, descripcion } = req.body;

    // 2. Validamos que únicamente el Rol 3 (Administrativo) pueda crear eventos
    if (id_rol_token !== 3) {
        return res.status(403).json({ 
            message: "Acceso denegado. Solo los perfiles administrativos pueden crear eventos." 
        });
    }

    if (!nombre_evento || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
            message: "Faltan campos obligatorios: nombre_evento, fecha_inicio y fecha_fin son requeridos."
        });
    }

    try {
        // 3. Obtenemos el id_admin real correspondiente a este usuario
        const adminQuery = 'SELECT id_admin FROM administrativos WHERE id_usuario = $1';
        const { rows: adminRows } = await db.query(adminQuery, [id_usuario_token]);

        if (adminRows.length === 0) {
            return res.status(403).json({ 
                message: "Operación rechazada. No se encontró un perfil administrativo válido asociado a tu cuenta." 
            });
        }

        const id_admin_real = adminRows[0].id_admin;

        // 4. Inserción segura
        const query = `
            INSERT INTO eventos (id_admin, nombre_evento, fecha_inicio, fecha_fin, descripcion)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [id_admin_real, nombre_evento, fecha_inicio, fecha_fin, descripcion];

        const result = await db.query(query, values);

        res.status(201).json({
            message: "Evento registrado exitosamente en el calendario.",
            evento: result.rows[0]
        });
    } catch (error) {
        console.error("Error al registrar evento:", error);
        res.status(500).json({ message: "Error interno del servidor al registrar el evento." });
    }
};

module.exports = eventosController;