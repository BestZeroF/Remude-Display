const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Importamos el middleware global de JWT
const authMiddleware = require('../middlewares/auth.middleware');

// Middleware local: Verificar que sea ADMIN (Rol 3)
const esAdmin = (req, res, next) => {
    if (req.user.id_rol !== 3) {
        return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de Administrador.' });
    }
    next();
};

// ==========================================
// RUTAS DEL ADMINISTRADOR (Prefijo: /api/admin)
// Protegidas por JWT Global y Verificación de Rol
// ==========================================
router.get('/usuarios', authMiddleware, esAdmin, adminController.obtenerTodosLosUsuarios);
router.put('/atletas/:id_atleta/reasignar', authMiddleware, esAdmin, adminController.reasignarAtleta);
router.put('/dictamen/:id_usuario', authMiddleware, esAdmin, adminController.dictaminarPerfil);
router.delete('/usuarios/:id_usuario', authMiddleware, esAdmin, adminController.eliminarUsuario);

module.exports = router;