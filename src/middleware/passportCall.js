import passport from "passport";

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, token, info) {
            if (err) return next(err);
            if (!token) return res.status(401).json({ status: 'error', error: info.message ? info.message : info.toString() });
            
            // Extrae el usuario del token, si es necesario
            const user = extractUserFromToken(token);
            if (!user) return res.status(401).json({ status: 'error', error: 'Token inválido' });

            // Asigna el usuario al objeto req.user
            req.user = user;
            next();
        })(req, res, next);
    };
};

// Función para extraer el usuario del token
const extractUserFromToken = (token) => {
    try {
        // Verifica y decodifica el token JWT
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // Extrae la información del usuario del token decodificado
        const { id, email } = decodedToken;
        return { id, email };
    } catch (error) {
        // En caso de error (token inválido o expirado), retorna null
        return null;
    }
};