require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { keycloak } = require('./keycloak-config');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Configuración de la sesión para Keycloak
app.use(session({
  secret: process.env.SESSION_SECRET || 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: new session.MemoryStore()
}));

// Configuración de Keycloak
app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/',
}));

// rutas de la aplicación
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});
  
// Ruta protegida que requerirá autenticación de Keycloak
app.get('/protected', keycloak.protect(), (req, res) => {
    res.send("Esta ruta está protegida y has sido autenticado.");
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
