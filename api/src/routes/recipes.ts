/**
 * =============================================================================
 * RECIPES ROUTES
 * =============================================================================
 *
 * REST API endpoints for recipes.
 *
 * REST CONVENTIONS:
 * - GET    /recipes        -> List all recipes (with pagination)
 * - GET    /recipes/:id    -> Get one recipe by ID
 * - GET    /recipes/slug/:slug -> Get one recipe by slug (for SEO-friendly URLs)
 *
 * We're starting with read-only endpoints. You can add POST, PUT, DELETE later.
 *
 * =============================================================================
 */

import { Router, Request, Response } from "express";
import { query, queryOne } from "../db";
import { getRecipeImageUrl, getStepImageUrl } from "../imageUrl";
import type {
  Recipe,
  RecipeDetail,
  Step,
  RecipeIngredient,
  IngredientAllergen,
  Tag,
  Cuisine,
  Utensil,
} from "../types";

// Helper to add image_url to a recipe
function addRecipeImageUrl<T extends Recipe>(recipe: T): T & { image_url: string | null } {
  return {
    ...recipe,
    image_url: recipe.has_image ? getRecipeImageUrl(recipe.slug) : null,
  };
}

// Helper to add image_url to a step
function addStepImageUrl(step: Step): Step & { image_url: string | null } {
  return {
    ...step,
    image_url: step.has_image ? getStepImageUrl(step.id) : null,
  };
}

// Row type for allergen query result
interface AllergenRow {
  ingredient_id: string;
  id: string;
  slug: string;
  name: string;
  traces_of: boolean;
}

// Helper to fetch allergens for ingredients and attach them
async function attachAllergensToIngredients(
  ingredients: Omit<RecipeIngredient, "allergens">[]
): Promise<RecipeIngredient[]> {
  if (ingredients.length === 0) {
    return [];
  }

  const ingredientIds = ingredients.map((i) => i.ingredient_id);

  // Fetch all allergens for these ingredients in one query
  const allergenRows = await query<AllergenRow>(
    `SELECT ia.ingredient_id, a.id, a.slug, a.name, ia.traces_of
     FROM ingredient_allergens ia
     JOIN allergens a ON ia.allergen_id = a.id
     WHERE ia.ingredient_id = ANY($1)`,
    [ingredientIds]
  );

  // Group allergens by ingredient_id
  const allergensByIngredient = new Map<string, IngredientAllergen[]>();
  for (const row of allergenRows) {
    const list = allergensByIngredient.get(row.ingredient_id) || [];
    list.push({
      id: row.id,
      slug: row.slug,
      name: row.name,
      traces_of: row.traces_of,
    });
    allergensByIngredient.set(row.ingredient_id, list);
  }

  // Attach allergens to each ingredient
  return ingredients.map((ingredient) => ({
    ...ingredient,
    allergens: allergensByIngredient.get(ingredient.ingredient_id) || [],
  }));
}

const router = Router();

/**
 * GET /recipes
 *
 * List all recipes with pagination and filtering.
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 * - search: Text search (name or headline)
 * - cuisine: Filter by cuisine slug
 * - tag: Filter by tag slug
 * - includeIngredients: Filter by ingredient slugs (comma-separated or multiple params)
 * - excludeAllergens: Exclude recipes with these allergen slugs (comma-separated or multiple params)
 * - maxTime: Maximum cooking time in minutes
 *
 * Example: GET /recipes?page=2&limit=20&cuisine=italiana&search=pasta
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // Parse pagination parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const offset = (page - 1) * limit;

    // Optional filters
    const cuisineSlug = req.query.cuisine as string;
    const tagSlug = req.query.tag as string;
    const searchText = req.query.search as string;
    const maxTime = req.query.maxTime ? parseInt(req.query.maxTime as string) : null;

    // Handle array parameters for ingredients and allergens
    const includeIngredients = parseArrayParam(req.query.includeIngredients);
    const excludeAllergens = parseArrayParam(req.query.excludeAllergens);

    // Build the query dynamically based on filters
    let countQuery = "SELECT COUNT(*) FROM recipes r WHERE r.is_active = true";
    let dataQuery = `
      SELECT r.*
      FROM recipes r
      WHERE r.is_active = true
    `;
    const params: unknown[] = [];
    let paramIndex = 1;

    // Add text search filter
    if (searchText) {
      const searchFilter = `
        AND (r.name ILIKE $${paramIndex} OR r.headline ILIKE $${paramIndex})
      `;
      countQuery += searchFilter;
      dataQuery += searchFilter;
      params.push(`%${searchText}%`);
      paramIndex++;
    }

    // Add cuisine filter if provided
    if (cuisineSlug) {
      const cuisineJoin = `
        AND EXISTS (
          SELECT 1 FROM recipe_cuisines rc
          JOIN cuisines c ON rc.cuisine_id = c.id
          WHERE rc.recipe_id = r.id AND c.slug = $${paramIndex}
        )
      `;
      countQuery += cuisineJoin;
      dataQuery += cuisineJoin;
      params.push(cuisineSlug);
      paramIndex++;
    }

    // Add tag filter if provided
    if (tagSlug) {
      const tagJoin = `
        AND EXISTS (
          SELECT 1 FROM recipe_tags rt
          JOIN tags t ON rt.tag_id = t.id
          WHERE rt.recipe_id = r.id AND t.slug = $${paramIndex}
        )
      `;
      countQuery += tagJoin;
      dataQuery += tagJoin;
      params.push(tagSlug);
      paramIndex++;
    }

    // Add max time filter
    if (maxTime !== null && maxTime > 0) {
      const timeFilter = ` AND r.time_minutes <= $${paramIndex}`;
      countQuery += timeFilter;
      dataQuery += timeFilter;
      params.push(maxTime);
      paramIndex++;
    }

    // Add ingredient inclusion filter (recipes must have ALL specified ingredients)
    if (includeIngredients.length > 0) {
      for (const ingredientSlug of includeIngredients) {
        const ingredientFilter = `
          AND EXISTS (
            SELECT 1 FROM recipe_ingredients ri
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = r.id AND i.slug = $${paramIndex}
          )
        `;
        countQuery += ingredientFilter;
        dataQuery += ingredientFilter;
        params.push(ingredientSlug);
        paramIndex++;
      }
    }

    // Add allergen exclusion filter (exclude recipes with ANY of the specified allergens)
    if (excludeAllergens.length > 0) {
      const allergenFilter = `
        AND NOT EXISTS (
          SELECT 1 FROM recipe_ingredients ri
          JOIN ingredient_allergens ia ON ri.ingredient_id = ia.ingredient_id
          JOIN allergens a ON ia.allergen_id = a.id
          WHERE ri.recipe_id = r.id AND a.slug = ANY($${paramIndex})
        )
      `;
      countQuery += allergenFilter;
      dataQuery += allergenFilter;
      params.push(excludeAllergens);
      paramIndex++;
    }

    // Add ordering (random-ish using a seed based on the current date) and pagination
    dataQuery += ` ORDER BY md5(r.id || CURRENT_DATE::text), r.last_updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Execute both queries
    const [countResult] = await query<{ count: string }>(countQuery, params.slice(0, -2));
    const recipes = await query<Recipe>(dataQuery, params);

    const total = parseInt(countResult.count);

    // Add image URLs to each recipe
    const recipesWithImages = recipes.map(addRecipeImageUrl);

    res.json({
      success: true,
      data: recipesWithImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ success: false, error: "Failed to fetch recipes" });
  }
});

/**
 * GET /recipes/:id
 *
 * Get a single recipe by ID with all related data.
 * This returns the full recipe with steps, ingredients, tags, cuisines, and utensils.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get the recipe
    const recipe = await queryOne<Recipe>(
      "SELECT * FROM recipes WHERE id = $1",
      [id]
    );

    if (!recipe) {
      res.status(404).json({ success: false, error: "Recipe not found" });
      return;
    }

    // Get all related data in parallel for better performance
    const [steps, ingredientsRaw, tags, cuisines, utensils] = await Promise.all([
      // Steps (ordered by step_order)
      query<Step>(
        "SELECT * FROM steps WHERE recipe_id = $1 ORDER BY step_order",
        [id]
      ),

      // Ingredients with their details (allergens attached separately)
      query<Omit<RecipeIngredient, "allergens">>(
        `SELECT ri.ingredient_id, i.name, i.slug, i.is_pantry_ingredient, ri.quantity_amount, ri.quantity_unit
         FROM recipe_ingredients ri
         JOIN ingredients i ON ri.ingredient_id = i.id
         WHERE ri.recipe_id = $1`,
        [id]
      ),

      // Tags
      query<Tag>(
        `SELECT t.* FROM tags t
         JOIN recipe_tags rt ON t.id = rt.tag_id
         WHERE rt.recipe_id = $1`,
        [id]
      ),

      // Cuisines
      query<Cuisine>(
        `SELECT c.* FROM cuisines c
         JOIN recipe_cuisines rc ON c.id = rc.cuisine_id
         WHERE rc.recipe_id = $1`,
        [id]
      ),

      // Utensils
      query<Utensil>(
        `SELECT u.* FROM utensils u
         JOIN recipe_utensils ru ON u.id = ru.utensil_id
         WHERE ru.recipe_id = $1`,
        [id]
      ),
    ]);

    // Attach allergens to ingredients
    const ingredients = await attachAllergensToIngredients(ingredientsRaw);

    // Combine into full recipe detail with image URLs
    const recipeDetail = {
      ...addRecipeImageUrl(recipe),
      steps: steps.map(addStepImageUrl),
      ingredients,
      tags,
      cuisines,
      utensils,
    };

    res.json({ success: true, data: recipeDetail });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ success: false, error: "Failed to fetch recipe" });
  }
});

/**
 * GET /recipes/slug/:slug
 *
 * Get a recipe by its slug (URL-friendly identifier).
 * Useful for SEO-friendly URLs like /recipes/slug/pasta-carbonara
 */
router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // First find the recipe ID by slug
    const recipe = await queryOne<Recipe>(
      "SELECT * FROM recipes WHERE slug = $1",
      [slug]
    );

    if (!recipe) {
      res.status(404).json({ success: false, error: "Recipe not found" });
      return;
    }

    // Reuse the same logic as /:id endpoint
    const [steps, ingredientsRaw, tags, cuisines, utensils] = await Promise.all([
      query<Step>(
        "SELECT * FROM steps WHERE recipe_id = $1 ORDER BY step_order",
        [recipe.id]
      ),
      query<Omit<RecipeIngredient, "allergens">>(
        `SELECT ri.ingredient_id, i.name, i.slug, i.is_pantry_ingredient, ri.quantity_amount, ri.quantity_unit
         FROM recipe_ingredients ri
         JOIN ingredients i ON ri.ingredient_id = i.id
         WHERE ri.recipe_id = $1`,
        [recipe.id]
      ),
      query<Tag>(
        `SELECT t.* FROM tags t
         JOIN recipe_tags rt ON t.id = rt.tag_id
         WHERE rt.recipe_id = $1`,
        [recipe.id]
      ),
      query<Cuisine>(
        `SELECT c.* FROM cuisines c
         JOIN recipe_cuisines rc ON c.id = rc.cuisine_id
         WHERE rc.recipe_id = $1`,
        [recipe.id]
      ),
      query<Utensil>(
        `SELECT u.* FROM utensils u
         JOIN recipe_utensils ru ON u.id = ru.utensil_id
         WHERE ru.recipe_id = $1`,
        [recipe.id]
      ),
    ]);

    // Attach allergens to ingredients
    const ingredients = await attachAllergensToIngredients(ingredientsRaw);

    // Combine into full recipe detail with image URLs
    const recipeDetail = {
      ...addRecipeImageUrl(recipe),
      steps: steps.map(addStepImageUrl),
      ingredients,
      tags,
      cuisines,
      utensils,
    };

    res.json({ success: true, data: recipeDetail });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ success: false, error: "Failed to fetch recipe" });
  }
});

// Helper function to parse array parameters
function parseArrayParam(param: unknown): string[] {
  if (!param) return [];
  if (Array.isArray(param)) {
    return param.flatMap((p) => (typeof p === "string" ? p.split(",") : []));
  }
  if (typeof param === "string") {
    return param.split(",").filter(Boolean);
  }
  return [];
}

export default router;
