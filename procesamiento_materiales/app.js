require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { keycloak } = require('./keycloak-config');

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
const keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware());

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
    res.send("Esta ruta está protegida y has sido autenticado.");
});

// Rutas para la API de productos
app.get('/productos', protectWithRole('user'), (req, res) => {
    // Implementa lógica para listar productos
});

app.post('/productos', protectWithRole('admin'), (req, res) => {
    // Implementa lógica para añadir un nuevo producto
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
