const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for visibility
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const cacheHeader = res.getHeader('X-Cache') ? `[${res.getHeader('X-Cache')}]` : '';
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${cacheHeader} - ${duration}ms`);
    });
    next();
});

// Mount modular product routes
// Request Flow: Route -> Middleware -> Controller -> Service -> Database
app.use('/products', productRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Product API with Caching Middleware',
        endpoints: {
            'GET /products': 'List all products (Cached, TTL: 1m, X-Cache header)',
            'GET /products/:id': 'Get product by ID (Cached, TTL: 1m, X-Cache header)',
            'POST /products': 'Create product (Invalidates cache)',
            'PUT /products/:id': 'Update product (Invalidates cache)',
            'PATCH /products/:id': 'Patch product (Invalidates cache)',
            'DELETE /products/:id': 'Delete product (Invalidates cache)'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;