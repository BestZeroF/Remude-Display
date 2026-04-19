const express = require('express');
const router = express.Router();
const clubesController = require('../controllers/clubes.controller');

// Middlewares de seguridad
const authMiddleware = require('../middlewares/auth.middleware');

// Helper local para validar que sea Admin
const esAdmin = (req, res, next) => {
    if (req.user.id_rol !== 3) {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere perfil de Administrador.' });
    }
    next();
};

// --- RUTAS PROTEGIDAS ---
router.get('/', authMiddleware, clubesController.obtenerTodos);
router.post('/', authMiddleware, esAdmin, clubesController.crear);
router.put('/:id', authMiddleware, esAdmin, clubesController.actualizar);
router.delete('/:id', authMiddleware, esAdmin, clubesController.eliminar);

module.exports = router;