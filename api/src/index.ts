/**
 * =============================================================================
 * RECIPES REST API
 * =============================================================================
 *
 * Main entry point for the Express server.
 *
 * To run in development (auto-restarts on file changes):
 *   npm run dev
 *
 * To run in production:
 *   npm run build
 *   npm start
 *
 * =============================================================================
 */

import express from "express";
import cors from "cors";
import recipesRouter from "./routes/recipes";
import lookupRouter from "./routes/lookup";

// Create the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Enable CORS (Cross-Origin Resource Sharing)
// This allows the frontend (different port) to make requests to this API
app.use(cors());

// Parse JSON request bodies
// This allows us to read req.body when clients send JSON data
app.use(express.json());

// Simple request logger (in production, you'd use a library like morgan)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// =============================================================================
// ROUTES
// =============================================================================

// Health check endpoint - useful for monitoring
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount the recipes router at /api/recipes
// All recipe endpoints will be prefixed with /api/recipes
app.use("/api/recipes", recipesRouter);

// Mount the lookup router at /api
// Endpoints: /api/tags, /api/cuisines, /api/allergens, /api/ingredients
app.use("/api", lookupRouter);

// Root endpoint - API info
app.get("/", (req, res) => {
  res.json({
    name: "Recipes API",
    version: "1.0.0",
    endpoints: {
      "GET /api/recipes": "List all recipes (supports ?page, ?limit, ?search, ?cuisine, ?tag, ?includeIngredients, ?excludeAllergens, ?maxTime)",
      "GET /api/recipes/:id": "Get recipe by ID with full details",
      "GET /api/recipes/slug/:slug": "Get recipe by slug with full details",
      "GET /api/tags": "List all tags",
      "GET /api/cuisines": "List all cuisines",
      "GET /api/allergens": "List all allergens",
      "GET /api/ingredients": "List all ingredients (supports ?pantry=true/false)",
      "GET /health": "Health check",
    },
  });
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler - for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
  console.log(`
============================================================
  Recipes API is running!

  Local:   http://localhost:${PORT}

  Try these endpoints:
  - GET http://localhost:${PORT}/
  - GET http://localhost:${PORT}/api/recipes
  - GET http://localhost:${PORT}/api/recipes?cuisine=italiana
  - GET http://localhost:${PORT}/api/recipes?tag=vegetariano
============================================================
  `);
});
