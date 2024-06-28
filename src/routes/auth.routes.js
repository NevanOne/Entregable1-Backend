const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../middleware/authentication');
const { checkRole } = require('../middleware/authorization');
const passport = require('passport');

const router = express.Router();

// Ruta para registro de usuario
router.post('/register', registerUser);

// Ruta para inicio de sesión de usuario
router.post('/login', loginUser);

// Ruta para cierre de sesión de usuario
router.post('/logout', logoutUser);

// Ruta protegida para administradores
router.get('/admin', checkRole(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin' });
});

router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    }
);
module.exports = router;
