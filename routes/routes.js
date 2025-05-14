const express = require('express');
const path = require('path');
const userManager = require('../utils/userManager');

const router = express.Router();

// Ruta raíz - redirige a login
router.get('/', (req, res) => {
    console.log('Acceso a ruta raíz, redirigiendo a login');
    res.redirect('/login');
});

// Ruta para la página de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'register.html'));
});

// Ruta para procesar el login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = userManager.authenticateUser(username, password);
    
    if (user) {
        res.json({ success: true, message: 'Login exitoso' });
    } else {
        res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
});

// Ruta para registrar un nuevo usuario
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const result = userManager.registerUser(username, password);
    
    if (result.success) {
        res.json(result);
    } else {
        const statusCode = result.userExists ? 409 : 400;
        res.status(statusCode).json(result);
    }
});

module.exports = router;