const db = require('../config/db');

const crearEvento = async (req, res) => {
    const { id_admin, nombre_evento, fecha_inicio, fecha_fin, descripcion } = req.body;

    // Validación básica de campos obligatorios
    if (!id_admin || !nombre_evento || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
            message: "Faltan campos obligatorios: id_admin, nombre_evento, fecha_inicio y fecha_fin son requeridos."
        });
    }

    try {
        const query = `
            INSERT INTO eventos (id_admin, nombre_evento, fecha_inicio, fecha_fin, descripcion)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [id_admin, nombre_evento, fecha_inicio, fecha_fin, descripcion];

        const result = await db.query(query, values);

        res.status(201).json({
            message: "Evento registrado exitosamente",
            evento: result.rows[0]
        });
    } catch (error) {
        console.error("Error al registrar evento:", error);
        
        // Manejo de error de llave foránea (si el admin no existe)
        if (error.code === '23503') {
            return res.status(400).json({ 
                message: "El id_admin proporcionado no existe en la tabla de administrativos." 
            });
        }

        res.status(500).json({
            message: "Error interno del servidor al registrar el evento"
        });
    }
};

module.exports = {
    crearEvento
};