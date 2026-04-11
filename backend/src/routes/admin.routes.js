const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminController = require('../controllers/admin.controller');

const JWT_SECRET = process.env.JWT_SECRET || 'remude_secret_key_2026';

// Middleware 1: Verificar Token
const verificarToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Acceso denegado.' });

    try {
        const token = authHeader.replace('Bearer ', '');
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

// Middleware 2: Verificar que sea ADMIN (Rol 3)
const esAdmin = (req, res, next) => {
    if (req.user.id_rol !== 3) {
        return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de Administrador.' });
    }
    next();
};

// ==========================================\n// RUTAS DEL ADMINISTRADOR (Prefijo: /api/admin)
// ==========================================
router.get('/usuarios', verificarToken, esAdmin, adminController.obtenerTodosLosUsuarios);
router.put('/atletas/:id_atleta/reasignar', verificarToken, esAdmin, adminController.reasignarAtleta);
router.put('/dictamen/:id_usuario', verificarToken, esAdmin, adminController.dictaminarPerfil);
router.delete('/usuarios/:id_usuario', verificarToken, esAdmin, adminController.eliminarUsuario);

module.exports = router;