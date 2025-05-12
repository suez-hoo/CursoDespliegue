/**
 * Valida que una contraseña cumpla con requisitos de seguridad
 * @param {string} password - Contraseña a validar
 * @returns {Object} Objeto con propiedad valid (boolean) y message (string)
 */
function validatePassword(password) {
    // Verificar longitud mínima
    if (password.length < 8) {
        return {
            valid: false,
            message: 'La contraseña debe tener al menos 8 caracteres'
        };
    }
    
    // Verificar si contiene al menos un número
    if (!/\d/.test(password)) {
        return {
            valid: false,
            message: 'La contraseña debe contener al menos un número'
        };
    }
    
    // Verificar si contiene al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            message: 'La contraseña debe contener al menos una letra minúscula'
        };
    }
    
    // Verificar si contiene al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            message: 'La contraseña debe contener al menos una letra mayúscula'
        };
    }
    
    // Verificar si contiene al menos un símbolo especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return {
            valid: false,
            message: 'La contraseña debe contener al menos un símbolo especial'
        };
    }
    
    // Si pasa todas las validaciones
    return {
        valid: true,
        message: 'Contraseña segura'
    };
}

/**
 * Calcula la fortaleza de una contraseña
 * @param {string} password - Contraseña a evaluar
 * @returns {number} Porcentaje de fortaleza (0-100)
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Si está vacío, devolver 0
    if (password.length === 0) return 0;
    
    // Criterios básicos
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    // Calcular porcentaje (0-6 criterios)
    return (strength / 6) * 100;
}

/**
 * Inicializa el formulario de login con validación y envío
 */
function initLoginForm() {
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validar la contraseña
        const passwordValidation = validatePassword(password);
        const messageContainer = document.getElementById('message-container');
        messageContainer.classList.remove('d-none', 'alert-success', 'alert-danger');
        
        // Si la contraseña no es válida, mostrar mensaje y detener envío
        if (!passwordValidation.valid) {
            messageContainer.classList.add('alert-danger');
            messageContainer.textContent = passwordValidation.message;
            return; // Detener el envío del formulario
        }
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                messageContainer.classList.add('alert-success');
                messageContainer.textContent = data.message;
                // Redireccionar a la página principal o dashboard
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                messageContainer.classList.add('alert-danger');
                messageContainer.textContent = data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            messageContainer.classList.add('alert-danger');
            messageContainer.textContent = 'Error al conectar con el servidor';
        }
    });

    // Feedback en tiempo real mientras el usuario escribe la contraseña
    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const messageContainer = document.getElementById('message-container');
        
        if (password.length === 0) {
            messageContainer.classList.add('d-none');
            return;
        }
        
        const validation = validatePassword(password);
        messageContainer.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning');
        
        if (validation.valid) {
            messageContainer.classList.add('alert-success');
            messageContainer.textContent = '✓ ' + validation.message;
        } else {
            messageContainer.classList.add('alert-warning');
            messageContainer.textContent = '⚠️ ' + validation.message;
        }
    });
}

/**
 * Inicializa el formulario de registro con validación y envío
 */
function initRegisterForm() {
    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validar la contraseña
        const passwordValidation = validatePassword(password);
        const messageContainer = document.getElementById('message-container');
        messageContainer.classList.remove('d-none', 'alert-success', 'alert-danger');
        
        // Si la contraseña no es válida, mostrar mensaje y detener envío
        if (!passwordValidation.valid) {
            messageContainer.classList.add('alert-danger');
            messageContainer.textContent = passwordValidation.message;
            return; // Detener el envío del formulario
        }
        
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                messageContainer.classList.add('alert-success');
                messageContainer.textContent = data.message;
                // Redireccionar al login después de un registro exitoso
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                messageContainer.classList.add('alert-danger');
                
                // Manejar específicamente el caso de usuario existente
                if (data.userExists) {
                    messageContainer.innerHTML = '<strong>¡Usuario ya registrado!</strong> ' + data.message;
                    // Destacar el campo de usuario para indicar que debe cambiarse
                    const usernameInput = document.getElementById('username');
                    usernameInput.classList.add('is-invalid');
                    // Enfocar el campo para que el usuario pueda cambiarlo
                    usernameInput.focus();
                    // Agregar evento para quitar el estilo de error cuando se modifica
                    usernameInput.addEventListener('input', function() {
                        this.classList.remove('is-invalid');
                    }, { once: true });
                } else {
                    messageContainer.textContent = data.message;
                }
            }
        } catch (error) {
            console.error('Error:', error);
            messageContainer.classList.add('alert-danger');
            messageContainer.textContent = 'Error al conectar con el servidor';
        }
    });

    // Feedback en tiempo real para la contraseña
    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const messageContainer = document.getElementById('message-container');
        
        if (password.length === 0) {
            messageContainer.classList.add('d-none');
            return;
        }
        
        const validation = validatePassword(password);
        messageContainer.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning');
        
        if (validation.valid) {
            messageContainer.classList.add('alert-success');
            messageContainer.textContent = '✓ ' + validation.message;
        } else {
            messageContainer.classList.add('alert-warning');
            messageContainer.textContent = '⚠️ ' + validation.message;
        }
    });
}