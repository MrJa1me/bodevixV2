// src/models/Alerta.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alerta = sequelize.define('Alerta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombreProducto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING, // Ej: 'bajo_stock', 'expiracion'
      allowNull: false,
    },
    umbral: {
      type: DataTypes.INTEGER, // Cantidad mínima para bajo stock
      allowNull: false,
    },
    cantidadActual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fechaGeneracion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fechaResolucion: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'Alertas',
    timestamps: false
  });

  return Alerta;
};
