// routes/viewsRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware para verificar la autenticación del usuario
const authenticateUser = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Página de inicio
router.get('/', authenticateUser, (req, res) => {
  res.render('index', { user: req.session.user });
});

// Página de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Página de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

// Página de perfil de usuario
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('profile', { user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
