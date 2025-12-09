// src/models/Usuario.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: { // Usaremos el username para el login
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Cada usuario debe tener un rol
      defaultValue: 5, // Asignar un rol por defecto (ej. Lector) para evitar errores en la sincronización
      // La referencia se definirá en database.js
    },
    // Campos para la Tarea "Mejora registros" (si necesitamos saber quién creó el usuario)
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    // Opciones del modelo (Sequelize)
    tableName: 'Usuarios',
    timestamps: false // Si quieres controlar manualmente la fecha de creación/actualización
  });
  
  return Usuario;
};