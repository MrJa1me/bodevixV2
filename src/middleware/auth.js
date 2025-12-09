// src/middleware/auth.js

<<<<<<< HEAD
const { Usuario, Role, Permiso, RolePermiso } = require('../models');
=======
const { Usuario, Role } = require('../config/database');
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

// Middleware 1: Carga el usuario basado en la cabecera X-User
exports.loadUser = async (req, res, next) => {
    const username = req.header('X-User');
    if (!username) {
<<<<<<< HEAD
=======
        // En lugar de un error, podríamos permitir peticiones "anónimas"
        // pero para mantener la lógica de permisos, exigiremos el usuario.
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
        return res.status(401).json({ msg: 'Acceso denegado. Falta la cabecera X-User.' });
    }

    try {
        const user = await Usuario.findOne({ 
            where: { username },
            include: [{
                model: Role,
<<<<<<< HEAD
                as: 'role',
                include: [{
                    model: Permiso,
                    as: 'permisos',
                    through: { attributes: [] } // No traer datos de la tabla intermedia
                }]
=======
                as: 'role', // 'as' debe coincidir con el alias definido en la asociación
                attributes: ['id', 'nombre'] // Ahora necesitamos el ID y el nombre del rol
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
            }]
        });
        if (!user) {
            return res.status(401).json({ msg: `Usuario '${username}' no encontrado.` });
        }
        
<<<<<<< HEAD
=======
        // Adjuntamos el objeto de usuario completo a la solicitud.
        // Ahora req.user incluirá req.user.role.nombre
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
        req.user = user; 
        next(); 
    } catch (err) {
        console.error('Error en loadUser middleware:', err);
        res.status(500).json({ msg: 'Error interno al verificar el usuario.' });
    }
};

<<<<<<< HEAD
// Middleware 2: Verifica el rol (puede seguir siendo útil para accesos generales)
=======
// Middleware 2: Verifica el rol
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
exports.checkRole = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req, res, next) => {
<<<<<<< HEAD
        if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role.nombre)) {
            return res.status(403).json({ msg: 'Acceso denegado. Rol insuficiente.' });
        }
        next();
    };
};

// Middleware 3: Verifica un permiso específico
exports.checkPermission = (permissionNameOrArray) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ msg: 'Acceso denegado. Rol de usuario no identificado.' });
        }

        const roleId = req.user.role.id;

        try {
            const permissionsToCheck = Array.isArray(permissionNameOrArray) ? permissionNameOrArray : [permissionNameOrArray];

            // Buscar permisos existentes por nombre
            const permisos = await Permiso.findAll({ where: { nombre: permissionsToCheck } });
            if (!permisos || permisos.length === 0) {
                console.error(`Error de autorización: Ninguno de los permisos solicitados existe en la base de datos.`);
                return res.status(500).json({ msg: 'Error interno del servidor al verificar permisos.' });
            }

            // Verificamos si alguna de las opciones está asociada al rol
            const permisoIds = permisos.map(p => p.id);

            const roleHasAny = await RolePermiso.findOne({
                where: {
                    roleId,
                    permisoId: permisoIds
                }
            });

            if (roleHasAny) return next();

            return res.status(403).json({ msg: `Acceso denegado. Se requiere uno de los permisos: ${permissionsToCheck.join(', ')}.` });
        } catch (err) {
            console.error('Error en checkPermission middleware:', err);
            return res.status(500).json({ msg: 'Error interno al verificar permisos.' });
        }
    };
=======
        // req.user es establecido por el middleware loadUser
        // Ahora req.user.role.nombre contendrá el nombre del rol
        if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role.nombre)) {
            return res.status(403).json({ msg: 'Acceso denegado. Permiso insuficiente.' });
        }
        next();
    };
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
};