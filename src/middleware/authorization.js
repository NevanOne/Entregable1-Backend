// Middleware de autorización para verificar el rol del usuario
const { userModel } = require('../models/user.model');

// Middleware para verificar roles

const checkRole = (roles) => {
    return async (req, res, next) => {
        const user = await userModel.findById(req.user.id); // `req.user` tiene que estar establecido correctamente en passport o JWT
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Acceso denegado, no tiene permisos para acceder a este recurso' });
        }
        next();
    };
};

// Bloque de codigo necesario en caso de no cargarse toda la información en la base de datos + sincrono.

// export const authorize = (roles) => {
//     return (req, res, next) => {
//         // Verificar si el usuario tiene un rol permitido para acceder al endpoint
//         if (req.user && roles.includes(req.user.role)) {
//             next(); // Permitir acceso al endpoint
//         } else {
//             res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' });
//         }
//     };
// };

module.exports = {
    checkRole
};