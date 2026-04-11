const db = require('../config/db');

// Visualizar todas las solicitudes con información detallada
const obtenerSolicitudes = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id_solicitud,
                s.motivo,
                s.fecha_solicitud,
                ce.nombre_estatus AS estatus,
                u_solicita.nombre AS solicitante_nombre,
                u_solicita.apellidos AS solicitante_apellidos,
                u_atleta.nombre AS atleta_nombre,
                u_atleta.apellidos AS atleta_apellidos,
                u_entrenador.nombre AS entrenador_propuesto_nombre,
                u_entrenador.apellidos AS entrenador_propuesto_apellidos
            FROM solicitudes_reasignacion s
            JOIN catalogo_estatus ce ON s.id_estatus = ce.id_estatus
            JOIN usuarios u_solicita ON s.id_usuario = u_solicita.id_usuario
            JOIN atletas a ON s.id_atleta = a.id_atleta
            JOIN usuarios u_atleta ON a.id_usuario = u_atleta.id_usuario
            JOIN entrenadores e ON s.id_entrenador = e.id_entrenador
            JOIN usuarios u_entrenador ON e.id_usuario = u_entrenador.id_usuario
            ORDER BY s.fecha_solicitud DESC;
        `;

        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Registrar una nueva solicitud de reasignación
const crearSolicitud = async (req, res) => {
    const { id_usuario, id_atleta, id_entrenador, id_estatus, motivo } = req.body;

    // Validación de campos obligatorios
    if (!id_usuario || !id_atleta || !id_entrenador || !id_estatus || !motivo) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const query = `
            INSERT INTO solicitudes_reasignacion 
            (id_usuario, id_atleta, id_entrenador, id_estatus, motivo, fecha_solicitud)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        const values = [id_usuario, id_atleta, id_entrenador, id_estatus, motivo];
        
        const result = await db.query(query, values);
        
        res.status(201).json({
            message: "Solicitud de reasignación creada con éxito",
            solicitud: result.rows[0]
        });
    } catch (error) {
        console.error("Error al crear solicitud:", error);
        
        // Manejo de errores de llaves foráneas
        if (error.code === '23503') {
            return res.status(400).json({ 
                message: "Error de referencia: Asegúrese de que el usuario, atleta, entrenador y estatus existan." 
            });
        }
        
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    obtenerSolicitudes,
    crearSolicitud
};