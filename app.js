const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});