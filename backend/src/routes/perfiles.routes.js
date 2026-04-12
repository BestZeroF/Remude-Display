const express = require('express');
const router = express.Router();
const perfilesController = require('../controllers/perfiles.controller');

// Importamos el middleware global que ya creaste
const authMiddleware = require('../middlewares/auth.middleware');

// ==========================================
// RUTAS MÓDULO "PROGRESSIVE PROFILING"
// Todas protegidas por el middleware global
// ==========================================

// Paso 2: Perfil Personal (RFC, NSS, etc.)
router.put('/:id_usuario/personal', authMiddleware, perfilesController.upsertPerfilPersonal);
router.post('/:id_usuario/personal', authMiddleware, perfilesController.upsertPerfilPersonal);

// Paso 3: Domicilio
router.put('/:id_usuario/domicilio', authMiddleware, perfilesController.upsertDomicilio);
router.post('/:id_usuario/domicilio', authMiddleware, perfilesController.upsertDomicilio);

// Paso 4: Perfil Médico
router.put('/:id_usuario/medico', authMiddleware, perfilesController.upsertPerfilMedico);
router.post('/:id_usuario/medico', authMiddleware, perfilesController.upsertPerfilMedico);

// Paso 5: Detalles / Uniformes / Académico
router.put('/:id_usuario/detalles', authMiddleware, perfilesController.upsertDetalles);
router.post('/:id_usuario/detalles', authMiddleware, perfilesController.upsertDetalles);

// Paso Final: Enviar expediente completo a revisión
router.put('/:id_usuario/enviar-revision', authMiddleware, perfilesController.enviarARevision);

module.exports = router;