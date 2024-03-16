// Middleware de autorización para verificar el rol del usuario
export const authorize = (roles) => {
    return (req, res, next) => {
        // Verificar si el usuario tiene un rol permitido para acceder al endpoint
        if (req.user && roles.includes(req.user.role)) {
            next(); // Permitir acceso al endpoint
        } else {
            res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' });
        }
    };
};