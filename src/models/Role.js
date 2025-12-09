// src/models/Role.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Los nombres de los roles deben ser únicos
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true // Descripción opcional del rol
    }
  }, {
    tableName: 'Roles', // Nombre de la tabla en la base de datos
    timestamps: false // No necesitamos timestamps para los roles por ahora
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.Permiso, {
<<<<<<< HEAD
      through: 'RolePermiso',
=======
      through: 'RolePermisos',
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
      as: 'permisos',
      foreignKey: 'roleId'
    });
  };

  return Role;
};
