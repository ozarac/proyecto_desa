const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
  'auth-server-url': process.env.KEYCLOAK_URL,
  'realm': process.env.KEYCLOAK_REALM,
  'clientId': process.env.KEYCLOAK_CLIENT_ID,
  'bearer-only': false
});

module.exports = { keycloak };
