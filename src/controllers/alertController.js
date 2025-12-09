// src/controllers/alertController.js

<<<<<<< HEAD
const { Alerta, Producto, Ubicacion } = require('../models');
=======
const { Alerta, Producto, Ubicacion } = require('../config/database');
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

// Función para obtener todas las alertas activas
exports.getActiveAlerts = async (req, res) => {
    try {
        const alerts = await Alerta.findAll({
            where: { activa: true },
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['id', 'nombre', 'cantidad', 'ubicacionId'],
                include: [{
                    model: Ubicacion,
                    as: 'ubicacion',
                    attributes: ['nombre']
                }]
            }],
            order: [['fechaGeneracion', 'DESC']]
        });
        res.json(alerts);
    } catch (error) {
        console.error('Error al obtener alertas activas:', error);
        res.status(500).json({ msg: 'Error al obtener alertas activas.', error: error.message });
    }
};

// Función para resolver una alerta (marcar como inactiva)
exports.resolveAlert = async (req, res) => {
    const { id } = req.params;
    try {
        const alert = await Alerta.findByPk(id);
        if (!alert) {
            return res.status(404).json({ msg: 'Alerta no encontrada.' });
        }
        alert.activa = false;
        alert.fechaResolucion = new Date();
        await alert.save();
        res.json({ msg: 'Alerta resuelta exitosamente.', alert });
    } catch (error) {
        console.error('Error al resolver alerta:', error);
        res.status(500).json({ msg: 'Error al resolver alerta.', error: error.message });
    }
};

// Función interna para crear o actualizar una alerta de bajo stock
// No es un endpoint REST, es llamada por otros controladores (ej. productController)
exports.checkAndCreateLowStockAlert = async (productoId, nombreProducto, currentQuantity, umbral) => {
    try {
        let alert = await Alerta.findOne({
            where: {
                productoId: productoId,
                tipo: 'bajo_stock',
                activa: true
            }
        });

        if (currentQuantity <= umbral) {
            const mensaje = `¡Alerta de Bajo Stock! El producto "${nombreProducto}" tiene ${currentQuantity} unidades, el umbral es ${umbral}.`;
            if (alert) {
                // Actualizar alerta existente
                alert.cantidadActual = currentQuantity;
                alert.umbral = umbral; // Por si el umbral cambia
                alert.mensaje = mensaje;
                alert.fechaGeneracion = new Date(); // Actualizar fecha de generación para que aparezca arriba
                await alert.save();
            } else {
                // Crear nueva alerta
                alert = await Alerta.create({
                    productoId,
                    nombreProducto,
                    tipo: 'bajo_stock',
                    umbral,
                    cantidadActual: currentQuantity,
                    mensaje,
                    activa: true
                });
            }
            console.warn(`Alerta de bajo stock generada/actualizada para el producto ${nombreProducto}.`);
        } else {
            // Si la cantidad supera el umbral, resolver la alerta existente (si hay una activa)
            if (alert) {
                alert.activa = false;
                alert.fechaResolucion = new Date();
                await alert.save();
                console.log(`Alerta de bajo stock resuelta para el producto ${nombreProducto}. Cantidad actual: ${currentQuantity}.`);
            }
        }
    } catch (error) {
        console.error(`Error al verificar/crear alerta de bajo stock para el producto ${nombreProducto}:`, error);
        throw error; // Propagar el error
    }
};
