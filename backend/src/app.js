const express = require('express');
const cors = require('cors');
const path = require('path');

// ==========================================
// 1. IMPORTACIÓN DE RUTAS
// ==========================================
const authRoutes = require('./routes/auth.routes');
const atletasRoutes = require('./routes/atletas.routes');
const entrenadoresRoutes = require('./routes/entrenadores.routes');
const documentosRoutes = require('./routes/documentos.routes');
const perfilesRoutes = require('./routes/perfiles.routes');
const catalogosRoutes = require('./routes/catalogos.routes');
const eventosRoutes = require('./routes/eventos.routes');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const adminRoutes = require('./routes/admin.routes');
const clubesRoutes = require('./routes/clubes.routes');

const app = express();

// ==========================================
// 2. MIDDLEWARES GLOBALES
// ==========================================

// Habilitar CORS: Permite que tu Frontend se comunique con este servidor
app.use(cors()); 

// Permite que el servidor entienda los cuerpos de las peticiones en formato JSON
app.use(express.json()); 

// Permite procesar datos de formularios (útil cuando se suben archivos con Multer)
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 3. ARCHIVOS ESTÁTICOS
// ==========================================
// Esto hace que la carpeta donde se guardan los documentos sea de acceso público
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// 4. CONEXIÓN DE RUTAS (ENDPOINTS)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/atletas', atletasRoutes);
app.use('/api/entrenadores', entrenadoresRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/perfiles', perfilesRoutes);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clubes', clubesRoutes);

// Endpoint de prueba para saber que todo está funcionando bien
app.get('/', (req, res) => {
    res.json({ message: '🚀 API de Remude conectada y funcionando correctamente (V5.0).' });
});

// ==========================================
// 5. INICIALIZACIÓN DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`✅ Servidor Remude corriendo en puerto ${PORT}`);
    console.log(`🌐 Accede a: http://localhost:${PORT}`);
    console.log(`===========================================`);
});

module.exports = app;