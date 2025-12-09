// src/controllers/historialController.js

<<<<<<< HEAD
const { Historial, Usuario, Producto } = require('../models');
=======
const { Historial, Usuario, Producto } = require('../config/database');
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

// Obtener todo el historial de acciones (READ)
exports.getHistory = async (req, res) => {
    // Verificación de Autenticación
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'Error de autenticación: Se requiere iniciar sesión.' });
    }

    try {
        const historial = await Historial.findAll({
            order: [['fecha', 'DESC']], // Ordenar por fecha más reciente primero
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['username'] // Solo queremos el nombre de usuario
                },
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['nombre'] // Solo queremos el nombre del producto
                }
            ]
        });

        // Mapear el resultado para que sea más amigable para el frontend
        const formattedHistory = historial.map(entry => {
            let cantidadAfectadaDisplay = null;

            switch (entry.accion) {
                case 'creacion':
                    cantidadAfectadaDisplay = entry.cantidad_nueva;
                    break;
                case 'entrada':
                    if (entry.cantidad_nueva !== null && entry.cantidad_anterior !== null) {
                        cantidadAfectadaDisplay = entry.cantidad_nueva - entry.cantidad_anterior;
                    } else if (entry.cantidad_nueva !== null) {
                        cantidadAfectadaDisplay = entry.cantidad_nueva; // Asume que la cantidad nueva es la entrada inicial si no hay anterior
                    }
                    break;
                case 'salida':
                    if (entry.cantidad_anterior !== null && entry.cantidad_nueva !== null) {
                        cantidadAfectadaDisplay = entry.cantidad_anterior - entry.cantidad_nueva;
                    } else if (entry.cantidad_anterior !== null) {
                        cantidadAfectadaDisplay = entry.cantidad_anterior; // Asume que toda la cantidad anterior salió si no hay nueva
                    }
                    break;
                case 'edicion':
                    if (entry.cantidad_anterior !== null && entry.cantidad_nueva !== null) {
                        cantidadAfectadaDisplay = Math.abs(entry.cantidad_nueva - entry.cantidad_anterior);
                    }
                    break;
                case 'eliminacion':
                    cantidadAfectadaDisplay = entry.cantidad_anterior; // Asume que toda la cantidad anterior fue eliminada
                    break;
                default:
                    // Para otras acciones, si solo tenemos cantidad_nueva o cantidad_anterior, la usamos como fallback
                    if (entry.cantidad_nueva !== null) {
                        cantidadAfectadaDisplay = entry.cantidad_nueva;
                    } else if (entry.cantidad_anterior !== null) {
                        cantidadAfectadaDisplay = entry.cantidad_anterior;
                    }
                    break;
            }

            return {
                id: entry.id,
                accion: entry.accion,
                cantidad_anterior: entry.cantidad_anterior,
                cantidad_nueva: entry.cantidad_nueva,
                fecha: entry.fecha,
                usuario: entry.usuario ? entry.usuario.username : 'N/A',
                producto: entry.producto ? entry.producto.nombre : 'N/A',
                productoId: entry.productoId,
                detalles: entry.detalles,
                cantidad_afectada: cantidadAfectadaDisplay 
            };
        });

        res.json(formattedHistory);
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        res.status(500).json({ msg: 'Error al obtener el historial.', error: error.message });
    }
};
