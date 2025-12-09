// scripts/seedHistorialMovements.js
// Genera movimientos de historial (entradas, salidas, ajustes) para productos existentes

const { sequelize } = require('../src/config/database');
const models = require('../src/models');
const { Usuario, Producto, Historial } = models;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedMovements(count = 30) {
  try {
    await sequelize.authenticate();
    console.log('Conexión a DB establecida. Preparando movimientos de historial...');

    // traer usuarios (incluyendo su role) y productos activos
    const usuarios = await Usuario.findAll({ include: ['role'] });
    const productos = await Producto.findAll({ where: { activo: true } });

    if (!usuarios || usuarios.length === 0) {
      console.error('No se encontraron usuarios en la base de datos. Ejecuta primero un seed de usuarios.');
      return;
    }
    if (!productos || productos.length === 0) {
      console.error('No se encontraron productos activos en la base de datos. Ejecuta primero un seed de productos.');
      return;
    }

    // Filtrar usuarios que pueden generar movimientos (excluimos 'Lector')
    const movementRoles = new Set(['Admin', 'Bodeguero', 'Encargado de inventario', 'Vendedor independiente']);
    const actores = usuarios.filter(u => u.role && movementRoles.has(u.role.nombre));
    if (actores.length === 0) {
      console.error('No hay usuarios con roles permitidos para crear movimientos (Admin/Bodeguero/Encargado/Vendedor).');
      return;
    }

    const actions = ['entrada', 'salida', 'ajuste de stock'];

    let created = 0;
    for (let i = 0; i < count; i++) {
      const actor = actores[randInt(0, actores.length - 1)];
      const producto = productos[randInt(0, productos.length - 1)];

      // reload producto to get latest cantidad
      await producto.reload();
      const cantidadAnterior = Number(producto.cantidad || 0);

      // elegir acción con probabilidad (más entradas/ajustes para simular variations)
      const action = actions[randInt(0, actions.length - 1)];

      let cantidadNueva = cantidadAnterior;
      let detallesDesc = '';

      if (action === 'entrada') {
        const delta = randInt(1, 30);
        cantidadNueva = cantidadAnterior + delta;
        detallesDesc = `${actor.username} (${actor.role.nombre}) añadió ${delta} unidades a '${producto.nombre}'.`;
        // persistir cambio en producto
        producto.cantidad = cantidadNueva;
        producto.usuarioUltimaEdicionId = actor.id;
        producto.fechaUltimaEdicion = new Date();
        await producto.save();
      } else if (action === 'salida') {
        const maxRemove = Math.max(1, Math.min(20, cantidadAnterior));
        if (maxRemove <= 0) {
          // nada que remover, hacemos un ajuste en su lugar
          const newVal = randInt(0, 50);
          cantidadNueva = newVal;
          detallesDesc = `${actor.username} (${actor.role.nombre}) ajustó stock a ${newVal} en '${producto.nombre}' (no había stock para salida).`;
          producto.cantidad = cantidadNueva;
          producto.usuarioUltimaEdicionId = actor.id;
          producto.fechaUltimaEdicion = new Date();
          await producto.save();
        } else {
          const delta = randInt(1, maxRemove);
          cantidadNueva = cantidadAnterior - delta;
          detallesDesc = `${actor.username} (${actor.role.nombre}) removió ${delta} unidades de '${producto.nombre}'.`;
          producto.cantidad = cantidadNueva;
          producto.usuarioUltimaEdicionId = actor.id;
          producto.fechaUltimaEdicion = new Date();
          await producto.save();
        }
      } else if (action === 'ajuste de stock') {
        const newVal = randInt(0, Math.max(50, cantidadAnterior + 30));
        cantidadNueva = newVal;
        detallesDesc = `${actor.username} (${actor.role.nombre}) ajustó stock a ${newVal} unidades para '${producto.nombre}'.`;
        producto.cantidad = cantidadNueva;
        producto.usuarioUltimaEdicionId = actor.id;
        producto.fechaUltimaEdicion = new Date();
        await producto.save();
      }

      // crear registro en Historial
      try {
        await Historial.create({
          accion: action,
          cantidad_anterior: cantidadAnterior,
          cantidad_nueva: cantidadNueva,
          detalles: {
            descripcion: detallesDesc,
            producto: producto.toJSON(),
            actor: { id: actor.id, username: actor.username, role: actor.role ? actor.role.nombre : null }
          },
          usuarioId: actor.id,
          productoId: producto.id,
          fecha: new Date()
        });
        created++;
      } catch (hErr) {
        console.warn('Error creando historial:', hErr.message || hErr);
      }
    }

    console.log(`✅ Movimientos generados: ${created}`);
  } catch (err) {
    console.error('Error en seedHistorialMovements:', err.message || err);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
}

if (require.main === module) {
  // Por defecto generamos 30 movimientos
  seedMovements(30);
}

module.exports = { seedMovements };