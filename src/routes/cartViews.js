// routes/cartsViews.js

const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Ruta para visualizar un carrito específico con sus productos
router.get('/:cartId', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.render('carts/show', { cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
