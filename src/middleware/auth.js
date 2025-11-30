// src/middleware/auth.js

const { Usuario, Role } = require('../config/database');

// Middleware 1: Carga el usuario basado en la cabecera X-User
exports.loadUser = async (req, res, next) => {
    const username = req.header('X-User');
    if (!username) {
        // En lugar de un error, podríamos permitir peticiones "anónimas"
        // pero para mantener la lógica de permisos, exigiremos el usuario.
        return res.status(401).json({ msg: 'Acceso denegado. Falta la cabecera X-User.' });
    }

    try {
        const user = await Usuario.findOne({ 
            where: { username },
            include: [{
                model: Role,
                as: 'role', // 'as' debe coincidir con el alias definido en la asociación
                attributes: ['id', 'nombre'] // Ahora necesitamos el ID y el nombre del rol
            }]
        });
        if (!user) {
            return res.status(401).json({ msg: `Usuario '${username}' no encontrado.` });
        }
        
        // Adjuntamos el objeto de usuario completo a la solicitud.
        // Ahora req.user incluirá req.user.role.nombre
        req.user = user; 
        next(); 
    } catch (err) {
        console.error('Error en loadUser middleware:', err);
        res.status(500).json({ msg: 'Error interno al verificar el usuario.' });
    }
};

// Middleware 2: Verifica el rol
exports.checkRole = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req, res, next) => {
        // req.user es establecido por el middleware loadUser
        // Ahora req.user.role.nombre contendrá el nombre del rol
        if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role.nombre)) {
            return res.status(403).json({ msg: 'Acceso denegado. Permiso insuficiente.' });
        }
        next();
    };
};