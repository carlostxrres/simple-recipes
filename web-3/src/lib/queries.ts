/**
 * Direct database access for Server Components.
 * These functions bypass HTTP and call the DB directly, which avoids
 * self-referential fetch calls during Vercel builds and ISR revalidation.
 *
 * Client components (browser) should continue using api.ts (HTTP fetch).
 */

import { query, queryOne } from "@/lib/db";
import { getRecipeImageUrl, getStepImageUrl } from "@/lib/imageUrl";
import type {
  Recipe,
  RecipeDetail,
  Step,
  RecipeIngredient,
  IngredientAllergen,
  Tag,
  Cuisine,
  Allergen,
  Ingredient,
  Utensil,
  PaginatedResponse,
  SingleResponse,
  SearchFilters,
} from "@/lib/types";

type RecipeRow = Omit<Recipe, "image_url">;
type StepRow = Omit<Step, "image_url">;
type IngredientRow = Omit<RecipeIngredient, "allergens">;

interface AllergenRow {
  ingredient_id: string;
  id: string;
  slug: string;
  name: string;
  traces_of: boolean;
}

async function attachAllergens(
  ingredients: IngredientRow[]
): Promise<RecipeIngredient[]> {
  if (ingredients.length === 0) {
    return [];
  }
  const ids = ingredients.map((i) => i.ingredient_id);
  const rows = await query<AllergenRow>(
    `SELECT ia.ingredient_id, a.id, a.slug, a.name, ia.traces_of
     FROM ingredient_allergens ia
     JOIN allergens a ON ia.allergen_id = a.id
     WHERE ia.ingredient_id = ANY($1)`,
    [ids]
  );
  const byIngredient = new Map<string, IngredientAllergen[]>();
  for (const row of rows) {
    const list = byIngredient.get(row.ingredient_id) ?? [];
    list.push({ id: row.id, slug: row.slug, name: row.name, traces_of: row.traces_of });
    byIngredient.set(row.ingredient_id, list);
  }
  return ingredients.map((i) => ({
    ...i,
    allergens: byIngredient.get(i.ingredient_id) ?? [],
  }));
}

export async function getRecipes(
  filters: SearchFilters = {}
): Promise<PaginatedResponse<Recipe>> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 10));
  const offset = (page - 1) * limit;

  const tagSlugs = Array.isArray(filters.tag)
    ? filters.tag
    : filters.tag
    ? [filters.tag]
    : [];
  const includeIngredients = filters.includeIngredients ?? [];
  const excludeAllergens = filters.excludeAllergens ?? [];

  let where = "WHERE r.is_active = true";
  const whereParams: unknown[] = [];
  let i = 1;

  if (filters.search) {
    where += ` AND (r.name ILIKE $${i} OR r.headline ILIKE $${i})`;
    whereParams.push(`%${filters.search}%`);
    i++;
  }

  if (filters.cuisine) {
    where += ` AND EXISTS (
      SELECT 1 FROM recipe_cuisines rc
      JOIN cuisines c ON rc.cuisine_id = c.id
      WHERE rc.recipe_id = r.id AND c.slug = $${i}
    )`;
    whereParams.push(filters.cuisine);
    i++;
  }

  for (const tagSlug of tagSlugs) {
    where += ` AND EXISTS (
      SELECT 1 FROM recipe_tags rt
      JOIN tags t ON rt.tag_id = t.id
      WHERE rt.recipe_id = r.id AND t.slug = $${i}
    )`;
    whereParams.push(tagSlug);
    i++;
  }

  if (filters.maxTime && filters.maxTime > 0) {
    where += ` AND r.time_minutes <= $${i}`;
    whereParams.push(filters.maxTime);
    i++;
  }

  for (const ingredientSlug of includeIngredients) {
    where += ` AND EXISTS (
      SELECT 1 FROM recipe_ingredients ri
      JOIN ingredients ing ON ri.ingredient_id = ing.id
      WHERE ri.recipe_id = r.id AND ing.slug = $${i}
    )`;
    whereParams.push(ingredientSlug);
    i++;
  }

  if (excludeAllergens.length > 0) {
    where += ` AND NOT EXISTS (
      SELECT 1 FROM recipe_ingredients ri
      JOIN ingredient_allergens ia ON ri.ingredient_id = ia.ingredient_id
      JOIN allergens a ON ia.allergen_id = a.id
      WHERE ri.recipe_id = r.id AND a.slug = ANY($${i})
    )`;
    whereParams.push(excludeAllergens);
    i++;
  }

  const dataParams = [...whereParams];
  let orderClause: string;
  if (filters.seed) {
    orderClause = ` ORDER BY md5(r.id || $${i})`;
    dataParams.push(filters.seed);
    i++;
  } else {
    orderClause = ` ORDER BY md5(r.id || CURRENT_DATE::text)`;
  }
  dataParams.push(limit, offset);

  const countSQL = `SELECT COUNT(*) FROM recipes r ${where}`;
  const dataSQL = `SELECT r.* FROM recipes r ${where}${orderClause} LIMIT $${i} OFFSET $${i + 1}`;

  const [[countResult], recipes] = await Promise.all([
    query<{ count: string }>(countSQL, whereParams),
    query<RecipeRow>(dataSQL, dataParams),
  ]);

  const total = parseInt(countResult.count);
  return {
    success: true,
    data: recipes.map((r) => ({
      ...r,
      image_url: r.has_image ? getRecipeImageUrl(r.slug) : null,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

async function buildRecipeDetail(recipe: RecipeRow): Promise<RecipeDetail> {
  const [steps, ingredientsRaw, tags, cuisines, utensils] = await Promise.all([
    query<StepRow>("SELECT * FROM steps WHERE recipe_id = $1 ORDER BY step_order", [recipe.id]),
    query<IngredientRow>(
      `SELECT ri.ingredient_id, i.name, i.slug, i.is_pantry_ingredient, ri.quantity_amount, ri.quantity_unit
       FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE ri.recipe_id = $1`,
      [recipe.id]
    ),
    query<Tag>(`SELECT t.* FROM tags t JOIN recipe_tags rt ON t.id = rt.tag_id WHERE rt.recipe_id = $1`, [recipe.id]),
    query<Cuisine>(`SELECT c.* FROM cuisines c JOIN recipe_cuisines rc ON c.id = rc.cuisine_id WHERE rc.recipe_id = $1`, [recipe.id]),
    query<Utensil>(`SELECT u.* FROM utensils u JOIN recipe_utensils ru ON u.id = ru.utensil_id WHERE ru.recipe_id = $1`, [recipe.id]),
  ]);
  const ingredients = await attachAllergens(ingredientsRaw);
  return {
    ...recipe,
    image_url: recipe.has_image ? getRecipeImageUrl(recipe.slug) : null,
    steps: steps.map((s) => ({ ...s, image_url: s.has_image ? getStepImageUrl(s.id) : null })),
    ingredients,
    tags,
    cuisines,
    utensils,
  };
}

export async function getRecipeBySlug(
  slug: string
): Promise<SingleResponse<RecipeDetail>> {
  const recipe = await queryOne<RecipeRow>(
    "SELECT * FROM recipes WHERE slug = $1",
    [slug]
  );
  if (!recipe) {
    throw new Error("Recipe not found");
  }
  return { success: true, data: await buildRecipeDetail(recipe) };
}

export async function getRecipeById(
  id: string
): Promise<SingleResponse<RecipeDetail>> {
  const recipe = await queryOne<RecipeRow>(
    "SELECT * FROM recipes WHERE id = $1",
    [id]
  );
  if (!recipe) {
    throw new Error("Recipe not found");
  }
  return { success: true, data: await buildRecipeDetail(recipe) };
}

export async function getTags(): Promise<{ success: boolean; data: Tag[] }> {
  const data = await query<Tag>("SELECT id, slug, name FROM tags ORDER BY name");
  return { success: true, data };
}

export async function getCuisines(): Promise<{ success: boolean; data: Cuisine[] }> {
  const data = await query<Cuisine>("SELECT id, slug, name FROM cuisines ORDER BY name");
  return { success: true, data };
}

export async function getAllergens(): Promise<{ success: boolean; data: Allergen[] }> {
  const data = await query<Allergen>("SELECT id, slug, name FROM allergens ORDER BY name");
  return { success: true, data };
}

export async function getIngredients(
  pantry?: boolean
): Promise<{ success: boolean; data: Ingredient[] }> {
  const whereClause =
    pantry === true ? "WHERE is_pantry_ingredient = true" :
    pantry === false ? "WHERE is_pantry_ingredient = false" :
    "";
  const data = await query<Ingredient>(
    `SELECT id, slug, name, is_pantry_ingredient FROM ingredients ${whereClause} ORDER BY name`
  );
  return { success: true, data };
}

export async function getUtensils(): Promise<{ success: boolean; data: Utensil[] }> {
  try {
    const data = await query<Utensil>(
      "SELECT id, slug, name FROM utensils ORDER BY name"
    );
    return { success: true, data };
  } catch {
    return { success: false, data: [] };
  }
}
