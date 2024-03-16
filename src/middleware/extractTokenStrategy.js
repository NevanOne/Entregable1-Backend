import passport from "passport";

// Middleware para extraer el token de la solicitud y adjuntarlo a req.user
export const extractTokenStrategy = () => {
    return async (req, res, next) => {
        passport.authenticate('jwt', { session: false }, function (err, token, info) {
            if (err) return next(err);
            if (!token) return res.status(401).json({ status: 'error', error: info.message ? info.message : info.toString() });
            
            // Adjuntar el token al objeto req.user
            req.user = token;
            next();
        })(req, res, next);
    };
};
