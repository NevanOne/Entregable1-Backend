const passport = require('passport');
const local = require('passport-local');
const { userModel } = require('./models/user.model');
const { createHash, isValidPassword } = require('../utils/hashBcrypt');
const jwt = require('jsonwebtoken');

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, email, password, done) => {
        const { first_name, last_name } = req.body;
        try {
            let user = await userModel.findOne({ email });
            if (user) return done(null, false);

            let newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password)
            };
            let result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findOne({ _id: id });
        done(null, user);
    });

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                console.log('Usuario no encontrado');
                return done(null, false);
            }
            if (!isValidPassword(password, user.password)) {
                console.log('Contraseña inválida');
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};

// Función para generar un token JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
    initializePassport,
    generateToken,
    authenticateToken
};
