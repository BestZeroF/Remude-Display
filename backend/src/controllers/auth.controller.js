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

// POST /registro/entrenador
authController.registroEntrenador = async (req, res) => {
    try {
        const { 
            nombre, apellidos, correo, password, 
            titulo_logro, fecha_logro, descripcion, especialidad, curp 
        } = req.body;

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserción usando CTE (WITH) para asegurar transaccionalidad
        const query = `
            WITH nuevo_usuario AS (
                INSERT INTO usuarios (id_rol, nombre, apellidos, correo, password, estado_cuenta)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id_usuario
            )
            INSERT INTO entrenadores (id_usuario, titulo_logro, fecha_logro, descripcion, especialidad, curp)
            VALUES ((SELECT id_usuario FROM nuevo_usuario), $7, $8, $9, $10, $11)
            RETURNING id_entrenador, id_usuario;
        `;

        const values = [
            2, // id_rol: 2 es Entrenador según catálogo
            nombre, apellidos, correo, hashedPassword, true, // true = estado_cuenta activo
            titulo_logro, fecha_logro, descripcion, especialidad, curp
        ];

        const { rows } = await db.query(query, values);

        res.status(201).json({
            message: 'Entrenador registrado exitosamente.',
            datos: rows[0]
        });

    } catch (error) {
        console.error('Error en registro de entrenador:', error);
        // Manejo de error específico de Postgres: Violación de restricción UNIQUE (ej. correo o curp ya existen)
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

        // Por seguridad, siempre decimos que se envió el correo aunque no exista para evitar enumeración de usuarios
        if (rows.length === 0) {
            return res.json({ message: 'Si el correo existe, se han enviado las instrucciones.' });
        }

        const id_usuario = rows[0].id_usuario;

        // Generamos un token temporal de 15 minutos exclusivo para reset
        const resetToken = jwt.sign(
            { id_usuario: id_usuario, reset: true },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        // NOTA: En un entorno real, aquí usarías Nodemailer para enviar "resetToken" por correo.
        // Para desarrollo, lo devolvemos en la respuesta.
        res.json({
            message: 'Si el correo existe, se han enviado las instrucciones.',
            dev_token: resetToken // <-- Quitar en producción
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

        // Verificar el token temporal
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

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nueva_password, salt);

        // Actualizar la base de datos
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