// src/controllers/productController.js

const { Producto, Historial, Categoria, Ubicacion, Usuario } = require('../models');
const { checkAndCreateLowStockAlert } = require('./alertController');

// Obtener todos los productos (READ)
exports.getAllProducts = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'Error de autenticación: Token no válido o no proporcionado.' });
    }
    try {
        const productos = await Producto.findAll({
            where: { activo: true },
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Ubicacion, as: 'ubicacion' }
            ]
        });
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ msg: 'Error al obtener productos.' });
    }
};

// Crear un nuevo producto (CREATE)
exports.createProduct = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'Error de autenticación: Token no válido o no proporcionado.' });
    }
    const { nombre, cantidad, precio, categoria: categoriaValue, ubicacion: ubicacionValue, umbral } = req.body;
    const userRole = req.user.role ? req.user.role.nombre : null;

    try {
        if (userRole === 'Bodeguero') {
            const productoExistente = await Producto.findOne({ where: { nombre } });
            if (!productoExistente || !productoExistente.activo) {
                return res.status(404).json({ msg: `Producto con nombre "${nombre}" no encontrado o inactivo.` });
            }
            // Only allow bodegueros to modify products originally created by an Admin
            if (productoExistente.usuarioCreadorId) {
                const creador = await Usuario.findByPk(productoExistente.usuarioCreadorId, { include: ['role'] });
                if (!creador || !creador.role || creador.role.nombre !== 'Admin') {
                    return res.status(403).json({ msg: 'Solo se puede operar sobre productos creados por un Admin.' });
                }
            } else {
                return res.status(403).json({ msg: 'Producto sin creador registrado. Solo Admin puede operar.' });
            }
            const cantidadAnterior = productoExistente.cantidad;
            productoExistente.cantidad += cantidad;
            await productoExistente.save();

            await Historial.create({
                accion: 'ajuste de stock',
                cantidad_anterior: cantidadAnterior,
                cantidad_nueva: productoExistente.cantidad,
                detalles: { 
                    descripcion: `Stock del producto "${nombre}" actualizado por Bodeguero.`,
                    producto: productoExistente.toJSON() 
                },
                usuarioId: req.user.id,
                productoId: productoExistente.id
            });

            await checkAndCreateLowStockAlert(
                productoExistente.id,
                productoExistente.nombre,
                productoExistente.cantidad,
                productoExistente.umbral
            );

            return res.status(200).json(productoExistente);
        }

        let categoriaId = null;
        if (categoriaValue) {
            const [categoria] = await Categoria.findOrCreate({
                where: { nombre: categoriaValue },
                defaults: { nombre: categoriaValue }
            });
            categoriaId = categoria.id;
        }

        let ubicacionId = null;
        if (ubicacionValue) {
            const [ubicacion] = await Ubicacion.findOrCreate({
                where: { nombre: ubicacionValue },
                defaults: { nombre: ubicacionValue }
            });
            ubicacionId = ubicacion.id;
        }

        // Si existe un producto (incluso inactivo) con el mismo nombre, manejamos reactivación
        const productoExistente = await Producto.findOne({ where: { nombre } });
        if (productoExistente) {
            if (productoExistente.activo) {
                return res.status(409).json({ msg: `El producto '${nombre}' ya existe.` });
            }

            // Only Admin can reactivate products
            if (userRole !== 'Admin') {
                return res.status(403).json({ msg: 'Solo Admin puede reactivar productos.' });
            }

            // Reactivar y actualizar con los nuevos datos
            productoExistente.cantidad = cantidad;
            productoExistente.precio = precio;
            productoExistente.categoriaId = categoriaId;
            productoExistente.ubicacionId = ubicacionId;
            productoExistente.umbral = umbral !== undefined ? umbral : productoExistente.umbral;
            productoExistente.activo = true;
            // If no creator registered, set current user as creator
            if (!productoExistente.usuarioCreadorId) productoExistente.usuarioCreadorId = req.user.id;
            productoExistente.usuarioUltimaEdicionId = req.user.id;
            productoExistente.fechaUltimaEdicion = new Date();
            await productoExistente.save();

            await Historial.create({
                accion: 'reactivacion',
                cantidad_anterior: null,
                cantidad_nueva: productoExistente.cantidad,
                detalles: {
                    descripcion: `Producto "${nombre}" reactivado y actualizado.`,
                    producto: productoExistente.toJSON()
                },
                usuarioId: req.user.id,
                productoId: productoExistente.id
            });

            await checkAndCreateLowStockAlert(
                productoExistente.id,
                productoExistente.nombre,
                productoExistente.cantidad,
                productoExistente.umbral
            );

            return res.status(200).json(productoExistente);
        }

        if (userRole !== 'Admin') {
            return res.status(403).json({ msg: 'Solo Admin puede crear nuevos productos.' });
        }

        const nuevoProducto = await Producto.create({
            nombre,
            cantidad,
            precio,
            categoriaId,
            ubicacionId,
            umbral: umbral !== undefined ? umbral : 0,
            usuarioUltimaEdicionId: req.user.id,
            usuarioCreadorId: req.user.id
        });

        await Historial.create({
            accion: 'creacion',
            cantidad_anterior: 0,
            cantidad_nueva: nuevoProducto.cantidad,
            detalles: { 
                descripcion: `Producto "${nombre}" creado.`,
                producto: nuevoProducto.toJSON() 
            },
            usuarioId: req.user.id,
            productoId: nuevoProducto.id
        });

        await checkAndCreateLowStockAlert(
            nuevoProducto.id,
            nuevoProducto.nombre,
            nuevoProducto.cantidad,
            nuevoProducto.umbral
        );

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ msg: 'Error al crear producto.', error: error.message });
    }
};

// Actualizar un producto (UPDATE)
exports.updateProduct = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'Error de autenticación: Token no válido o no proporcionado.' });
    }
    const { id } = req.params;
    let newData = req.body;
    const userRole = req.user.role ? req.user.role.nombre : null;

    try {
        const productoAnterior = await Producto.findByPk(id);
        if (!productoAnterior) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }
        const datosAnteriores = productoAnterior.toJSON();

        if (userRole === 'Bodeguero') {
            // Ensure product was created by an Admin
            if (productoAnterior.usuarioCreadorId) {
                const creador = await Usuario.findByPk(productoAnterior.usuarioCreadorId, { include: ['role'] });
                if (!creador || !creador.role || creador.role.nombre !== 'Admin') {
                    return res.status(403).json({ msg: 'Los bodegueros solo pueden operar sobre productos creados por Admin.' });
                }
            } else {
                return res.status(403).json({ msg: 'Producto sin creador registrado. Solo Admin puede operar.' });
            }
            if (Object.keys(newData).length > 1 || !newData.hasOwnProperty('cantidad')) {
                return res.status(403).json({ msg: 'Los bodegueros solo pueden modificar la cantidad del producto.' });
            }
            newData = { cantidad: newData.cantidad }; 
        }

        // If a non-admin role is trying to update other fields, ensure product was created by Admin
        if (userRole !== 'Admin' && userRole !== 'Bodeguero') {
            if (productoAnterior.usuarioCreadorId) {
                const creador = await Usuario.findByPk(productoAnterior.usuarioCreadorId, { include: ['role'] });
                if (!creador || !creador.role || creador.role.nombre !== 'Admin') {
                    return res.status(403).json({ msg: 'Solo se puede operar sobre productos creados por Admin.' });
                }
            } else {
                return res.status(403).json({ msg: 'Producto sin creador registrado. Solo Admin puede operar.' });
            }
        }

        const categoriaValue = newData.categoria || newData.categoriaId;
        if (categoriaValue !== undefined) {
            const [categoria] = await Categoria.findOrCreate({
                where: { nombre: categoriaValue },
                defaults: { nombre: categoriaValue }
            });
            newData.categoriaId = categoria.id;
        }
        delete newData.categoria;

        const ubicacionValue = newData.ubicacion || newData.ubicacionId;
        if (ubicacionValue !== undefined) {
            const [ubicacion] = await Ubicacion.findOrCreate({
                where: { nombre: ubicacionValue },
                defaults: { nombre: ubicacionValue }
            });
            newData.ubicacionId = ubicacion.id;
        }
        delete newData.ubicacion;
        
        const [updatedRows] = await Producto.update({
            ...newData,
            usuarioUltimaEdicionId: req.user.id,
            fechaUltimaEdicion: new Date()
        }, {
            where: { id }
        });

        if (updatedRows > 0) {
            const esCambioDeCantidad = newData.cantidad !== undefined && Number(newData.cantidad) !== datosAnteriores.cantidad;
            
            await Historial.create({
                accion: esCambioDeCantidad ? 'ajuste de stock' : 'edición',
                cantidad_anterior: esCambioDeCantidad ? datosAnteriores.cantidad : null,
                cantidad_nueva: esCambioDeCantidad ? newData.cantidad : null,
                detalles: {
                    descripcion: `Producto ID ${id} actualizado.`,
                    datosAnteriores,
                    datosNuevos: newData
                },
                usuarioId: req.user.id,
                productoId: id
            });

            if (esCambioDeCantidad) {
                const productoActualizado = await Producto.findByPk(id);
                await checkAndCreateLowStockAlert(
                    productoActualizado.id,
                    productoActualizado.nombre,
                    productoActualizado.cantidad,
                    productoActualizado.umbral
                );
            }
        }

        res.json({ msg: 'Producto actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ msg: 'Error al actualizar producto.', error: error.message });
    }
};

// Eliminar un producto (DELETE)
exports.deleteProduct = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'Error de autenticación: Token no válido o no proporcionado.' });
    }
    const { id } = req.params;
    const { reason, additionalDetails } = req.body;
    const userRole = req.user.role ? req.user.role.nombre : null;

    try {
        const productoAEliminar = await Producto.findByPk(id);
        if (!productoAEliminar) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }

            // Si quien solicita la acción NO es Admin, tratamos la petición como una salida parcial:
            // debe especificarse 'cantidad' y 'reason' en el body. Solo Admin puede realizar la eliminación (soft-delete).
            if (userRole !== 'Admin') {
                // Ensure product was created by Admin
                if (productoAEliminar.usuarioCreadorId) {
                    const creador = await Usuario.findByPk(productoAEliminar.usuarioCreadorId, { include: ['role'] });
                    if (!creador || !creador.role || creador.role.nombre !== 'Admin') {
                        return res.status(403).json({ msg: 'Solo se puede registrar salidas en productos creados por Admin.' });
                    }
                } else {
                    return res.status(403).json({ msg: 'Producto sin creador registrado. Solo Admin puede operar.' });
                }
                const { cantidad } = req.body;
                const validReasons = ['venta', 'vencimiento', 'dañado', 'otro'];
                if (!reason || !validReasons.includes(reason)) {
                    return res.status(400).json({ msg: 'Razón de salida inválida o faltante. Las razones válidas son: venta, vencimiento, dañado, otro.' });
                }
                if (reason === 'otro' && (!additionalDetails || additionalDetails.trim() === '')) {
                    return res.status(400).json({ msg: 'Debe proporcionar detalles adicionales cuando la razón es "otro".' });
                }
                const qtyToRemove = parseInt(cantidad, 10);
                if (!qtyToRemove || qtyToRemove <= 0) {
                    return res.status(400).json({ msg: 'Debe especificar una cantidad válida a remover.' });
                }
                if (qtyToRemove > productoAEliminar.cantidad) {
                    return res.status(400).json({ msg: 'La cantidad a remover no puede ser mayor a la cantidad disponible.' });
                }

                const cantidadAnterior = productoAEliminar.cantidad;
                productoAEliminar.cantidad = productoAEliminar.cantidad - qtyToRemove;
                productoAEliminar.usuarioUltimaEdicionId = req.user.id;
                productoAEliminar.fechaUltimaEdicion = new Date();
                await productoAEliminar.save();

                const detallesHistorial = {
                    descripcion: `Salida de ${qtyToRemove} unidades por '${reason}' en Producto "${productoAEliminar.nombre}".`,
                    producto: productoAEliminar.toJSON(),
                    razonEliminacion: reason,
                    detallesAdicionalesEliminacion: additionalDetails || null,
                    cantidad_eliminada: qtyToRemove
                };

                await Historial.create({
                    accion: 'salida',
                    cantidad_anterior: cantidadAnterior,
                    cantidad_nueva: productoAEliminar.cantidad,
                    detalles: detallesHistorial,
                    usuarioId: req.user.id,
                    productoId: id
                });

                // Comprobar alertas de stock
                await checkAndCreateLowStockAlert(
                    productoAEliminar.id,
                    productoAEliminar.nombre,
                    productoAEliminar.cantidad,
                    productoAEliminar.umbral
                );

                return res.json({ msg: `Salida registrada. Cantidad restante: ${productoAEliminar.cantidad}` });
            }

            // Si es Admin (u otro rol con 'Gestionar Productos'), se realiza eliminación (soft-delete)
            const detallesHistorial = { 
                descripcion: `Producto "${productoAEliminar.nombre}" eliminado.`,
                producto: productoAEliminar.toJSON() 
            };

            if (userRole === 'Encargado de inventario') {
                detallesHistorial.razonEliminacion = reason;
                if (reason === 'otro') {
                    detallesHistorial.detallesAdicionalesEliminacion = additionalDetails;
                }
            }

            await Historial.create({
                accion: 'eliminacion',
                detalles: detallesHistorial,
                usuarioId: req.user.id,
                productoId: id
            });

            productoAEliminar.activo = false;
            productoAEliminar.usuarioUltimaEdicionId = req.user.id;
            productoAEliminar.fechaUltimaEdicion = new Date();
            await productoAEliminar.save();

            res.json({ msg: 'Producto eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar producto.', error: error.message });
    }
};