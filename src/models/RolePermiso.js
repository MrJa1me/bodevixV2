// src/models/RolePermiso.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolePermiso = sequelize.define('RolePermiso', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles', // Nombre de la tabla de Roles
        key: 'id'
      }
    },
    permisoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Permisos', // Nombre de la tabla de Permisos
        key: 'id'
      }
    }
  }, {
    tableName: 'RolePermiso',
    timestamps: true, // O false si no las necesitas
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'permisoId']
      }
    ]
  });

  return RolePermiso;
};
