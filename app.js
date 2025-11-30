// app.js (Backend en la raíz del proyecto)

const express = require('express');
const path = require('path');
const { connectDB } = require('./src/config/database'); // Conexión a SQLite
const authRoutes = require('./src/routes/auth');       // Rutas de Login/Registro
const productRoutes = require('./src/routes/products'); // Rutas de Productos
const userRoutes = require('./src/routes/users');       // Rutas de Usuarios (Admin)
const historialRoutes = require('./src/routes/historial'); // Rutas de Historial
const alertRoutes = require('./src/routes/alerts');     // Rutas de Alertas
const categoryRoutes = require('./src/routes/categories'); // Rutas de Categorías (Admin)
const locationRoutes = require('./src/routes/locations');   // Rutas de Ubicaciones (Admin)
const roleRoutes = require('./src/routes/roles');

// 1. Iniciar la base de datos
connectDB(); 

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares esenciales
app.use(express.json()); // Para leer JSON de las peticiones API
app.use(express.urlencoded({ extended: true }));

// 3. Servir Archivos Estáticos (Frontend)
// El navegador pedirá index.html, styles.css y script.js de aquí
app.use(express.static(path.join(__dirname, 'public'))); 

// 4. Conectar las Rutas de la API (Sprint 2)
app.use('/api/auth', authRoutes); // /api/auth/login, /api/auth/register
app.use('/api/products', productRoutes); // Rutas de productos (CRUD)
app.use('/api/users', userRoutes); // Rutas de usuarios (CRUD Admin)
app.use('/api/historial', historialRoutes); // Rutas para el historial
app.use('/api/alerts', alertRoutes); // Rutas para Alertas
app.use('/api/categories', categoryRoutes); // Rutas para Categorías
app.use('/api/locations', locationRoutes);   // Rutas para Ubicaciones
app.use('/api/roles', roleRoutes);

// 5. Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);

});