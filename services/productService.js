const { getDbProducts } = require("../database/db");

/**
 * Service to fetch all products from the database.
 */
async function getAllProducts() {
    const products = await getDbProducts();
    return products;
}

/**
 * Service to fetch a product by ID.
 */
async function getProductById(id) {
    const numericId = Number(id);
    const products = await getDbProducts();
    const product = products.find((item) => item.id === numericId);
    return product || null;
}

module.exports = {
    getAllProducts,
    getProductById
};
