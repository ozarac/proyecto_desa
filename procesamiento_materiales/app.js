require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { keycloak } = require('./keycloak-config');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Configuración de la sesión para Keycloak
const memoryStore = new session.MemoryStore();
app.use(session({
    secret: process.env.SESSION_SECRET || 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Configuración de Keycloak
app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/',
  }));

const protectWithRole = (role) => {
    return keycloak.protect((token) => token.hasRole(role));
};

// rutas de la aplicación
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

app.get('/login', (req, res) => {
    // La función 'keycloak.login()' redirige al usuario al login de Keycloak
    keycloak.protect()(req, res, () => {
        res.redirect('/protected');
    });
});

// Ruta protegida que requerirá autenticación de Keycloak
app.get('/protected', keycloak.protect(), (req, res) => {
    res.send(`
        <h1>Bienvenido</h1>
        <ul>
            <li><a href="/materiales">Gestionar Materiales</a></li>
            <!-- Agregar más enlaces según sea necesario -->
        </ul>
    `);
});

app.get('/materiales', protectWithRole('user'), (req, res) => {
    res.sendFile('materiales.html', { root: __dirname + '/public' });
});

// Obtener todos los materiales
app.get('/api/materiales', protectWithRole('user'), async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Materiales');
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta de la base de datos:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Agregar un nuevo material
app.post('/api/materiales', protectWithRole('administrator'), async (req, res) => {
    const { nombre, descripcion, cantidadInventario, precio } = req.body;
    try {
        const result = await db.query('INSERT INTO Materiales (Nombre, Descripcion, CantidadInventario, Precio) VALUES ($1, $2, $3, $4) RETURNING *', [nombre, descripcion, cantidadInventario, precio]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
