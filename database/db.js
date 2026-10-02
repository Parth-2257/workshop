const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

/**
 * Simulates a small latency to demonstrate caching effectiveness
 * and reads product data from the database file.
 */
async function getDbProducts() {
    // Artificial delay to simulate real database query latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile(dbPath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        throw err;
    }
}

/**
 * Saves updated product data to the database file.
 */
async function saveDbProducts(products) {
    await fs.writeFile(dbPath, JSON.stringify(products, null, 2), 'utf-8');
    return products;
}

module.exports = {
    getDbProducts,
    saveDbProducts
};
