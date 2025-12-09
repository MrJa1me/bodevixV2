const { Usuario, Role, RolePermiso, Permiso } = require('../config/database');

// Tarea 1: Registro (para crear usuarios de prueba)
// Se ha simplificado para no usar contraseñas.
exports.register = async (req, res) => {
  const { username, roleId } = req.body;
  
  if (!username || !roleId) {
    return res.status(400).json({ msg: 'Se requieren "username" y "roleId".' });
  }

  try {
    // Verificar si el roleId existe
    const role = await Role.findByPk(roleId);
    if (!role) {
        return res.status(400).json({ msg: `El roleId ${roleId} no existe.` });
    }

    const nuevoUsuario = await Usuario.create({
      username,
      roleId: roleId
    });

    res.status(201).json({ 
      msg: `Usuario '${nuevoUsuario.username}' creado con roleId '${nuevoUsuario.roleId}'.`,
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ msg: `El usuario '${username}' ya existe.` });
    }
    res.status(500).json({ msg: 'Error al registrar el usuario.' });
  }
};

// Devuelve información del usuario "logueado" y sus permisos
exports.me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'No autenticado. Utiliza la cabecera X-User.' });
  }

  let permissions = [];
  // Si el usuario tiene un rol, buscamos sus permisos
  if (req.user.role && req.user.role.id) {
    try {
      const rolePermissions = await RolePermiso.findAll({
        where: { roleId: req.user.role.id },
        include: [{ model: Permiso, attributes: ['nombre'] }]
      });
      // Extraemos solo los nombres de los permisos
      permissions = rolePermissions.map(rp => rp.Permiso.nombre);
    } catch (error) {
      console.error("Error al obtener los permisos del rol:", error);
      // Opcional: podrías devolver un 500 aquí si los permisos son críticos
    }
  }
  
  // Devuelve la información del usuario incluyendo sus permisos
  res.json({ 
    id: req.user.id, 
    username: req.user.username, 
    role: req.user.role ? req.user.role.nombre : 'No asignado',
    permissions: permissions // Array con los nombres de los permisos
  });
};