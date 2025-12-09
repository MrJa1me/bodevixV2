// scripts/seedUsersAndProducts.js
// Crea roles/permiso (vía connectDB), crea usuarios (máx 5) y siembra ubicaciones, categorías y productos
// Además asigna `usuarioCreadorId` a cada producto (round-robin entre los usuarios creados)

const { connectDB, sequelize } = require('../src/config/database');
const models = require('../src/models');
const { Usuario, Role, Producto, Ubicacion, Categoria, Historial } = models;

async function seedAll() {
  try {
    // connectDB sincroniza la base y siembra permisos/roles por defecto
    await connectDB(models);

    console.log('✅ Base inicial (roles/permiso) lista. Continuando con usuarios y datos.');

    // Roles que queremos crear usuarios para
    const desiredRoles = [
      'Admin',
      'Bodeguero',
      'Encargado de inventario',
      'Vendedor independiente',
      'Lector'
    ];

    // Crear/obtener usuarios (max 5) con nombres legibles
    const users = [];
    const usernameMap = {
      'Admin': 'admin',
      'Bodeguero': 'juan',
      'Encargado de inventario': 'ana',
      'Vendedor independiente': 'maria',
      'Lector': 'lector'
    };

    for (const roleName of desiredRoles) {
      const role = await Role.findOne({ where: { nombre: roleName } });
      if (!role) {
        console.warn(`⚠️ Rol '${roleName}' no encontrado. Omitiendo usuario para este rol.`);
        continue;
      }

      const username = usernameMap[roleName] || (roleName === 'Admin' ? 'admin' : roleName.toLowerCase().replace(/[^a-z0-9]+/g, '') + '1');

      const [user, created] = await Usuario.findOrCreate({
        where: { username },
        defaults: { username, roleId: role.id }
      });

      if (!created && user.roleId !== role.id) {
        user.roleId = role.id;
        await user.save();
      }

      users.push(user);
      console.log(`${created ? '➕' : '🔁'} Usuario '${user.username}' (rol: ${roleName})`);

      if (users.length >= 5) break;
    }

    if (users.length === 0) {
      throw new Error('No se crearon usuarios. Asegúrate que los roles estén presentes.');
    }

    // Sembrado de ubicaciones
    const ubicacionesData = [
      { nombre: 'Almacén Central', descripcion: 'Bodega principal' },
      { nombre: 'Sucursal Norte', descripcion: 'Sucursal ubicada al norte' },
      { nombre: 'Sucursal Sur', descripcion: 'Sucursal ubicada al sur' }
    ];

    const ubicMap = {};
    for (const u of ubicacionesData) {
      const [ubic, created] = await Ubicacion.findOrCreate({ where: { nombre: u.nombre }, defaults: u });
      ubicMap[ubic.nombre] = ubic;
      if (created) console.log(`➕ Ubicación '${ubic.nombre}' creada.`);
    }

    // Sembrado de categorías
    const categoriasData = [
      { nombre: 'Bebidas', descripcion: 'Refrescos, jugos y bebidas en general' },
      { nombre: 'Lácteos', descripcion: 'Leche, quesos y derivados' },
      { nombre: 'Abarrotes', descripcion: 'Productos secos y empaquetados' },
      { nombre: 'Limpieza', descripcion: 'Productos de aseo' }
    ];

    const catMap = {};
    for (const c of categoriasData) {
      const [cat, created] = await Categoria.findOrCreate({ where: { nombre: c.nombre }, defaults: c });
      catMap[cat.nombre] = cat;
      if (created) console.log(`➕ Categoría '${cat.nombre}' creada.`);
    }

    // Productos de ejemplo
    const productsData = [
      { nombre: 'Coca-Cola 1L', cantidad: 50, precio: 1200, categoria: 'Bebidas', ubicacion: 'Almacén Central', umbral: 5 },
      { nombre: 'Jugo Natura 1L', cantidad: 30, precio: 1500, categoria: 'Bebidas', ubicacion: 'Sucursal Norte', umbral: 5 },
      { nombre: 'Leche Entera 1L', cantidad: 40, precio: 950, categoria: 'Lácteos', ubicacion: 'Almacén Central', umbral: 10 },
      { nombre: 'Queso Chanco 250g', cantidad: 20, precio: 3200, categoria: 'Lácteos', ubicacion: 'Sucursal Sur', umbral: 3 },
      { nombre: 'Arroz 1kg', cantidad: 80, precio: 900, categoria: 'Abarrotes', ubicacion: 'Almacén Central', umbral: 20 },
      { nombre: 'Fideos 500g', cantidad: 100, precio: 650, categoria: 'Abarrotes', ubicacion: 'Sucursal Norte', umbral: 15 },
      { nombre: 'Detergente 1L', cantidad: 25, precio: 2200, categoria: 'Limpieza', ubicacion: 'Sucursal Sur', umbral: 5 },
      { nombre: 'Cloro 1L', cantidad: 35, precio: 800, categoria: 'Almacén Central', ubicacion: 'Almacén Central', umbral: 5 },
      { nombre: 'Aceite vegetal 1L', cantidad: 45, precio: 2800, categoria: 'Abarrotes', ubicacion: 'Sucursal Sur', umbral: 8 },
      { nombre: 'Galletas Dulces 200g', cantidad: 60, precio: 700, categoria: 'Abarrotes', ubicacion: 'Sucursal Norte', umbral: 10 }
    ];

    // Crear productos y asignar usuarioCreadorId round-robin
    let idx = 0;
    for (const p of productsData) {
      try {
        const categoria = catMap[p.categoria] || null;
        const ubicacion = ubicMap[p.ubicacion] || null;

        const creador = users[idx % users.length];
        idx++;

        const defaults = {
          cantidad: p.cantidad,
          precio: p.precio,
          categoriaId: categoria ? categoria.id : null,
          ubicacionId: ubicacion ? ubicacion.id : null,
          umbral: p.umbral || 0,
          usuarioCreadorId: creador.id,
          usuarioUltimaEdicionId: creador.id
        };

        const [prod, created] = await Producto.findOrCreate({
          where: { nombre: p.nombre },
          defaults: Object.assign({ nombre: p.nombre }, defaults)
        });

        if (!created) {
          // Actualizar para asegurar creador y otros campos
          await prod.update(defaults);
          console.log(`🔄 Producto '${prod.nombre}' actualizado (creador=${creador.username}).`);

          // Registrar en historial que fue actualizado por el script
          try {
            await Historial.create({
              accion: 'edicion',
              cantidad_anterior: null,
              cantidad_nueva: prod.cantidad,
              detalles: {
                descripcion: `Seed: Producto '${prod.nombre}' actualizado por script.`,
                producto: prod.toJSON(),
                creador: { id: creador.id, username: creador.username }
              },
              usuarioId: creador.id,
              productoId: prod.id
            });
          } catch (hErr) {
            console.warn('No se pudo crear historial para producto actualizado:', hErr.message || hErr);
          }
        } else {
          console.log(`➕ Producto '${prod.nombre}' creado (creador=${creador.username}).`);
          // Registrar creación en historial
          try {
            await Historial.create({
              accion: 'creacion',
              cantidad_anterior: 0,
              cantidad_nueva: prod.cantidad,
              detalles: {
                descripcion: `Seed: Producto '${prod.nombre}' creado por script.`,
                producto: prod.toJSON(),
                creador: { id: creador.id, username: creador.username }
              },
              usuarioId: creador.id,
              productoId: prod.id
            });
          } catch (hErr) {
            console.warn('No se pudo crear historial para producto creado:', hErr.message || hErr);
          }
        }
      } catch (err) {
        console.error(`❌ Error creando/actualizando producto '${p.nombre}':`, err.message || err);
      }
    }

    console.log('✅ Siembra completa: usuarios, ubicaciones, categorías y productos.');
  } catch (err) {
    console.error('❌ Error en seedUsersAndProducts:', err.message || err);
  } finally {
    await sequelize.close();
    console.log('🔗 Conexión cerrada.');
  }
}

if (require.main === module) {
  seedAll();
}

module.exports = { seedAll };