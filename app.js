const express = require('express');
const path = require('path');
const routes = require('./routes/routes');

// Configuración de la aplicación
const app = express();
const APP_NAME = 'despli'; 
const PORT = 3009;

// PRIMERO: Configuración de middleware estándar
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware para registrar solicitudes
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.path}`);
    next();
});

// SEGUNDO: Middleware para archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use('/js', express.static(path.join(__dirname, 'js')));

// TERCERO: Rutas de la aplicación
app.use('/', routes);

// ÚLTIMO: Un solo middleware de captura para cualquier ruta no definida
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.path}, redirigiendo a login`);
    res.redirect('/login');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ${APP_NAME} ejecutándose en http://localhost:${PORT}`);
});