// In-memory cache storage
const cache = new Map();

// Time to Live: 1 minute (60,000 milliseconds)
const TTL_MS = 60 * 1000;

/**
 * Caching middleware for GET endpoints.
 * Handles cache lookup, TTL expiration checks, X-Cache headers (HIT / MISS),
 * and caching fresh responses.
 */
function cacheMiddleware(req, res, next) {
    // Only cache GET requests
    if (req.method !== "GET") {
        return next();
    }

    const key = req.originalUrl || req.url;
    const now = Date.now();
    const cachedEntry = cache.get(key);

    if (cachedEntry) {
        const age = now - cachedEntry.createdAt;
        if (age <= TTL_MS) {
            // Cache HIT (fresh data within 1 minute TTL)
            res.setHeader("X-Cache", "HIT");
            return res.json(cachedEntry.data);
        } else {
            // Cache expired: remove stale entry
            cache.delete(key);
        }
    }

    // Cache MISS (entry not found or expired)
    res.setHeader("X-Cache", "MISS");

    // Intercept res.json to store the fresh response into the cache
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            cache.set(key, {
                data: body,
                createdAt: Date.now()
            });
        }
        return originalJson(body);
    };

    next();
}

module.exports = {
    cacheMiddleware,
    TTL_MS
};
