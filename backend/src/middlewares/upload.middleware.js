const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio exista (opcional pero recomendado)
const dir = 'uploads/documentos/';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Formato: idUsuario-timestamp-aleatorio.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const idUsuario = req.user ? req.user.id_usuario : 'anonimo';
        cb(null, `${idUsuario}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Formato no soportado. Por favor, sube solo PDF o imágenes.'));
        }
    }
});

module.exports = upload;