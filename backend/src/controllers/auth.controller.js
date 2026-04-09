const db = require('../config/db');
const jwt = require('jsonwebtoken');

// 1. Endpoint de Login
const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const response = await db.query(
            'SELECT id_usuario, id_rol, nombre, apellidos, password, estado_cuenta FROM usuarios WHERE correo = $1',
            [correo]
        );

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Correo o contraseña incorrectos' });
        }

        const usuario = response.rows[0];

        if (password !== usuario.password) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        if (usuario.estado_cuenta === false) {
            return res.status(403).json({ error: 'Tu cuenta ha sido desactivada. Contacta al administrador.' });
        }

        const token = jwt.sign(
            { 
                id_usuario: usuario.id_usuario, 
                id_rol: usuario.id_rol 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token: token,
            user: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                id_rol: usuario.id_rol
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión' });
    }
};

// 2. Endpoint de Registro para Entrenadores
const registroEntrenador = async (req, res) => {
    // Extraemos todos los datos, incluyendo ahora la CURP
    const { 
        nombre, 
        apellidos, 
        correo, 
        password, 
        id_rol, 
        especialidad,
        curp, 
        descripcion = null, 
        titulo_logro = null, 
        fecha_logro = null 
    } = req.body;

    try {
        // Ejecutamos la inserción en ambas tablas (usuarios y entrenadores) en una sola consulta
        const response = await db.query(`
            WITH nuevo_usuario AS (
                INSERT INTO usuarios (id_rol, nombre, apellidos, correo, password, estado_cuenta)
                VALUES ($1, $2, $3, $4, $5, true)
                RETURNING id_usuario
            )
            INSERT INTO entrenadores (id_usuario, especialidad, descripcion, titulo_logro, fecha_logro, curp)
            SELECT id_usuario, $6, $7, $8, $9, $10
            FROM nuevo_usuario
            RETURNING *;
        `, [id_rol, nombre, apellidos, correo, password, especialidad, descripcion, titulo_logro, fecha_logro, curp]);

        res.status(201).json({
            message: 'Entrenador registrado exitosamente',
            data: response.rows[0]
        });

    } catch (error) {
        console.error('Error al registrar entrenador:', error);
        
        // Manejamos si el correo o la CURP ya existen en el sistema
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El correo electrónico o la CURP ya se encuentran registrados.' });
        }
        res.status(500).json({ error: error.message, detalle: error.detail });
    }
};

module.exports = { 
    login, 
    registroEntrenador 
};