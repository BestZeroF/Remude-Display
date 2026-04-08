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
  const { id_usuario, curp, fecha_nacimiento, id_estatus } = req.body;
  
  try {
    const response = await db.query(
      'INSERT INTO atletas (id_usuario, curp, fecha_nacimiento, id_estatus) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_usuario, curp, fecha_nacimiento, id_estatus]
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

module.exports = {
  getAtletas,
  createAtleta
};