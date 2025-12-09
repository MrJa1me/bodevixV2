// app.js (Backend en la raíz del proyecto)

const express = require('express');
const path = require('path');
const os = require('os');
const { connectDB } = require('./src/config/database');
const models = require('./src/models'); // <-- 1. Importar los modelos
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const userRoutes = require('./src/routes/users');
const historialRoutes = require('./src/routes/historial');
const alertRoutes = require('./src/routes/alerts');
const categoryRoutes = require('./src/routes/categories');
const locationRoutes = require('./src/routes/locations');
const roleRoutes = require('./src/routes/roles');

// 1. Iniciar la base de datos, pasando los modelos para el sembrado
connectDB(models); 

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares esenciales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. CORS para permitir acceso desde móvil y otros dispositivos
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-User');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 4. Servir Archivos Estáticos (Frontend)
app.use(express.static(path.join(__dirname, 'public'))); 

// 5. Conectar las Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/roles', roleRoutes);

// 6. Ruta catch-all para SPA
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// 7. Función para obtener la IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

// 8. Servidor
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Servidor Express corriendo`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n📱 Accede desde tu móvil:`);
    console.log(`   http://${localIP}:${PORT}`);
    console.log(`\n💻 Accede desde este PC:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`\n${'='.repeat(60)}\n`);
});