// src/config/database.js

const { Sequelize } = require('sequelize');
const path = require('path'); // Import the 'path' module

// Importar las funciones que definen los modelos
const createProductoModel = require('../models/Producto');
const createUsuarioModel = require('../models/Usuario');
const createHistorialModel = require('../models/Historial');
const createAlertaModel = require('../models/Alerta');
const createRoleModel = require('../models/Role');
const createPermisoModel = require('../models/Permiso');
const createRolePermisoModel = require('../models/RolePermiso'); // <-- NUEVO
const createCategoriaModel = require('../models/Categoria');
const createUbicacionModel = require('../models/Ubicacion');

// Determine the absolute path for the SQLite database file
const dbPath = path.resolve(__dirname, '../../bodega.sqlite');

// 1. Configuración de Sequelize para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

// 2. Definir los modelos usando la instancia de sequelize
const Producto = createProductoModel(sequelize);
const Usuario = createUsuarioModel(sequelize);
const Historial = createHistorialModel(sequelize);
const Alerta = createAlertaModel(sequelize);
const Role = createRoleModel(sequelize);
const Permiso = createPermisoModel(sequelize);
const RolePermiso = createRolePermisoModel(sequelize); // <-- NUEVO
const Categoria = createCategoriaModel(sequelize);
const Ubicacion = createUbicacionModel(sequelize);

// 3. Función de autenticación y sincronización
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con SQLite establecida correctamente.');
    console.log(`ℹ️ La base de datos SQLite se encuentra en: ${dbPath}`);

    // --- Definición centralizada de asociaciones ---
    Producto.belongsTo(Usuario, { foreignKey: 'usuarioUltimaEdicionId', as: 'editor' });
    Producto.hasMany(Historial, { foreignKey: 'productoId', as: 'historial', onDelete: 'SET NULL' });
    Producto.hasMany(Alerta, { foreignKey: 'productoId', as: 'alertas', onDelete: 'CASCADE' });

    Usuario.hasMany(Historial, { foreignKey: 'usuarioId', as: 'actividades' });
    Usuario.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
    Role.hasMany(Usuario, { foreignKey: 'roleId', as: 'usuarios' });

    Historial.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Historial.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto', onDelete: 'SET NULL' });
    
    Alerta.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto', onDelete: 'CASCADE' });
    
    Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
    Producto.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });

    Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' });
    Ubicacion.hasMany(Producto, { foreignKey: 'ubicacionId', as: 'productos' });

    // ASOCIACIÓN ACTUALIZADA para usar el modelo explícito y con alias
    Role.belongsToMany(Permiso, { through: RolePermiso, as: 'permisos', foreignKey: 'roleId' });
    Permiso.belongsToMany(Role, { through: RolePermiso, as: 'roles', foreignKey: 'permisoId' });
    console.log('✅ Asociaciones de modelos configuradas.');

    // Desactivar temporalmente constraints para permitir a Sequelize sincronizar
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    console.log('ℹ️  Comprobaciones FOREIGN KEY desactivadas para sincronización.');

    // Sincronización de modelos (crea o actualiza tablas)
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas con la base de datos.');
    
    // Reactivar constraints de foreign key
    await sequelize.query('PRAGMA foreign_keys = ON;');
    console.log('ℹ️  Comprobaciones FOREIGN KEY reactivadas.');

    // --- SEMBRADO DE PERMISOS ---
    const { seedPermissions } = require('../../scripts/seedPermissions');
    await seedPermissions(Permiso);

    // --- Inserción de roles por defecto (después de sync) ---
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

    // --- Inserción del usuario admin por defecto ---
    console.log('ℹ️  Verificando usuario admin por defecto...');
    const adminRole = await Role.findOne({ where: { nombre: 'Admin' } });
    if (adminRole) {
      const [adminUser, created] = await Usuario.findOrCreate({
        where: { username: 'admin' },
        defaults: {
          roleId: adminRole.id
        }
      });
      if (created) {
        console.log(`➕ Usuario 'admin' con rol de 'Admin' creado.`);
      } else {
        // Opcional: asegurarse de que el usuario admin siempre tenga el rol de Admin
        if (adminUser.roleId !== adminRole.id) {
          adminUser.roleId = adminRole.id;
          await adminUser.save();
          console.log(`🔄 Rol del usuario 'admin' actualizado a 'Admin'.`);
        }
      }
    } else {
      console.warn('⚠️  No se encontró el rol "Admin", no se pudo crear el usuario admin por defecto.');
    }
    console.log('✅ Usuario admin verificado/creado.');

    // --- Asignación de todos los permisos al rol de Admin ---
    console.log('ℹ️  Asignando permisos al rol de Admin...');
    if (adminRole) {
      const allPermissions = await Permiso.findAll();
      const adminPermissions = await adminRole.getPermisos();
      if (adminPermissions.length !== allPermissions.length) {
        await adminRole.setPermisos(allPermissions);
        console.log('✅ Todos los permisos han sido asignados al rol "Admin".');
      } else {
        console.log('✅ El rol "Admin" ya tiene todos los permisos.');
      }
    }

    // --- Asignación de permisos por defecto a otros roles ---
    console.log('ℹ️  Asignando permisos por defecto a otros roles...');
    const defaultRolePermissions = {
      'Bodeguero': ['Gestionar Productos', 'Ver Historial', 'Ver Dashboard', 'Resolver Alertas'],
      'Encargado de inventario': ['Gestionar Productos', 'Gestionar Ubicaciones', 'Ver Historial', 'Ver Dashboard', 'Resolver Alertas'],
      'Vendedor independiente': ['Ver Dashboard'],
      'Lector': ['Ver Dashboard', 'Ver Historial']
    };

    const allRoles = await Role.findAll();
    const allPermissionsList = await Permiso.findAll(); // Renamed to avoid conflict

    for (const roleName in defaultRolePermissions) {
      const role = allRoles.find(r => r.nombre === roleName);
      if (role) {
        const currentPermissions = await role.getPermisos();
        if (currentPermissions.length === 0) {
          const permissionsToAssign = allPermissionsList.filter(p => defaultRolePermissions[roleName].includes(p.nombre));
          await role.setPermisos(permissionsToAssign);
          console.log(`✅ Permisos por defecto asignados al rol "${roleName}".`);
        } else {
          console.log(`✅ El rol "${roleName}" ya tiene permisos configurados, se omite la asignación por defecto.`);
        }
      }
    }



  } catch (error) {
    console.error('❌ Error al conectar o sincronizar la base de datos:', error);
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
  Alerta,
  Role,
  Permiso,
  RolePermiso, // <-- NUEVO
  Categoria,
  Ubicacion
};