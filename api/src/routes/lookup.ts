/**
 * =============================================================================
 * LOOKUP ROUTES
 * =============================================================================
 *
 * REST API endpoints for lookup/reference data (tags, cuisines, allergens, ingredients).
 * These are used by the frontend to populate filter dropdowns.
 *
 * =============================================================================
 */

import { Router, Request, Response } from "express";
import { query } from "../db";
import type { Tag, Cuisine, Allergen, Ingredient } from "../types";

const router = Router();

/**
 * GET /tags
 *
 * List all tags sorted by name.
 */
router.get("/tags", async (req: Request, res: Response) => {
  try {
    const tags = await query<Tag>(
      "SELECT id, slug, name FROM tags ORDER BY name"
    );
    res.json({ success: true, data: tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ success: false, error: "Failed to fetch tags" });
  }
});

/**
 * GET /cuisines
 *
 * List all cuisines sorted by name.
 */
router.get("/cuisines", async (req: Request, res: Response) => {
  try {
    const cuisines = await query<Cuisine>(
      "SELECT id, slug, name FROM cuisines ORDER BY name"
    );
    res.json({ success: true, data: cuisines });
  } catch (error) {
    console.error("Error fetching cuisines:", error);
    res.status(500).json({ success: false, error: "Failed to fetch cuisines" });
  }
});

/**
 * GET /allergens
 *
 * List all allergens sorted by name.
 */
router.get("/allergens", async (req: Request, res: Response) => {
  try {
    const allergens = await query<Allergen>(
      "SELECT id, slug, name FROM allergens ORDER BY name"
    );
    res.json({ success: true, data: allergens });
  } catch (error) {
    console.error("Error fetching allergens:", error);
    res.status(500).json({ success: false, error: "Failed to fetch allergens" });
  }
});

/**
 * GET /ingredients
 *
 * List all ingredients sorted by name.
 * Optionally filter by is_pantry_ingredient query parameter.
 */
router.get("/ingredients", async (req: Request, res: Response) => {
  try {
    const pantryParam = req.query.pantry;
    let ingredients: Ingredient[];

    if (pantryParam === "true") {
      ingredients = await query<Ingredient>(
        "SELECT id, slug, name, is_pantry_ingredient FROM ingredients WHERE is_pantry_ingredient = true ORDER BY name"
      );
    } else if (pantryParam === "false") {
      ingredients = await query<Ingredient>(
        "SELECT id, slug, name, is_pantry_ingredient FROM ingredients WHERE is_pantry_ingredient = false ORDER BY name"
      );
    } else {
      ingredients = await query<Ingredient>(
        "SELECT id, slug, name, is_pantry_ingredient FROM ingredients ORDER BY name"
      );
    }

    res.json({ success: true, data: ingredients });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({ success: false, error: "Failed to fetch ingredients" });
  }
});

export default router;
