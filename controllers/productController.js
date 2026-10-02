const productService = require('../services/productService');
const { invalidateCache } = require('../middleware/cacheMiddleware');

/**
 * Controller to handle GET /products
 */
async function getAll(req, res) {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Controller to handle GET /products/:id
 */
async function getById(req, res) {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: `Product with ID ${id} not found` });
        }

        return res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product by ID:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Controller to handle POST /products
 */
async function create(req, res) {
    try {
        const { name, price } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'Name and price are required fields' });
        }

        const newProduct = await productService.createProduct({ name, price });

        // Invalidate all cache entries because stored data has changed
        invalidateCache();

        return res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Controller to handle PUT /products/:id
 */
async function update(req, res) {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ error: 'Name and price are required fields' });
        }

        const updatedProduct = await productService.updateProduct(id, { name, price });

        if (!updatedProduct) {
            return res.status(404).json({ error: `Product with ID ${id} not found` });
        }

        // Invalidate all cache entries on successful update
        invalidateCache();

        return res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Controller to handle PATCH /products/:id
 */
async function patch(req, res) {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        if (name === undefined && price === undefined) {
            return res.status(400).json({ error: 'At least one field (name or price) must be provided' });
        }

        const updatedProduct = await productService.patchProduct(id, { name, price });

        if (!updatedProduct) {
            return res.status(404).json({ error: `Product with ID ${id} not found` });
        }

        // Invalidate all cache entries on successful patch
        invalidateCache();

        return res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error patching product:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Controller to handle DELETE /products/:id
 */
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const deleted = await productService.deleteProduct(id);

        if (!deleted) {
            return res.status(404).json({ error: `Product with ID ${id} not found` });
        }

        // Invalidate all cache entries on successful deletion
        invalidateCache();

        return res.status(200).json({ message: 'Product deleted successfully', product: deleted });
    } catch (err) {
        console.error('Error deleting product:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    patch,
    deleteProduct
};
