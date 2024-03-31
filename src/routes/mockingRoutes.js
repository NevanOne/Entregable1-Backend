import express from 'express';
import { mockingProductsHandler } from '../config/moduloMocking';

const router = express.Router();

// Ruta para entregar productos de ejemplo
router.get('/mockingproducts', mockingProductsHandler);

export default router;
