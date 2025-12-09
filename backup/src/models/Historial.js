// src/models/Historial.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Historial = sequelize.define('Historial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    // Acción realizada. Ej: "creacion", "edicion", "eliminacion", "entrada", "salida"
    accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad_anterior: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    cantidad_nueva: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    // Detalles adicionales en formato JSON para flexibilidad
    detalles: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    // ID del usuario que realizó la acción
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // ID del producto afectado (si aplica)
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Puede ser una acción no ligada a un producto
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Historial',
    timestamps: false // Usamos nuestro propio campo de fecha
  });

  return Historial;
};
