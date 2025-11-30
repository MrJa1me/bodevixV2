// src/models/Producto.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    precio: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.0 },
    categoriaId: { // Clave foránea para el modelo Categoria
      type: DataTypes.INTEGER,
      allowNull: true, // Puede ser nulo si no se asigna una categoría
      // La referencia se definirá en database.js
    },
    ubicacionId: { // Clave foránea para el modelo Ubicacion
      type: DataTypes.INTEGER,
      allowNull: true, // Puede ser nulo si no se asigna una ubicación
      // La referencia se definirá en database.js
    },
    umbral: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    // --- Campos para Trazabilidad (Mejora Registros - Talla M) ---
    // ID del usuario que realizó el último cambio
    usuarioUltimaEdicionId: {
      type: DataTypes.INTEGER,
      // La referencia del modelo se establece al definir las asociaciones
    },
    fechaUltimaEdicion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Productos',
    timestamps: false // Usaremos nuestros propios campos de fecha
  });

  return Producto;
};