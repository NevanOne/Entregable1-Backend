const express = require("express")
const {mockingProductsHandler} = require("../config/moduloMocking.js")
// import { mockingProductsHandler } from '../config/moduloMocking.js';

const router = express.Router();

// Ruta para entregar productos de ejemplo
router.get('/mockingproducts', mockingProductsHandler);

module.exports = router
