const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3009;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));

// Asegurar que la carpeta js sea accesible
app.use('/js', express.static(path.join(__dirname, 'js')));

// Función para leer usuarios del archivo JSON
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        // Si el archivo no existe, crear uno vacío
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
        return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
}

// Función para guardar usuarios en el archivo JSON
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Ruta para la página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Ruta para la página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Ruta para procesar el login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ success: true, message: 'Login exitoso' });
    } else {
        res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
});

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Error: Usuario y contraseña son requeridos' 
        });
    }
    
    const users = readUsers();
    
    // Verificar si el usuario ya existe - Mensaje más explícito
    if (users.some(u => u.username === username)) {
        console.log(`Intento de registro con usuario existente: ${username}`);
        return res.status(409).json({ 
            success: false, 
            message: 'Error: El usuario "' + username + '" ya existe en el sistema. Por favor, elija otro nombre de usuario.',
            userExists: true // Flag específico para manejar este caso en el frontend
        });
    }
    
    // Añadir el nuevo usuario
    users.push({ username, password });
    saveUsers(users);
    
    console.log(`Nuevo usuario registrado: ${username}`);
    res.json({ 
        success: true, 
        message: 'Usuario registrado correctamente' 
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});