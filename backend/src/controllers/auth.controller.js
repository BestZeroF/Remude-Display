const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta (Asegúrate de tenerla en tu archivo .env, ej: JWT_SECRET=supersecreto)
const JWT_SECRET = process.env.JWT_SECRET || 'remude_secret_key_2026';

const authController = {};

// POST /login
authController.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const query = 'SELECT id_usuario, id_rol, password, estado_cuenta FROM usuarios WHERE correo = $1';
        const { rows } = await db.query(query, [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const usuario = rows[0];

        if (!usuario.estado_cuenta) {
            return res.status(403).json({ message: 'La cuenta está desactivada.' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Generar token
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Inicio de sesión exitoso.',
            token,
            id_rol: usuario.id_rol
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// POST /registro/atleta (Registro rápido sin info completa)
authController.registrarAtletaDesdeCero = async (req, res) => {
    try {
        const {
            nombre, primer_apellido, segundo_apellido, correo, password,
            curp, fecha_nacimiento, id_talla
        } = req.body;

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserción actualizada con los nuevos nombres de columnas
        const query = `
            WITH nuevo_usuario AS (
                INSERT INTO usuarios (id_rol, nombre, primer_apellido, segundo_apellido, correo, password, estado_cuenta)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id_usuario
            )
            INSERT INTO atletas (id_usuario, id_entrenador, id_estatus, id_talla, curp, fecha_nacimiento)
            VALUES ((SELECT id_usuario FROM nuevo_usuario), NULL, 1, $8, $9, $10)
            RETURNING id_atleta, id_usuario;
        `;

        const values = [
            1, // id_rol: 1 es Atleta según catálogo
            nombre, primer_apellido, segundo_apellido, correo, hashedPassword, true, // estado_cuenta activo
            id_talla, curp, fecha_nacimiento
        ];

        const { rows } = await db.query(query, values);
        const nuevoAtleta = rows[0];

        const token = jwt.sign(
            { id_usuario: nuevoAtleta.id_usuario, id_rol: 1 },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            message: 'Atleta registrado exitosamente.',
            token,
            datos: nuevoAtleta
        });

    } catch (error) {
        console.error('Error en registro de atleta:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo o la CURP ya están registrados en el sistema.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al registrar.' });
    }
};

// POST /registro/entrenador
authController.registroEntrenador = async (req, res) => {
    try {
        const { 
            nombre, primer_apellido, segundo_apellido, correo, password, 
            titulo_logro, fecha_logro, descripcion, especialidad, curp 
        } = req.body;

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserción actualizada con los nuevos nombres de columnas (primer_apellido, segundo_apellido)
        const query = `
            WITH nuevo_usuario AS (
                INSERT INTO usuarios (id_rol, nombre, primer_apellido, segundo_apellido, correo, password, estado_cuenta)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id_usuario
            )
            INSERT INTO entrenadores (id_usuario, titulo_logro, fecha_logro, descripcion, especialidad, curp)
            VALUES ((SELECT id_usuario FROM nuevo_usuario), $8, $9, $10, $11, $12)
            RETURNING id_entrenador, id_usuario;
        `;

        const values = [
            2, // id_rol: 2 es Entrenador según catálogo
            nombre, primer_apellido, segundo_apellido, correo, hashedPassword, true, // true = estado_cuenta activo
            titulo_logro, fecha_logro || null, descripcion || null, especialidad, curp
        ];

        const { rows } = await db.query(query, values);

        res.status(201).json({
            message: 'Entrenador registrado exitosamente.',
            datos: rows[0]
        });

    } catch (error) {
        console.error('Error en registro de entrenador:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo o la CURP ya están registrados en el sistema.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al registrar.' });
    }
};

// POST /recuperar-password
authController.recuperarPassword = async (req, res) => {
    try {
        const { correo } = req.body;

        const query = 'SELECT id_usuario FROM usuarios WHERE correo = $1 AND estado_cuenta = true';
        const { rows } = await db.query(query, [correo]);

        if (rows.length === 0) {
            return res.json({ message: 'Si el correo existe, se han enviado las instrucciones.' });
        }

        const id_usuario = rows[0].id_usuario;

        const resetToken = jwt.sign(
            { id_usuario: id_usuario, reset: true },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({
            message: 'Si el correo existe, se han enviado las instrucciones.',
            dev_token: resetToken 
        });

    } catch (error) {
        console.error('Error en recuperar password:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// PUT /reset-password
authController.resetPassword = async (req, res) => {
    try {
        const { token, nueva_password } = req.body;

        if (!token || !nueva_password) {
            return res.status(400).json({ message: 'Token y nueva contraseña son requeridos.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
            if (!decoded.reset) {
                throw new Error('Token no válido para esta operación');
            }
        } catch (jwtError) {
            return res.status(401).json({ message: 'El enlace ha expirado o es inválido.' });
        }

        const id_usuario = decoded.id_usuario;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nueva_password, salt);

        const query = 'UPDATE usuarios SET password = $1 WHERE id_usuario = $2 RETURNING id_usuario';
        const { rows } = await db.query(query, [hashedPassword, id_usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.' });

    } catch (error) {
        console.error('Error en reset password:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = authController;