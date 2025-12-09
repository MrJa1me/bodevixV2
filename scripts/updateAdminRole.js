// scripts/updateAdminRole.js

const { connectDB, sequelize } = require('../src/config/database');
const { Usuario } = require('../src/models');

async function updateRoleToAdmin(usernameToUpdate) {
    try {
        await connectDB(); // Asegúrate de que la conexión y los modelos estén sincronizados

        const user = await Usuario.findOne({
            where: { username: usernameToUpdate }
        });

        if (!user) {
            console.log(`❌ Usuario con username '${usernameToUpdate}' no encontrado.`);
            return;
        }

        // El roleId para 'Admin' es 1
        await user.update({ roleId: 1 });
        console.log(`✅ El usuario '${user.username}' ha sido actualizado al rol 'Admin'.`);

    } catch (error) {
        console.error('❌ Error al actualizar el rol del usuario:', error);
    } finally {
        await sequelize.close();
        console.log('🔗 Conexión a la base de datos cerrada.');
    }
}

// --- Cómo usar este script ---
// 1. Reemplaza 'nombreDeUsuarioExistente' con el username real del usuario que quieres hacer Admin.
// 2. Guarda este archivo como, por ejemplo, 'updateAdminRole.js' en la raíz de tu proyecto.
// 3. Ejecútalo desde tu terminal con: node scripts/updateAdminRole.js

// Llama a la función para ejecutar la actualización
updateRoleToAdmin('admin'); 
