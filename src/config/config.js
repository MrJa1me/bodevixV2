// src/config/config.js
// Centraliza la carga de variables de entorno (JWT, expiración, etc.)
// NOTE: Environment files were removed from this project per request.
// This config will use process.env values if provided by the runtime environment
// (e.g., CI, hosting provider) or fall back to safe development defaults.
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'juanito123',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
};
