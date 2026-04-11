const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const perfilesController = require('../controllers/perfiles.controller');

const JWT_SECRET = process.env.JWT_SECRET || 'remude_secret_key_2026';

// ==========================================
// MIDDLEWARE DE SEGURIDAD JWT
// ==========================================
const verificarToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // { id_usuario, id_rol }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.' });
    }
};

// ==========================================
// RUTAS MÓDULO "PROGRESSIVE PROFILING"
// Todas protegidas por el middleware verificarToken
// ==========================================

// Paso 2: Perfil Personal (RFC, NSS, etc.)
router.put('/:id_usuario/personal', verificarToken, perfilesController.upsertPerfilPersonal);
router.post('/:id_usuario/personal', verificarToken, perfilesController.upsertPerfilPersonal);

// Paso 3: Domicilio
router.put('/:id_usuario/domicilio', verificarToken, perfilesController.upsertDomicilio);
router.post('/:id_usuario/domicilio', verificarToken, perfilesController.upsertDomicilio);

// Paso 4: Perfil Médico
router.put('/:id_usuario/medico', verificarToken, perfilesController.upsertPerfilMedico);
router.post('/:id_usuario/medico', verificarToken, perfilesController.upsertPerfilMedico);

// Paso 5: Detalles / Uniformes / Académico
router.put('/:id_usuario/detalles', verificarToken, perfilesController.upsertDetalles);
router.post('/:id_usuario/detalles', verificarToken, perfilesController.upsertDetalles);

module.exports = router;