// src/models/Ubicacion.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ubicacion = sequelize.define('Ubicacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Los nombres de las ubicaciones deben ser únicos
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Ubicaciones',
    timestamps: false
  });

  return Ubicacion;
};
