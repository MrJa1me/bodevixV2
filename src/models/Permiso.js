// src/models/Permiso.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Permiso = sequelize.define('Permiso', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
      }
  }, {
    tableName: 'Permisos',
    timestamps: false
  });

  return Permiso;
};
