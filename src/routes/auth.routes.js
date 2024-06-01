// Protección de rutas

const express = require('express');
const { createUser } = require('../controllers/users.controller');
const { checkRole } = require('../middleware/authorization');

const router = express.Router();

router.post('/register', createUser);
router.get('/admin', checkRole(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin' });
});

module.exports = router;
