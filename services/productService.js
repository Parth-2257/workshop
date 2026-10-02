const { getDbProducts, saveDbProducts } = require('../database/db');

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

/**
 * Service to create a new product.
 */
async function createProduct(productData) {
    const products = await getDbProducts();
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
        id: nextId,
        name: productData.name,
        price: Number(productData.price)
    };
    products.push(newProduct);
    await saveDbProducts(products);
    return newProduct;
}

/**
 * Service to completely update (PUT) a product by ID.
 */
async function updateProduct(id, productData) {
    const numericId = Number(id);
    const products = await getDbProducts();
    const index = products.findIndex((item) => item.id === numericId);
    
    if (index === -1) {
        return null;
    }

    const updatedProduct = {
        id: numericId,
        name: productData.name,
        price: Number(productData.price)
    };
    products[index] = updatedProduct;
    await saveDbProducts(products);
    return updatedProduct;
}

/**
 * Service to partially update (PATCH) a product by ID.
 */
async function patchProduct(id, updateFields) {
    const numericId = Number(id);
    const products = await getDbProducts();
    const index = products.findIndex((item) => item.id === numericId);

    if (index === -1) {
        return null;
    }

    const existingProduct = products[index];
    const updatedProduct = {
        ...existingProduct,
        ...(updateFields.name !== undefined && { name: updateFields.name }),
        ...(updateFields.price !== undefined && { price: Number(updateFields.price) })
    };

    products[index] = updatedProduct;
    await saveDbProducts(products);
    return updatedProduct;
}

/**
 * Service to delete a product by ID.
 */
async function deleteProduct(id) {
    const numericId = Number(id);
    const products = await getDbProducts();
    const index = products.findIndex((item) => item.id === numericId);

    if (index === -1) {
        return null;
    }

    const [deleted] = products.splice(index, 1);
    await saveDbProducts(products);
    return deleted;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
};
