const express = require('express');
const router = express.Router();
const Cart = require('../db/models/cartModel');
const Product = require('../db/models/productModel'); 

// Ruta para eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter((product) => product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para actualizar el carrito con un array de productos
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', message: 'Carrito actualizado', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para actualizar la cantidad de ejemplares del producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex((product) => product.product.toString() === pid);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Cantidad del producto actualizada en el carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    await Cart.findByIdAndUpdate(cid, { products: [] });

    res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para vistas de carrito
router.get('/views/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

//CartsRouter
const cartsRouter = express.Router();

cartsRouter.get('/:cid', (req, res) => {
    res.json({ message: `Obtener los productos del carrito con ID ${req.params.cid}` });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    res.json({ message: `Agregar el producto con ID ${req.params.pid} al carrito con ID ${req.params.cid}` });
});

app.use('/api/carts', cartsRouter);

// Ruta para la vista que lista los productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { /* datos para la vista si es necesario */ });
});

module.exports = router;
