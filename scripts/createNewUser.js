// scripts/createNewUser.js

const { connectDB, Usuario, Role, sequelize } = require('../src/config/database');

async function createNewUser(username, roleName) {
    try {
        await connectDB(); // Asegúrate de que la conexión y los modelos estén sincronizados

        // Buscar el roleId basado en el nombre del rol
        const role = await Role.findOne({
            where: { nombre: roleName }
        });

        if (!role) {
            console.log(`❌ El rol '${roleName}' no existe.`);
            return;
        }

        // Crear el nuevo usuario
        const newUser = await Usuario.create({
            username: username,
            roleId: role.id // Asigna el ID del rol encontrado
            // Nota: Si tu modelo de Usuario tiene un campo de contraseña, deberías agregarlo aquí.
            // Por ejemplo: password: 'tu_contraseña_segura' (después de hashearla)
        });

        console.log(`✅ Usuario '${newUser.username}' creado con el rol '${role.nombre}' y ID: ${newUser.id}`);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error(`❌ Error: El username '${username}' ya existe.`);
        } else {
            console.error('❌ Error al crear el nuevo usuario:', error);
        }
    } finally {
        await sequelize.close();
        console.log('🔗 Conexión a la base de datos cerrada.');
    }
}

// --- Cómo usar este script ---
// 1. Reemplaza 'nuevoUsername' con el nombre de usuario deseado.
// 2. Reemplaza 'NombreDelRol' con uno de los roles existentes (ej. 'Admin', 'Lector', 'Bodeguero').
// 3. Guarda este archivo como, por ejemplo, 'createNewUser.js' en la raíz de tu proyecto.
// 4. Ejecútalo desde tu terminal con: node scripts/createNewUser.js

// Llama a la función para ejecutar la creación del usuario
createNewUser('admin', 'Admin'); 
