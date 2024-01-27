const express = require('express');
const router = express.Router();
const Product = require('../../src/db/models/productModel'); 

// Ruta para obtener productos con paginación, búsqueda y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query ? { type: query } : {};
    const sortOrder = sort === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .sort({ price: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para vistas de productos
router.get('/views/products', (req, res) => {
  // Implementa lógica para renderizar la vista de productos
});

module.exports = router;
