const express = require('express');
const app = express();
const ProductManager = require('./ProductManager');

const filePath = 'products.json';
const products = new ProductManager(filePath);

const verificarProductos = (req, res, next) => {
    if (products.getProducts().length >= 10) {
        next();
    } else {
        res.status(500).json({ error: 'No hay suficientes productos creados' });
    }
};

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
        price: parseFloat(price),
        status: true,
        stock: parseInt(stock),
        category,
        thumbnails: thumbnails || []
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

app.use('/api/products', productsRouter);

const cartsRouter = express.Router();

cartsRouter.get('/:cid', (req, res) => {
    res.json({ message: `Obtener los productos del carrito con ID ${req.params.cid}` });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    res.json({ message: `Agregar el producto con ID ${req.params.pid} al carrito con ID ${req.params.cid}` });
});

app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
