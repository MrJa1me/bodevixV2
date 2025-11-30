// src/config/database.js

const { Sequelize } = require('sequelize');
const path = require('path'); // Import the 'path' module

// Importar las funciones que definen los modelos
const createProductoModel = require('../models/Producto');
const createUsuarioModel = require('../models/Usuario');
const createHistorialModel = require('../models/Historial');
const createAlertaModel = require('../models/Alerta'); // Importar el modelo Alerta
const createRoleModel = require('../models/Role'); // Importar el modelo Role
const createCategoriaModel = require('../models/Categoria'); // Importar el modelo Categoria
const createUbicacionModel = require('../models/Ubicacion'); // Importar el modelo Ubicacion

// Determine the absolute path for the SQLite database file
const dbPath = path.resolve(__dirname, '../../bodega.sqlite'); // Assuming 'bodega.sqlite' is in the project root

// 1. Configuración de Sequelize para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath, // Use the absolute path for storage
  logging: false // Desactiva la impresión de las consultas SQL en la consola
});

// 2. Definir los modelos usando la instancia de sequelize
const Producto = createProductoModel(sequelize);
const Usuario = createUsuarioModel(sequelize);
const Historial = createHistorialModel(sequelize);
const Alerta = createAlertaModel(sequelize); // Definir el modelo Alerta
const Role = createRoleModel(sequelize); // Definir el modelo Role
const Categoria = createCategoriaModel(sequelize); // Definir el modelo Categoria
const Ubicacion = createUbicacionModel(sequelize); // Definir el modelo Ubicacion

// 3. Función de autenticación y sincronización
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con SQLite establecida correctamente.');
    console.log(`ℹ️ La base de datos SQLite se encuentra en: ${dbPath}`); // Log the absolute path

    // Desactivar temporalmente constraints para permitir a Sequelize sincronizar
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    console.log('ℹ️  Comprobaciones FOREIGN KEY desactivadas para sincronización.');

    // Sincronización de modelos (crea o actualiza tablas)
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas con la base de datos.');
    
    // --- Inserción de roles por defecto ---
    const defaultRoles = [
      { nombre: 'Admin', descripcion: 'Administrador con acceso total' },
      { nombre: 'Bodeguero', descripcion: 'Puede gestionar cantidades de productos' },
      { nombre: 'Encargado de inventario', descripcion: 'Puede gestionar productos y razones de eliminación' },
      { nombre: 'Vendedor independiente', descripcion: 'Puede consultar productos y realizar ventas' },
      { nombre: 'Lector', descripcion: 'Solo puede ver la información' },
    ];

    for (const roleData of defaultRoles) {
      const [role, created] = await Role.findOrCreate({
        where: { nombre: roleData.nombre },
        defaults: roleData,
      });
      if (created) {
        console.log(`➕ Rol '${role.nombre}' creado.`);
      }
    }
    console.log('✅ Roles por defecto verificados/creados.');

    // --- Definición centralizada de asociaciones ---
    // Esto previene errores de dependencia circular
    Producto.belongsTo(Usuario, { foreignKey: 'usuarioUltimaEdicionId', as: 'editor' });
    Producto.hasMany(Historial, { foreignKey: 'productoId', as: 'historial' });
    Producto.hasMany(Alerta, { foreignKey: 'productoId', as: 'alertas' }); // Un producto puede tener muchas alertas

    Usuario.hasMany(Historial, { foreignKey: 'usuarioId', as: 'actividades' });
    // Asociación Usuario-Role
    Usuario.belongsTo(Role, { foreignKey: 'roleId', as: 'role' }); // Un usuario pertenece a un rol
    Role.hasMany(Usuario, { foreignKey: 'roleId', as: 'usuarios' }); // Un rol puede tener muchos usuarios

    Historial.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Historial.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
    
    Alerta.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' }); // Una alerta pertenece a un producto
    // Alerta.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'generadaPor' }); // Si las alertas son generadas por usuarios
    
    // Asociaciones para Producto con Categoria y Ubicacion
    Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
    Producto.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });

    // Asociaciones inversas para Categoria y Ubicacion
    Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' });
    Ubicacion.hasMany(Producto, { foreignKey: 'ubicacionId', as: 'productos' });

    console.log('✅ Asociaciones de modelos configuradas.');

    // Reactivar constraints de foreign key
    await sequelize.query('PRAGMA foreign_keys = ON;');
    console.log('ℹ️  Comprobaciones FOREIGN KEY reactivadas.');

  } catch (error) {
    console.error('❌ Error al conectar o sincronizar la base de datos:', error);
    // Terminar la aplicación si la DB falla
    process.exit(1); 
  }
}

// 4. Exportar todo lo necesario
module.exports = {
  sequelize,
  connectDB,
  Producto,
  Usuario,
  Historial,
  Alerta,     // Exportar el modelo Alerta
  Role,       // Exportar el modelo Role
  Categoria,  // Exportar el modelo Categoria
  Ubicacion   // Exportar el modelo Ubicacion
};