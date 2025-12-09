// scripts/seedPermissions.js

// Lista de permisos que queremos asegurar que existan en la BD
const permisosBase = [
    { nombre: 'Ver Dashboard', descripcion: 'Permite visualizar el dashboard principal.' },
    { nombre: 'Gestionar Productos', descripcion: 'Permite crear, editar y eliminar productos.' },
    { nombre: 'Sacar Productos', descripcion: 'Permite registrar salidas/parciales de cantidad de productos sin eliminar el registro.' },
    { nombre: 'Gestionar Usuarios', descripcion: 'Permite crear, editar y eliminar usuarios y sus roles.' },
    { nombre: 'Gestionar Roles', descripcion: 'Permite ver y asignar permisos a los roles.' },
    { nombre: 'Gestionar Ubicaciones', descripcion: 'Permite administrar las ubicaciones del inventario.' },
    { nombre: 'Ver Historial', descripcion: 'Permite ver el historial de movimientos de inventario.' },
    { nombre: 'Resolver Alertas', descripcion: 'Permite marcar las alertas de stock como resueltas.' },
    { nombre: 'Añadir Stock', descripcion: 'Permite añadir stock a productos existentes (vista simplificada).' }
];

async function seedPermissions(Permiso) {
    if (!Permiso) {
        throw new Error("El modelo 'Permiso' no fue proporcionado a seedPermissions.");
    }
    try {
        console.log('ℹ️  Sembrando permisos base...');
        for (const permisoData of permisosBase) {
            const [permiso, created] = await Permiso.findOrCreate({
                where: { nombre: permisoData.nombre },
                defaults: permisoData
            });

            if (created) {
                console.log(`➕ Permiso '${permiso.nombre}' creado.`);
            }
        }
        console.log('✅ Siembra de permisos completada.');
    } catch (error) {
        console.error('❌ Error al sembrar los permisos:', error);
        // No cerramos la conexión aquí para que la app principal pueda seguir usándola
    }
}

// Exportamos la función para que pueda ser llamada desde otros archivos
module.exports = { seedPermissions };
