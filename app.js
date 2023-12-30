const express = require('express');
const app = express();
const ProductManager = require('./ProductManager');

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

// Manejo de productos
const productsRouter = express.Router();

productsRouter.get('/', verificarProductos, (req, res) => {
  const limit = parseInt(req.query.limit);
  const allProducts = products.getProducts();

  if (limit) {
    res.json(allProducts.slice(0, limit));
  } else {
    res.json(allProducts);
  }
});

productsRouter.get('/:id', verificarProductos, (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const foundProduct = products.getProductById(productId);
    res.json(foundProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productsRouter.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const product = {
    title,
    description,
    code,
    price: parseFloat(price), // Aseguramos que price sea un número (en caso de tener ,50 o ,25 no se usa Int)
    status: true, // Status es true por defecto, booleano.
    stock: parseInt(stock), // Aseguramos que stock sea un número
    category,
    thumbnails: thumbnails || [] // Si no se proporciona thumbnails, se establece como un array vacío
  };

  try {
    const result = products.addProduct(product);
    res.json({ message: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productsRouter.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;
  try {
    const result = products.updateProduct(productId, updatedFields);
    res.json({ message: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productsRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const result = products.deleteProduct(productId);
    res.json({ message: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Asociar las rutas de productos al endpoint '/api/products'
app.use('/api/products', productsRouter);

// Manejo de carritos
const cartsRouter = express.Router();

cartsRouter.get('/:cid', (req, res) => {
  // Lógica para obtener los productos del carrito por su ID (cid)
  res.json({ message: `Obtener los productos del carrito con ID ${req.params.cid}` });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  // Lógica para agregar un producto al carrito por su ID (cid) y producto (pid)
  res.json({ message: `Agregar el producto con ID ${req.params.pid} al carrito con ID ${req.params.cid}` });
});

// Asociar las rutas de carritos al endpoint '/api/carts'
app.use('/api/carts', cartsRouter);

// Iniciar el servidor en el puerto 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
