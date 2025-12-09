// src/middleware/auth.js

const { Usuario, Role, Permiso, RolePermiso } = require('../config/database');

// Middleware 1: Carga el usuario basado en la cabecera X-User
exports.loadUser = async (req, res, next) => {
    const username = req.header('X-User');
    if (!username) {
        return res.status(401).json({ msg: 'Acceso denegado. Falta la cabecera X-User.' });
    }

    try {
        const user = await Usuario.findOne({ 
            where: { username },
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'nombre']
            }]
        });
        if (!user) {
            return res.status(401).json({ msg: `Usuario '${username}' no encontrado.` });
        }
        
        req.user = user; 
        next(); 
    } catch (err) {
        console.error('Error en loadUser middleware:', err);
        res.status(500).json({ msg: 'Error interno al verificar el usuario.' });
    }
};

// Middleware 2: Verifica el rol (puede seguir siendo útil para accesos generales)
exports.checkRole = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req, res, next) => {
        if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role.nombre)) {
            return res.status(403).json({ msg: 'Acceso denegado. Rol insuficiente.' });
        }
        next();
    };
};

// Middleware 3: Verifica un permiso específico
exports.checkPermission = (permissionName) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ msg: 'Acceso denegado. Rol de usuario no identificado.' });
        }

        const roleId = req.user.role.id;

        try {
            // 1. Encontrar el ID del permiso por su nombre
            const permiso = await Permiso.findOne({ where: { nombre: permissionName } });
            if (!permiso) {
                console.error(`Error de autorización: El permiso '${permissionName}' no existe en la base de datos.`);
                return res.status(500).json({ msg: 'Error interno del servidor al verificar permisos.' });
            }
            const permisoId = permiso.id;

            // 2. Verificar si existe la asociación en RolePermiso
            const roleHasPermission = await RolePermiso.findOne({
                where: {
                    roleId: roleId,
                    permisoId: permisoId
                }
            });

            if (roleHasPermission) {
                return next(); // El rol tiene el permiso, continuar
            } else {
                return res.status(403).json({ msg: `Acceso denegado. Se requiere el permiso '${permissionName}'.` });
            }
        } catch (err) {
            console.error('Error en checkPermission middleware:', err);
            return res.status(500).json({ msg: 'Error interno al verificar permisos.' });
        }
    };
};