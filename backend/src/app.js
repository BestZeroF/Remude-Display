const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importación de rutas
const atletasRoutes = require('./routes/atletas.routes');
// Aquí importarás las demás cuando las crees:
// const authRoutes = require('./routes/auth.routes');
// const entrenadoresRoutes = require('./routes/entrenadores.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Para poder leer JSON en el body de las peticiones

// Configuración de Rutas
app.use('/api/atletas', atletasRoutes);
// app.use('/api/auth', authRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor de REMUDE corriendo en http://localhost:${PORT}`);
});