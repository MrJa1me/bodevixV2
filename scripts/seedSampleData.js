// scripts/seedSampleData.js
// Siembra de datos de ejemplo: ubicaciones (mínimo 3), categorías y al menos 10 productos

const { connectDB, sequelize } = require('../src/config/database');
const models = require('../src/models');

const { Ubicacion, Categoria, Producto } = models;

async function seedSampleData() {
  try {
    // Conectar y sincronizar (pasamos los modelos para el sembrado inicial si es necesario)
    await connectDB(models);

    console.log('ℹ️  Sembrando ubicaciones...');

    const ubicacionesData = [
      { nombre: 'Almacén Central', descripcion: 'Bodega principal' },
      { nombre: 'Sucursal Norte', descripcion: 'Sucursal ubicada al norte' },
      { nombre: 'Sucursal Sur', descripcion: 'Sucursal ubicada al sur' }
    ];

    const ubicaciones = {};
    for (const u of ubicacionesData) {
      const [ubic, created] = await Ubicacion.findOrCreate({ where: { nombre: u.nombre }, defaults: u });
      ubicaciones[ubic.nombre] = ubic;
      if (created) console.log(`➕ Ubicación '${ubic.nombre}' creada.`);
    }

    console.log('ℹ️  Sembrando categorías...');
    const categoriasData = [
      { nombre: 'Bebidas', descripcion: 'Refrescos, jugos y bebidas en general' },
      { nombre: 'Lácteos', descripcion: 'Leche, quesos y derivados' },
      { nombre: 'Abarrotes', descripcion: 'Productos secos y empaquetados' },
      { nombre: 'Limpieza', descripcion: 'Productos de aseo' }
    ];

    const categorias = {};
    for (const c of categoriasData) {
      const [cat, created] = await Categoria.findOrCreate({ where: { nombre: c.nombre }, defaults: c });
      categorias[cat.nombre] = cat;
      if (created) console.log(`➕ Categoría '${cat.nombre}' creada.`);
    }

    console.log('ℹ️  Sembrando productos (mínimo 10)...');

    // Lista de productos ejemplo: nombre, cantidad, precio, categoriaNombre, ubicacionNombre, umbral
    const productsData = [
      { nombre: 'Coca-Cola 1L', cantidad: 50, precio: 1200, categoria: 'Bebidas', ubicacion: 'Almacén Central', umbral: 5 },
      { nombre: 'Jugo Natura 1L', cantidad: 30, precio: 1500, categoria: 'Bebidas', ubicacion: 'Sucursal Norte', umbral: 5 },
      { nombre: 'Leche Entera 1L', cantidad: 40, precio: 950, categoria: 'Lácteos', ubicacion: 'Almacén Central', umbral: 10 },
      { nombre: 'Queso Chanco 250g', cantidad: 20, precio: 3200, categoria: 'Lácteos', ubicacion: 'Sucursal Sur', umbral: 3 },
      { nombre: 'Arroz 1kg', cantidad: 80, precio: 900, categoria: 'Abarrotes', ubicacion: 'Almacén Central', umbral: 20 },
      { nombre: 'Fideos 500g', cantidad: 100, precio: 650, categoria: 'Abarrotes', ubicacion: 'Sucursal Norte', umbral: 15 },
      { nombre: 'Detergente 1L', cantidad: 25, precio: 2200, categoria: 'Limpieza', ubicacion: 'Sucursal Sur', umbral: 5 },
      { nombre: 'Cloro 1L', cantidad: 35, precio: 800, categoria: 'Limpieza', ubicacion: 'Almacén Central', umbral: 5 },
      { nombre: 'Aceite vegetal 1L', cantidad: 45, precio: 2800, categoria: 'Abarrotes', ubicacion: 'Sucursal Sur', umbral: 8 },
      { nombre: 'Galletas Dulces 200g', cantidad: 60, precio: 700, categoria: 'Abarrotes', ubicacion: 'Sucursal Norte', umbral: 10 }
    ];

    for (const p of productsData) {
      try {
        const categoria = categorias[p.categoria];
        const ubicacion = ubicaciones[p.ubicacion];

        const prodDefaults = {
          cantidad: p.cantidad,
          precio: p.precio,
          categoriaId: categoria ? categoria.id : null,
          ubicacionId: ubicacion ? ubicacion.id : null,
          umbral: p.umbral || 0
        };

        const [prod, created] = await Producto.findOrCreate({
          where: { nombre: p.nombre },
          defaults: Object.assign({ nombre: p.nombre }, prodDefaults)
        });

        if (!created) {
          // Si ya existe, actualizamos algunos campos para asegurar consistencia
          await prod.update(prodDefaults);
          console.log(`🔄 Producto '${prod.nombre}' existente actualizado.`);
        } else {
          console.log(`➕ Producto '${prod.nombre}' creado.`);
        }
      } catch (err) {
        console.error(`❌ Error al crear/actualizar producto '${p.nombre}':`, err.message || err);
      }
    }

    console.log('✅ Siembra de datos de ejemplo completada.');

  } catch (error) {
    console.error('❌ Error en seedSampleData:', error);
  } finally {
    await sequelize.close();
    console.log('🔗 Conexión a la base de datos cerrada.');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedSampleData();
}

module.exports = { seedSampleData };
