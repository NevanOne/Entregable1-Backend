const passport = require('passport');
const jwt = require('jsonwebtoken');
const { userModel } = require('./models/user.model');
const { createHash, isValidPassword } = require('../utils/hashBcrypt');

// Función para generar un token JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
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

// Middleware de autenticación para proteger rutas
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
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
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Función de inicio de sesión de usuario
async function loginUser(req, res) {
  passport.authenticate('login', async (err, user) => {
    try {
      if (err || !user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const token = generateToken(user);
        return res.json({ token });
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  })(req, res);
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
  logoutUser
};
