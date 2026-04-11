const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta
const JWT_SECRET = process.env.JWT_SECRET || 'remude_secret_key_2026';

const authController = {};

// POST /api/auth/login
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
            id_rol: usuario.id_rol,
            id_usuario: usuario.id_usuario
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================
// REGISTRO FASE 1: ATLETAS (Paso 1 del Frontend)
// ==========================================
// POST /api/auth/registro/atleta
authController.registrarAtletaDesdeCero = async (req, res) => {
    try {
        // Solo extraemos lo que pide tu pantalla del Paso 1
        const { nombre, primer_apellido, segundo_apellido, correo, password, curp } = req.body;

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserción inicial básica (Genera el usuario y el cascarón del atleta)
        const query = `
            WITH nuevo_usuario AS (
                INSERT INTO usuarios (id_rol, nombre, primer_apellido, segundo_apellido, correo, password, estado_cuenta)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id_usuario
            )
            INSERT INTO atletas (id_usuario, id_entrenador, id_estatus, curp)
            VALUES ((SELECT id_usuario FROM nuevo_usuario), NULL, 1, $8)
            RETURNING id_atleta, id_usuario;
        `;

        const values = [
            1, // id_rol: 1 (Atleta)
            nombre, primer_apellido, segundo_apellido || null, correo, hashedPassword, true, // true = activo
            curp
        ];

        const { rows } = await db.query(query, values);
        const nuevoAtleta = rows[0];

        // Se genera el Token inmediatamente para que el usuario pueda seguir al Paso 2 sin volver a loguearse
        const token = jwt.sign(
            { id_usuario: nuevoAtleta.id_usuario, id_rol: 1 },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            message: 'Cuenta base de atleta creada exitosamente. Continúa con el Paso 2.',
            token,
            id_usuario: nuevoAtleta.id_usuario
        });

    } catch (error) {
        console.error('Error en registro base de atleta:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo o la CURP ya están registrados en el sistema.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear la cuenta base.' });
    }
};

// ==========================================
// REGISTRO FASE 1: ENTRENADORES
// ==========================================
// POST /api/auth/registro/entrenador
authController.registroEntrenador = async (req, res) => {
    try {
        const { 
            nombre, primer_apellido, segundo_apellido, correo, password, 
            titulo_logro, fecha_logro, descripcion, especialidad, curp 
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
            2, // id_rol: 2 (Entrenador)
            nombre, primer_apellido, segundo_apellido || null, correo, hashedPassword, true, 
            titulo_logro || null, fecha_logro || null, descripcion || null, especialidad, curp
        ];

        const { rows } = await db.query(query, values);
        const nuevoEntrenador = rows[0];

        // El entrenador también recibe su token directo al registrarse
        const token = jwt.sign(
            { id_usuario: nuevoEntrenador.id_usuario, id_rol: 2 },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            message: 'Cuenta base de entrenador creada exitosamente.',
            token,
            id_usuario: nuevoEntrenador.id_usuario
        });

    } catch (error) {
        console.error('Error en registro base de entrenador:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo o la CURP ya están registrados en el sistema.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear la cuenta base.' });
    }
};

// POST /api/auth/recuperar-password
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

// PUT /api/auth/reset-password
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