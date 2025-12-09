// src/controllers/locationController.js

<<<<<<< HEAD
const { Ubicacion } = require('../models');
=======
const { Ubicacion } = require('../config/database');

// Middleware de verificación de rol para funciones de administrador
const checkAdminRole = (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role.nombre !== 'Admin') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }
    next();
};
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

// Obtener todas las ubicaciones
exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Ubicacion.findAll();
        res.json(locations);
    } catch (error) {
        console.error('Error al obtener ubicaciones:', error);
        res.status(500).json({ msg: 'Error interno al obtener ubicaciones.' });
    }
};

// Crear una nueva ubicación
<<<<<<< HEAD
exports.createLocation = async (req, res) => {
=======
exports.createLocation = [checkAdminRole, async (req, res) => {
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
    const { nombre, descripcion } = req.body;
    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre de la ubicación es requerido.' });
    }
    try {
        const newLocation = await Ubicacion.create({ nombre, descripcion });
        res.status(201).json({ msg: 'Ubicación creada exitosamente.', location: newLocation });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: `La ubicación '${nombre}' ya existe.` });
        }
        console.error('Error al crear ubicación:', error);
        res.status(500).json({ msg: 'Error interno al crear la ubicación.' });
    }
<<<<<<< HEAD
};

// Actualizar una ubicación
exports.updateLocation = async (req, res) => {
=======
}];

// Actualizar una ubicación
exports.updateLocation = [checkAdminRole, async (req, res) => {
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        const location = await Ubicacion.findByPk(id);
        if (!location) {
            return res.status(404).json({ msg: 'Ubicación no encontrada.' });
        }
        location.nombre = nombre || location.nombre;
        location.descripcion = descripcion !== undefined ? descripcion : location.descripcion;
        await location.save();
        res.json({ msg: 'Ubicación actualizada exitosamente.', location });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: `La ubicación '${nombre}' ya existe.` });
        }
        console.error('Error al actualizar ubicación:', error);
        res.status(500).json({ msg: 'Error interno al actualizar la ubicación.' });
    }
<<<<<<< HEAD
};

// Eliminar una ubicación
exports.deleteLocation = async (req, res) => {
=======
}];

// Eliminar una ubicación
exports.deleteLocation = [checkAdminRole, async (req, res) => {
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
    const { id } = req.params;
    try {
        const location = await Ubicacion.findByPk(id);
        if (!location) {
            return res.status(404).json({ msg: 'Ubicación no encontrada.' });
        }
        await location.destroy();
        res.json({ msg: `Ubicación '${location.nombre}' eliminada exitosamente.` });
    } catch (error) {
        console.error('Error al eliminar ubicación:', error);
        res.status(500).json({ msg: 'Error interno al eliminar la ubicación.' });
    }
<<<<<<< HEAD
};
=======
}];
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
