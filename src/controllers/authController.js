// src/controllers/authController.js

const { Usuario, Role } = require('../config/database'); // Importar Role también para futuras referencias si se necesita validar el roleId

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

// Devuelve información del usuario "logueado" a través de la cabecera X-User
// (req.user es agregado por el middleware 'loadUser')
exports.me = async (req, res) => {
  // El middleware loadUser ya ha puesto el usuario en req.user
  if (!req.user) {
    return res.status(401).json({ msg: 'No autenticado. Utiliza la cabecera X-User.' });
  }
  
  // Devuelve la información del usuario que se encontró
  res.json({ 
    id: req.user.id, 
    username: req.user.username, 
    role: req.user.role ? req.user.role.nombre : 'No asignado' // Asumiendo que role está cargado
  });
};