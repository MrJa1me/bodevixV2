// src/controllers/permisoController.js
const { Permiso } = require('../models');

/**
 * @description Obtiene todos los permisos de la base de datos.
 * @param {*} req Request object
 * @param {*} res Response object
 */
exports.getAllPermisos = async (req, res) => {
    try {
        const permisos = await Permiso.findAll({
            order: [['nombre', 'ASC']] // Ordena los permisos alfabéticamente por nombre
        });
        res.json(permisos);
    } catch (error) {
        console.error('Error al obtener los permisos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener permisos.' });
    }
};
