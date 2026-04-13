const { Router } = require('express');
const router = Router();
const atletasController = require('../controllers/atletas.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

// Proteger todas las rutas del módulo de atletas
router.use(authMiddleware);

// ==========================================
// NUEVO: Validar CURP (Debe ir antes de /:id para evitar que Express lo confunda con un ID)
// ==========================================
router.get('/validar-curp/:curp', atletasController.validarCURP);

// Obtener el perfil completo de un atleta
router.get('/:id', atletasController.obtenerAtletaPorId);

// El atleta actualiza su información básica
router.put('/:id', atletasController.actualizarAtleta);

// Soft delete: Dar de baja a un atleta
router.delete('/:id', atletasController.darDeBajaAtleta);

// Cargar el historial deportivo en el dashboard del atleta
router.get('/:id/historial', atletasController.obtenerHistorial);

module.exports = router;
