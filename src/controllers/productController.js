// src/controllers/productController.js

const { Producto, Historial, Categoria, Ubicacion } = require('../config/database');
const { checkAndCreateLowStockAlert } = require('./alertController');

// Obtener todos los productos (READ)
exports.getAllProducts = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'Error de autenticación: Token no válido o no proporcionado.' });
    }
    try {
        const productos = await Producto.findAll({
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
            if (!productoExistente) {
                return res.status(404).json({ msg: `Producto con nombre "${nombre}" no encontrado.` });
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
        
        const nuevoProducto = await Producto.create({
            nombre,
            cantidad,
            precio,
            categoriaId,
            ubicacionId,
            umbral: umbral !== undefined ? umbral : 0,
            usuarioUltimaEdicionId: req.user.id
        });

        await Historial.create({
            accion: 'creación',
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
            if (Object.keys(newData).length > 1 || !newData.hasOwnProperty('cantidad')) {
                return res.status(403).json({ msg: 'Los bodegueros solo pueden modificar la cantidad del producto.' });
            }
            newData = { cantidad: newData.cantidad }; 
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

        if (userRole === 'Encargado de inventario') {
            const validReasons = ['venta', 'vencimiento', 'dañado', 'otro'];
            if (!reason || !validReasons.includes(reason)) {
                return res.status(400).json({ msg: 'Razón de eliminación inválida o faltante. Las razones válidas son: venta, vencimiento, dañado, otro.' });
            }
            if (reason === 'otro' && (!additionalDetails || additionalDetails.trim() === '')) {
                return res.status(400).json({ msg: 'Debe proporcionar detalles adicionales cuando la razón es "otro".' });
            }
        }

        await productoAEliminar.destroy();

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
            accion: 'eliminación',
            detalles: detallesHistorial,
            usuarioId: req.user.id,
            productoId: id
        });
        
        res.json({ msg: 'Producto eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar producto.', error: error.message });
    }
};