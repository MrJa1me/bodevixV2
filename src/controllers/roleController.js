// src/controllers/roleController.js

const { Role, Permiso, RolePermiso } = require('../models');

// Obtener todos los roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: {
                model: Permiso,
                as: 'permisos',
                through: { attributes: [] } // No incluir atributos de la tabla de unión
            }
        });
        const allPermissions = await Permiso.findAll();
        res.json({ roles, permissions: allPermissions });
    } catch (error) {
        console.error("Error al obtener roles:", error);
        res.status(500).json({ msg: 'Error al obtener roles.' });
    }
};

// Obtener los permisos de un rol
exports.getRolePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const role = await Role.findByPk(roleId, {
            include: {
                model: Permiso,
                as: 'permisos',
                through: { attributes: [] } // No incluir atributos de la tabla de unión
            }
        });

        if (!role) {
            return res.status(404).json({ msg: 'Rol no encontrado.' });
        }

        const allPermissions = await Permiso.findAll();

        res.json({
            rolePermissions: role.permisos,
            allPermissions: allPermissions
        });
    } catch (error) {
        console.error("Error al obtener permisos del rol:", error);
        res.status(500).json({ msg: 'Error al obtener permisos del rol.' });
    }
};

// Actualizar los permisos de un rol
exports.updateRolePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { permissionIds } = req.body; // Se espera un array de IDs de permisos

        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ msg: 'Rol no encontrado.' });
        }

        // Sincronizar los permisos del rol
        await role.setPermisos(permissionIds);

        res.json({ msg: 'Permisos del rol actualizados correctamente.' });
    } catch (error) {
        console.error("Error al actualizar permisos del rol:", error);
        res.status(500).json({ msg: 'Error al actualizar permisos del rol.' });
    }
};
