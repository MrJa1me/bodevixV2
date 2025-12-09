// scripts/assignCreators.js
// Asigna `usuarioCreadorId` a productos que no lo tienen, usando un usuario Admin existente

const { sequelize } = require('../src/config/database');
const models = require('../src/models');
const { Producto, Usuario, Role } = models;

async function assignCreators() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a DB establecida (sin sincronizar).');

    // Buscar rol Admin
    const adminRole = await Role.findOne({ where: { nombre: 'Admin' } });
    if (!adminRole) {
      console.error('No existe un rol Admin en la base de datos. Ejecuta el seed inicial primero.');
      process.exit(1);
    }

    // Buscar un usuario Admin
    let adminUser = await Usuario.findOne({ where: { roleId: adminRole.id } });
    if (!adminUser) {
      console.log('No se encontró un usuario Admin; creando usuario "admin" de respaldo.');
      adminUser = await Usuario.create({ username: 'admin', roleId: adminRole.id });
    }

    // Buscar productos sin usuarioCreadorId
    const productos = await Producto.findAll({ where: { usuarioCreadorId: null } });
    if (!productos || productos.length === 0) {
      console.log('No se encontraron productos sin creador. Nada que hacer.');
      await sequelize.close();
      return;
    }

    console.log(`Se encontraron ${productos.length} productos sin creador. Asignando a usuario Admin id=${adminUser.id} (${adminUser.username}).`);

    for (const p of productos) {
      p.usuarioCreadorId = adminUser.id;
      await p.save();
      console.log(`- Producto '${p.nombre}' actualizado (creador=${adminUser.username}).`);
    }

    console.log('Asignación de creadores completada.');
  } catch (err) {
    console.error('Error en assignCreators:', err.message || err);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
}

if (require.main === module) {
  assignCreators();
}

module.exports = { assignCreators };