const express = require('express');
const { authenticateToken, requireAuth, requireAdmin } = require('../middleware/authentication'); // Asegúrate de ajustar la ruta a tu middleware
const Product = require('../dao/productManager'); 
const router = express.Router();

// Ruta protegida que requiere autenticación
router.get('/protected', authenticateToken, requireAuth, (req, res) => {
  res.send('This is a protected route');
});

// Ruta para agregar productos, protegida para administradores
router.post('/admin/product', authenticateToken, requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error adding product: ' + error.message });
  }
});

// Ruta para eliminar productos, protegida para administradores
router.delete('/admin/product/:id', authenticateToken, requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product: ' + error.message });
  }
});



module.exports = router;

