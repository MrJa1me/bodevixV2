// src/controllers/userController.js

const { Usuario, Role } = require('../models');

// Obtener todos los usuarios (SOLO ADMIN)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll({
            attributes: ['id', 'username', 'fechaCreacion'],
            include: [{
                model: Role,
                as: 'role',
                attributes: ['nombre']
            }]
        });
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ msg: 'Error interno al obtener usuarios.' });
    }
};

// Actualizar un usuario (SOLO ADMIN)
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, roleId } = req.body;

    try {
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        // Si se proporciona un roleId, validar que el rol exista
        if (roleId !== undefined) {
            const role = await Role.findByPk(roleId);
            if (!role) {
                return res.status(400).json({ msg: `El roleId '${roleId}' no corresponde a un rol válido.` });
            }
            user.roleId = roleId;
        }

        // Actualizar solo los campos que vienen en el body
        user.username = username || user.username;

        await user.save();

        res.json({ msg: 'Usuario actualizado exitosamente.', user });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ msg: 'Error interno al actualizar usuario.' });
    }
};

// Eliminar un usuario (SOLO ADMIN)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        await user.destroy();

        res.json({ msg: `Usuario '${user.username}' eliminado exitosamente.` });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ msg: 'Error interno al eliminar usuario.' });
    }
};

// Crear un nuevo usuario (SOLO ADMIN)
exports.createUser = async (req, res) => {
  const { username, roleId } = req.body;

  if (!username || roleId === undefined) {
    return res.status(400).json({ msg: 'Se requieren "username" y "roleId".' });
  }

  try {
    // Validar que el roleId corresponda a un rol existente
    const role = await Role.findByPk(roleId);
    if (!role) {
        return res.status(400).json({ msg: `El roleId '${roleId}' no corresponde a un rol válido.` });
    }

    const nuevoUsuario = await Usuario.create({
      username,
      roleId,
    });

    // Devolvemos el usuario creado
    const userResponse = {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        roleId: nuevoUsuario.roleId,
        fechaCreacion: nuevoUsuario.fechaCreacion
    };

    res.status(201).json({ 
      msg: `Usuario '${nuevoUsuario.username}' creado con rol ID '${nuevoUsuario.roleId}'.`,
      user: userResponse
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ msg: `El usuario '${username}' ya existe.` });
    }
    console.error('Error al crear usuario:', error);
    res.status(500).json({ msg: 'Error interno al crear el usuario.' });
  }
};
