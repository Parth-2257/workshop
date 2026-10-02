const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// GET /products - cached via middleware
router.get('/', cacheMiddleware, productController.getAll);

// GET /products/:id - cached via middleware
router.get('/:id', cacheMiddleware, productController.getById);

// POST /products - creates a product and invalidates cache
router.post('/', productController.create);

// PUT /products/:id - replaces a product and invalidates cache
router.put('/:id', productController.update);

// PATCH /products/:id - partially updates a product and invalidates cache
router.patch('/:id', productController.patch);

// DELETE /products/:id - deletes a product and invalidates cache
router.delete('/:id', productController.deleteProduct);

module.exports = router;
