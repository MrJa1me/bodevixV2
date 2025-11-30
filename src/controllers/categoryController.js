// src/controllers/categoryController.js

const { Categoria } = require('../config/database');

// Middleware de verificación de rol para funciones de administrador
const checkAdminRole = (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role.nombre !== 'Admin') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }
    next();
};

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Categoria.findAll();
        res.json(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ msg: 'Error interno al obtener categorías.' });
    }
};

// Crear una nueva categoría
exports.createCategory = [checkAdminRole, async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre de la categoría es requerido.' });
    }
    try {
        const newCategory = await Categoria.create({ nombre, descripcion });
        res.status(201).json({ msg: 'Categoría creada exitosamente.', category: newCategory });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: `La categoría '${nombre}' ya existe.` });
        }
        console.error('Error al crear categoría:', error);
        res.status(500).json({ msg: 'Error interno al crear la categoría.' });
    }
}];

// Actualizar una categoría
exports.updateCategory = [checkAdminRole, async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        const category = await Categoria.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Categoría no encontrada.' });
        }
        category.nombre = nombre || category.nombre;
        category.descripcion = descripcion !== undefined ? descripcion : category.descripcion;
        await category.save();
        res.json({ msg: 'Categoría actualizada exitosamente.', category });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: `La categoría '${nombre}' ya existe.` });
        }
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ msg: 'Error interno al actualizar la categoría.' });
    }
}];

// Eliminar una categoría
exports.deleteCategory = [checkAdminRole, async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Categoria.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Categoría no encontrada.' });
        }
        await category.destroy();
        res.json({ msg: `Categoría '${category.nombre}' eliminada exitosamente.` });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ msg: 'Error interno al eliminar la categoría.' });
    }
}];;
