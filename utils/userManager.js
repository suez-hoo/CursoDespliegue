const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'users.json');

/**
 * Lee los usuarios desde el archivo JSON
 * @returns {Array} Array de usuarios
 */
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        // Si el archivo no existe, crear uno vacío
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
        return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
}

/**
 * Guarda usuarios en el archivo JSON
 * @param {Array} users - Array de usuarios a guardar
 */
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/**
 * Verifica si un usuario existe
 * @param {string} username - Nombre de usuario a verificar
 * @returns {boolean} true si existe, false si no
 */
function userExists(username) {
    const users = readUsers();
    return users.some(u => u.username === username);
}

/**
 * Autentica un usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Object|null} Objeto de usuario si la autenticación es exitosa, null si falla
 */
function authenticateUser(username, password) {
    const users = readUsers();
    return users.find(u => u.username === username && u.password === password) || null;
}

/**
 * Registra un nuevo usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Object} Resultado de la operación
 */
function registerUser(username, password) {
    if (!username || !password) {
        return { 
            success: false, 
            message: 'Error: Usuario y contraseña son requeridos' 
        };
    }
    
    if (userExists(username)) {
        console.log(`Intento de registro con usuario existente: ${username}`);
        return { 
            success: false, 
            message: 'Error: El usuario "' + username + '" ya existe en el sistema. Por favor, elija otro nombre de usuario.',
            userExists: true
        };
    }
    
    const users = readUsers();
    users.push({ username, password });
    saveUsers(users);
    
    console.log(`Nuevo usuario registrado: ${username}`);
    return { 
        success: true, 
        message: 'Usuario registrado correctamente' 
    };
}

module.exports = {
    readUsers,
    saveUsers,
    userExists,
    authenticateUser,
    registerUser
};