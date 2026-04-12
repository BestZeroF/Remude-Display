const { Router } = require('express');
const router = Router();
const entrenadoresController = require('../controllers/entrenadores.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

// TODAS las rutas de entrenadores requieren autenticación JWT
router.use(authMiddleware);

// IMPORTANTE: Rutas estáticas como /dashboard deben ir ANTES que las rutas con parámetros dinámicos (/:id)
// de lo contrario Express pensará que "dashboard" o "mis-atletas" es un :id.

// Obtener dashboard del entrenador autenticado
router.get('/dashboard', entrenadoresController.obtenerDashboard);

// NUEVO V6: Listado dinámico de los atletas del entrenador (Pantalla "Mi Delegación")
router.get('/mis-atletas', entrenadoresController.obtenerMisAtletas);

// Listar todos los entrenadores
router.get('/', entrenadoresController.listarEntrenadores);

// Obtener perfil específico
router.get('/:id', entrenadoresController.obtenerEntrenadorPorId);

// Actualizar perfil del entrenador
router.put('/:id', entrenadoresController.actualizarEntrenador);

// Obtener la lista de atletas que le pertenecen al entrenador (Ruta antigua, conservada por si acaso)
router.get('/:id/atletas', entrenadoresController.obtenerAtletasDeEntrenador);

module.exports = router;