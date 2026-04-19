const db = require('../config/db');

const clubesController = {};

// ==========================================
// GET /api/clubes -> Listar todos los clubes con su líder entrelazado
// ==========================================
clubesController.obtenerTodos = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.*, 
                d.nombre_disciplina,
                ce.nombre_estatus as estatus_texto,
                u_lider.nombre || ' ' || u_lider.primer_apellido as nombre_representante_real
            FROM clubes c
            LEFT JOIN disciplinas d ON c.id_disciplina = d.id_disciplina
            LEFT JOIN catalogo_estatus ce ON c.id_estatus = ce.id_estatus
            LEFT JOIN entrenadores e_lider ON c.id_entrenador_lider = e_lider.id_entrenador
            LEFT JOIN usuarios u_lider ON e_lider.id_usuario = u_lider.id_usuario
            ORDER BY c.nombre_club ASC;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener clubes:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================
// POST /api/clubes -> Registrar incluyendo el id_entrenador_lider
// ==========================================
clubesController.crear = async (req, res) => {
    try {
        const { 
            nombre_club, id_disciplina, id_entrenador_lider, 
            telefono_contacto, correo_contacto, fecha_fundacion 
        } = req.body;

        const query = `
            INSERT INTO clubes (
                nombre_club, id_disciplina, id_entrenador_lider, 
                telefono_contacto, correo_contacto, fecha_fundacion
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        // Usamos || null para evitar errores si el usuario no selecciona disciplina o fecha
        const values = [
            nombre_club, 
            id_disciplina || null, 
            id_entrenador_lider || null, 
            telefono_contacto, 
            correo_contacto, 
            fecha_fundacion || null
        ];

        const { rows } = await db.query(query, values);
        res.status(201).json({ message: 'Club registrado con éxito', club: rows[0] });
    } catch (error) {
        console.error('Error al crear club:', error);
        res.status(500).json({ message: 'Error al registrar el club.' });
    }
};

// ==========================================
// PUT /api/clubes/:id -> Actualizar info del club
// ==========================================
clubesController.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nombre_club, id_disciplina, id_entrenador_lider, 
            telefono_contacto, correo_contacto, fecha_fundacion, id_estatus 
        } = req.body;

        const query = `
            UPDATE clubes SET
                nombre_club = $1, id_disciplina = $2, id_entrenador_lider = $3,
                telefono_contacto = $4, correo_contacto = $5, fecha_fundacion = $6,
                id_estatus = $7
            WHERE id_club = $8
            RETURNING *;
        `;
        const values = [
            nombre_club, 
            id_disciplina || null, 
            id_entrenador_lider || null, 
            telefono_contacto, 
            correo_contacto, 
            fecha_fundacion || null, 
            id_estatus, 
            id
        ];

        const { rows } = await db.query(query, values);
        if (rows.length === 0) return res.status(404).json({ message: 'Club no encontrado.' });
        
        res.json({ message: 'Club actualizado correctamente', club: rows[0] });
    } catch (error) {
        console.error('Error al actualizar club:', error);
        res.status(500).json({ message: 'Error al actualizar información.' });
    }
};

// ==========================================
// DELETE /api/clubes/:id -> Baja de club (Soft Delete)
// ==========================================
clubesController.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        // Cambiamos el estatus a 2 (Inactivo/En Revisión según tu catálogo)
        await db.query('UPDATE clubes SET id_estatus = 2 WHERE id_club = $1', [id]);
        res.json({ message: 'Club dado de baja exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar club:', error);
        res.status(500).json({ message: 'Error al procesar la baja.' });
    }
};

module.exports = clubesController;