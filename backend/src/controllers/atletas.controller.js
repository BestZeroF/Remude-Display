const db = require('../config/db');

// Obtener todos los atletas
const getAtletas = async (req, res) => {
    try {
        const response = await db.query(`
            SELECT a.id_atleta, a.curp, a.fecha_nacimiento, u.nombre, u.apellidos
            FROM atletas a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
        `);
        res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al obtener atletas' });
    }
};

// Crear un nuevo atleta
const createAtleta = async (req, res) => {
    // Agregamos id_talla e id_entrenador como opcionales por si el frontend los envía
    const { id_usuario, curp, fecha_nacimiento, id_estatus, id_talla = null, id_entrenador = null } = req.body;
    
    try {
        const response = await db.query(
            `INSERT INTO atletas (id_usuario, curp, fecha_nacimiento, id_estatus, id_talla, id_entrenador) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [id_usuario, curp, fecha_nacimiento, id_estatus, id_talla, id_entrenador]
        );
        
        res.status(201).json({
            message: 'Atleta registrado exitosamente',
            data: response.rows[0]
        });
    } catch (error) {
        console.error(error);
        // Manejo de errores específicos, ej: CURP duplicado
        if (error.code === '23505') {
            return res.status(400).json({ error: 'La CURP ya está registrada' });
        }
        res.status(500).json({ error: 'Error al registrar el atleta' });
    }
};

// Obtener un atleta por ID
const getAtletaById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db.query(`
            SELECT a.id_atleta, a.curp, a.fecha_nacimiento, a.id_estatus, a.id_talla, a.id_entrenador, 
                   u.nombre, u.apellidos, u.correo
            FROM atletas a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
            WHERE a.id_atleta = $1
        `, [id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Atleta no encontrado' });
        }
        res.status(200).json(response.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el atleta' });
    }
};

// Actualizar información de un atleta
const updateAtleta = async (req, res) => {
    const { id } = req.params;
    const { curp, fecha_nacimiento, id_estatus, id_talla, id_entrenador } = req.body;
    
    try {
        const response = await db.query(`
            UPDATE atletas
            SET curp = COALESCE($1, curp),
                fecha_nacimiento = COALESCE($2, fecha_nacimiento),
                id_estatus = COALESCE($3, id_estatus),
                id_talla = COALESCE($4, id_talla),
                id_entrenador = COALESCE($5, id_entrenador)
            WHERE id_atleta = $6
            RETURNING *
        `, [curp, fecha_nacimiento, id_estatus, id_talla, id_entrenador, id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Atleta no encontrado para actualizar' });
        }
        res.status(200).json({ 
            message: 'Atleta actualizado exitosamente', 
            data: response.rows[0] 
        });
    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'La CURP ingresada ya pertenece a otro registro' });
        }
        res.status(500).json({ error: 'Error interno del servidor al actualizar el atleta' });
    }
};

// Eliminar un atleta (Borrado Físico)
const deleteAtleta = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db.query('DELETE FROM atletas WHERE id_atleta = $1 RETURNING *', [id]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Atleta no encontrado para eliminar' });
        }
        res.status(200).json({ message: 'Atleta eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        if (error.code === '23503') {
            return res.status(400).json({ 
                error: 'No se puede eliminar el atleta porque tiene registros asociados (historial, documentos o disciplinas).' 
            });
        }
        res.status(500).json({ error: 'Error interno del servidor al eliminar el atleta' });
    }
};

module.exports = {
    getAtletas,
    createAtleta,
    getAtletaById,
    updateAtleta,
    deleteAtleta
};