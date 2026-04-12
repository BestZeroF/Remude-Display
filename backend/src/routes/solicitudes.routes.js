const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Proteger todas las rutas de solicitudes
router.use(authMiddleware);

// Obtener el listado de solicitudes
router.get('/', solicitudesController.obtenerSolicitudes);

// Crear una nueva solicitud
router.post('/', solicitudesController.crearSolicitud);

module.exports = router;