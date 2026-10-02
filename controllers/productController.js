const productService = require("../services/productService");

/**
 * Controller to handle GET /products
 */
async function getAll(req, res) {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Internal Server Error" });
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
        console.error("Error fetching product by ID:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getAll,
    getById
};
