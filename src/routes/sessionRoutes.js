const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { userModel } = require('../db/models/user.model');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new userModel({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Inicio de sesión de usuario
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user) => {
    try {
      if (err || !user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  })(req, res);
});

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

// Obtener el usuario actual
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
