const express = require('express');
const app = express();
const ProductManager = require('./productManager');

// Ruta al archivo de persistencia de productos
const filePath = 'products.json';

// Crear una instancia de ProductManager con persistencia de archivos
const products = new ProductManager(filePath);

// Middleware para verificar si hay al menos 10 productos
const verificarProductos = (req, res, next) => {
  if (products.getProducts().length >= 10) {
    next();
  } else {
    res.status(500).json({ error: 'No hay suficientes productos creados' });
  }
};

// Ruta para obtener todos los productos
app.get('/products', verificarProductos, (req, res) => {
  const limit = parseInt(req.query.limit);
  const allProducts = products.getProducts();

  if (limit) {
    res.json(allProducts.slice(0, limit));
  } else {
    res.json(allProducts);
  }
});

// Ruta para obtener un producto por ID
app.get('/products/:id', verificarProductos, (req, res) => {
  const productId = parseInt(req.params.id);
  const foundProduct = products.getProductById(productId);

  if (foundProduct) {
    res.json(foundProduct);
  } else {
    res.status(404).json({ error: 'El producto no existe' });
  }
});

// Iniciar el servidor en el puerto 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
