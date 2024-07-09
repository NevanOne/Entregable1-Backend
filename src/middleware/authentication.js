const passport = require('passport');
const jwt = require('jsonwebtoken');
const { userModel } = require('../db/models/user.model');
const { createHash, isValidPassword } = require('../utils/hashBcrypt');
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local').Strategy;
dotenv.config(); // Cargar variables de entorno
console.log(process.env.JWT_SECRET_KEY); 

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

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        console.log('Usuario no encontrado');
        return done(null, false);
      }
      
      const isMatch = await isValidPassword(password, user.password); // Aquí se pasa solo la contraseña
      if (!isMatch) {
        console.log('Contraseña inválida');
        return done(null, false);
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Error en autenticación:', error);
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
};

// Función para generar un token JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
}

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware de autenticación para proteger rutas
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Middleware para verificar si el usuario es administrador
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
}

// Función de registro de usuario  
async function registerUser(req, res) {
  const { first_name, last_name, email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ message: 'El correo ya existe' });

    let newUser = {
      first_name,
      last_name,
      email,
      password: createHash(password)
    };
    let result = await userModel.create(newUser);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Función de inicio de sesión de usuario
async function loginUser(req, res, next) {
  console.log('Inicia loginUser');
  passport.authenticate('login', async (err, user) => {
    console.log('Dentro de passport.authenticate');
    try {
      if (err) {
        console.error('Error en passport.authenticate:', err);
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!user) {
        console.log('Usuario no encontrado');
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) {
          console.error('Error en req.login:', error);
          return next(error);
        }
        console.log('Usuario autenticado');
        const token = generateToken(user);
        return res.json({ token });
      });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  })(req, res, next);
  console.log('Llega acá?');
}

// Función de cierre de sesión de usuario
function logoutUser(req, res) {
  req.logout();
  res.json({ message: 'Logout successful' });
}

module.exports = {
  generateToken,
  authenticateToken,
  requireAuth,
  registerUser,
  loginUser,
  logoutUser,
  requireAdmin,
  initializePassport,
};
