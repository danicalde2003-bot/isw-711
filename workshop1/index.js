// 1. Cargamos las variables de entorno primero que nada
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

// 2. Importamos el archivo de rutas que creamos en la carpeta /routes
// Asegúrate de que el archivo se llame routes.js y esté en esa carpeta
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middlewares: Configuración necesaria para procesar datos
// Esto permite que tu servidor lea el formato JSON que envías en las pruebas
app.use(express.json());

// 4. Conectar las rutas con un prefijo
// Todas tus rutas ahora empezarán con http://localhost:3000/api/
app.use('/api', routes);

// 5. Configuración y Conexión de MongoDB
// Usamos la URL que definiste en tu archivo .env
mongoose.connect(process.env.DATABASE_URL);
const database = mongoose.connection;

// Verificación de errores en la conexión
database.on('error', (error) => {
    console.error('❌ Error de conexión a MongoDB:', error);
});

// Verificación de éxito en la conexión
database.once('connected', () => {
    console.log('✅ Conectado a MongoDB Exitosamente');
});

// Ruta de prueba directa
app.post('/test-directo', (req, res) => {
    res.json({ mensaje: "¡El servidor recibió el POST correctamente!" });
});

// 6. Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});