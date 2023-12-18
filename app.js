const express = require('express');
const app = express();

// Mock de datos de productos
const productos = [
  { id: 1, nombre: 'Producto 1' },
  { id: 2, nombre: 'Producto 2' },
  { id: 3, nombre: 'Producto 3' },
  { id: 4, nombre: 'Producto 4' },
  { id: 5, nombre: 'Producto 5' },
  { id: 6, nombre: 'Producto 6' },
  { id: 7, nombre: 'Producto 7' },
  { id: 8, nombre: 'Producto 8' },
  { id: 9, nombre: 'Producto 9' },
  { id: 10, nombre: 'Producto 10' }
  // ... Añadir los demás productos en caso de ser necesario
];

// Middleware para verificar si hay al menos 10 productos
const verificarProductos = (req, res, next) => {
  if (productos.length >= 10) {
    next();
  } else {
    res.status(500).json({ error: 'No hay suficientes productos creados' });
  }
};

// Ruta para obtener todos los productos
app.get('/products', verificarProductos, (req, res) => {
  const limit = parseInt(req.query.limit);
  if (limit) {
    res.json(productos.slice(0, limit));
  } else {
    res.json(productos);
  }
});

// Ruta para obtener un producto por ID
app.get('/products/:id', verificarProductos, (req, res) => {
  const productId = parseInt(req.params.id);
  const productoEncontrado = productos.find(producto => producto.id === productId);
  
  if (productoEncontrado) {
    res.json(productoEncontrado);
  } else {
    res.status(404).json({ error: 'El producto no existe' });
  }
});

// Iniciar el servidor en el puerto 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
