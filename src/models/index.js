// src/models/index.js

const { sequelize } = require('../config/database');

// 1. Importar todos los creadores de modelos
const models = {
  Producto: require('./Producto')(sequelize),
  Usuario: require('./Usuario')(sequelize),
  Historial: require('./Historial')(sequelize),
  Alerta: require('./Alerta')(sequelize),
  Role: require('./Role')(sequelize),
  Permiso: require('./Permiso')(sequelize),
  RolePermiso: require('./RolePermiso')(sequelize),
  Categoria: require('./Categoria')(sequelize),
  Ubicacion: require('./Ubicacion')(sequelize),
};

// 2. Definir las asociaciones entre modelos
const { Producto, Usuario, Historial, Alerta, Role, Permiso, RolePermiso, Categoria, Ubicacion } = models;

Producto.belongsTo(Usuario, { foreignKey: 'usuarioUltimaEdicionId', as: 'editor' });
// Asociacion para saber quién creó el producto originalmente
Producto.belongsTo(Usuario, { foreignKey: 'usuarioCreadorId', as: 'creador' });
Producto.hasMany(Historial, { foreignKey: 'productoId', as: 'historial', onDelete: 'SET NULL' });
Producto.hasMany(Alerta, { foreignKey: 'productoId', as: 'alertas', onDelete: 'CASCADE' });
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
Producto.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });

Usuario.hasMany(Historial, { foreignKey: 'usuarioId', as: 'actividades' });
Usuario.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// Asociaciones de Role y Permiso
Role.hasMany(Usuario, { foreignKey: 'roleId', as: 'usuarios' });
Role.belongsToMany(Permiso, { through: RolePermiso, as: 'permisos', foreignKey: 'roleId' });
Permiso.belongsToMany(Role, { through: RolePermiso, as: 'roles', foreignKey: 'permisoId' });

// Asociaciones directas con la tabla de unión (RolePermiso)
Role.hasMany(RolePermiso, { foreignKey: 'roleId' });
Permiso.hasMany(RolePermiso, { foreignKey: 'permisoId' });
RolePermiso.belongsTo(Role, { foreignKey: 'roleId' });
RolePermiso.belongsTo(Permiso, { foreignKey: 'permisoId', as: 'permiso' });

Historial.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Historial.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto', onDelete: 'SET NULL' });

Alerta.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto', onDelete: 'CASCADE' });

Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' });
Ubicacion.hasMany(Producto, { foreignKey: 'ubicacionId', as: 'productos' });


// 3. Exportar todos los modelos para ser utilizados en otras partes de la aplicación
module.exports = models;
