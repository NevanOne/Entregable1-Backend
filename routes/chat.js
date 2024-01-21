const express = require('express');
const router = express.Router();
const Message = require('../dao/models/messageModel');

// Ruta para la vista de chat
router.get('/chat', async (req, res) => {
  try {
    // Obtener todos los mensajes de la colección "messages"
    const messages = await Message.find();
    res.render('chat', { messages });
  } catch (error) {
    console.error('Error al obtener mensajes', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para enviar mensajes desde el formulario
router.post('/send-message', async (req, res) => {
  const { user, message } = req.body;

  try {
    // Guardar el mensaje en la colección "messages"
    await Message.create({ user, message });
    res.redirect('/chat'); // Redirigir de vuelta a la vista de chat
  } catch (error) {
    console.error('Error al enviar el mensaje', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
