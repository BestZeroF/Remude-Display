const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta
const JWT_SECRET = process.env.JWT_SECRET || 'remude_secret_key_2026';

const authController = {};

// ==========================================
// POST /api/auth/login
// ==========================================
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
            return res.status(403).json({ message: 'La cuenta está desactivada. Contacte a un administrador.' });
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
// POST /api/auth/registro/atleta (Fase 1)
// ==========================================
authController.registrarAtletaDesdeCero = async (req, res) => {
    const { nombre, primer_apellido, segundo_apellido, correo, password, curp } = req.body;
    let id_entrenador_asignado = req.body.id_entrenador || null;

    // MAGIA BACKEND: Detectamos automáticamente al entrenador que tiene la sesión iniciada
    const authHeader = req.header('Authorization');
    if (authHeader) {
        try {
            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Si el usuario autenticado tiene rol 2 (Entrenador)
            if (decoded.id_rol === 2) {
                // ¡CORRECCIÓN CRÍTICA!: Buscamos el id_entrenador real en la tabla entrenadores.
                // Usar el id_usuario directamente causaba un Error 500 por violación de llave foránea.
                const resEntrenador = await db.query('SELECT id_entrenador FROM entrenadores WHERE id_usuario = $1', [decoded.id_usuario]);
                if (resEntrenador.rows.length > 0) {
                    id_entrenador_asignado = resEntrenador.rows[0].id_entrenador;
                }
            }
        } catch (error) {
            // Ignoramos el error de token aquí para permitir que los atletas se registren a sí mismos públicamente sin token
            console.log("Registro de atleta sin sesión de entrenador activa.");
        }
    }

    if (!nombre || !primer_apellido || !correo || !password || !curp) {
        return res.status(400).json({ message: 'Los campos marcados con asterisco son obligatorios.' });
    }

    try {
        await db.query('BEGIN'); // Iniciar transacción segura

        // 1. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Insertar en tabla usuarios (Rol 1 = Atleta)
        const queryUser = `
            INSERT INTO usuarios (nombre, primer_apellido, segundo_apellido, correo, password, id_rol, estado_cuenta)
            VALUES ($1, $2, $3, $4, $5, 1, true)
            RETURNING id_usuario;
        `;
        const { rows: userRows } = await db.query(queryUser, [nombre, primer_apellido, segundo_apellido, correo, hashedPassword]);
        const new_id_usuario = userRows[0].id_usuario;

        // 3. Insertar perfil base en la tabla atletas (Estatus 1 = Pendiente/Activo inicial)
        const queryAtleta = `
            INSERT INTO atletas (id_usuario, curp, id_estatus, id_entrenador)
            VALUES ($1, $2, 1, $3)
            RETURNING id_atleta;
        `;
        await db.query(queryAtleta, [new_id_usuario, curp, id_entrenador_asignado]);

        await db.query('COMMIT'); // Guardar cambios en BD

        // 4. Generar Token para permitir el Profile Progression inmediato
        const token = jwt.sign(
            { id_usuario: new_id_usuario, id_rol: 1 },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            message: 'Cuenta creada exitosamente. Pasando a la Fase 2.',
            token,
            id_usuario: new_id_usuario,
            id_rol: 1,
            entrenador_asignado: id_entrenador_asignado // Para debug en el frontend
        });

    } catch (error) {
        await db.query('ROLLBACK'); // Deshacer cambios si algo falla
        console.error('Error detallado en registro de atleta:', error.message, error.detail);
        
        // ¡NUEVO!: Respuestas de error ultra-específicas para saber qué falló en la BD
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo o CURP ya se encuentra registrado en el sistema.' });
        }
        if (error.code === '23503') {
            return res.status(400).json({ message: 'Error de integridad (Llave foránea). Asegúrate de que el id_entrenador existe en la BD.', detail: error.detail });
        }
        if (error.code === '42703') {
            return res.status(500).json({ message: 'Error estructural: La columna id_entrenador no existe en tu tabla atletas. ¡Debes crearla en PostgreSQL!', detail: error.message });
        }
        
        res.status(500).json({ message: 'Error interno del servidor al crear la cuenta. Revisa la consola del backend.', error: error.message });
    }
};

// ==========================================
// POST /api/auth/registro/entrenador (Fase 1)
// ==========================================
authController.registroEntrenador = async (req, res) => {
    const { nombre, primer_apellido, segundo_apellido, correo, password, curp } = req.body;

    if (!nombre || !primer_apellido || !correo || !password) {
        return res.status(400).json({ message: 'Los campos básicos son obligatorios.' });
    }

    try {
        // NUEVO V6: Validación manual de la CURP antes de iniciar la transacción
        if (curp) {
            const checkCurpQuery = `
                SELECT curp FROM entrenadores WHERE curp = $1 
                UNION 
                SELECT curp FROM atletas WHERE curp = $1
            `;
            const checkCurp = await db.query(checkCurpQuery, [curp]);
            
            if (checkCurp.rows.length > 0) {
                return res.status(409).json({ message: 'La CURP ingresada ya se encuentra registrada en el sistema.' });
            }
        }

        await db.query('BEGIN');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar en tabla usuarios (Rol 2 = Entrenador)
        const queryUser = `
            INSERT INTO usuarios (nombre, primer_apellido, segundo_apellido, correo, password, id_rol, estado_cuenta)
            VALUES ($1, $2, $3, $4, $5, 2, true)
            RETURNING id_usuario;
        `;
        const { rows: userRows } = await db.query(queryUser, [nombre, primer_apellido, segundo_apellido, correo, hashedPassword]);
        const new_id_usuario = userRows[0].id_usuario;

        // Insertar perfil base en la tabla entrenadores
        const queryEntrenador = `
            INSERT INTO entrenadores (id_usuario, curp)
            VALUES ($1, $2)
            RETURNING id_entrenador;
        `;
        // CURP es opcional para el entrenador en esta etapa inicial
        await db.query(queryEntrenador, [new_id_usuario, curp || null]);

        await db.query('COMMIT');

        const token = jwt.sign(
            { id_usuario: new_id_usuario, id_rol: 2 },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            message: 'Cuenta de entrenador creada exitosamente. Pasando a la Fase 2.',
            token,
            id_usuario: new_id_usuario,
            id_rol: 2
        });

    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error en registro de entrenador:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo ya se encuentra registrado en el sistema.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear la cuenta.' });
    }
};

// ==========================================
// POST /api/auth/recuperar-password
// ==========================================
authController.recuperarPassword = async (req, res) => {
    try {
        const { correo } = req.body;

        const query = 'SELECT id_usuario FROM usuarios WHERE correo = $1 AND estado_cuenta = true';
        const { rows } = await db.query(query, [correo]);

        if (rows.length === 0) {
            // Retornamos 200 aunque no exista para evitar enumeración de usuarios
            return res.json({ message: 'Si el correo existe en el sistema, recibirás un enlace de recuperación.' });
        }

        const id_usuario = rows[0].id_usuario;

        // Generar un token temporal que dura solo 15 minutos
        const tokenRecuperacion = jwt.sign(
            { id_usuario, reset: true },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        // TODO: Aquí integrarías NodeMailer para enviar el correo con el tokenRecuperacion
        console.log(`[SIMULACIÓN CORREO] Enlace de recuperación: http://localhost:5173/reset-password?token=${tokenRecuperacion}`);

        res.json({ message: 'Si el correo existe en el sistema, recibirás un enlace de recuperación.' });
    } catch (error) {
        console.error('Error en recuperar password:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================
// PUT /api/auth/reset-password
// ==========================================
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
