const express = require('express');
const router = express.Router();
const Message = require('../dao/models/messageModel');

// Ruta para enviar mensajes directamente desde el cliente
router.post('/api/sendMessage', async (req, res) => {
  const { user, message } = req.body;

  try {
    // Guardar el mensaje en la colección "messages"
    await Message.create({ user, message });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al enviar el mensaje', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
