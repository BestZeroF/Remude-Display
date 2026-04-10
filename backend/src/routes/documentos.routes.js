const { Router } = require('express');
const router = Router();
const documentosController = require('../controllers/documentos.controller.js');

// Importamos los middlewares
const authMiddleware = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/upload.middleware.js');

// TODAS las rutas de documentos requieren estar autenticado
router.use(authMiddleware);

// Subir documento (espera un campo llamado 'archivo' en el form-data del frontend)
router.post('/', upload.single('archivo'), documentosController.subirDocumento);

// Obtener la lista de documentos de un usuario específico
router.get('/usuario/:id_usuario', documentosController.obtenerDocumentosUsuario);

// El Administrador revisa el documento (Aprobar o Rechazar con motivo)
router.put('/:id_documento/revision', documentosController.revisarDocumento);

// Obtener alerta de los próximos vencimientos de documentos
router.get('/vencimientos', documentosController.obtenerVencimientos);

module.exports = router;