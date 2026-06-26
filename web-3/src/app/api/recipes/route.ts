import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getRecipeImageUrl } from "@/lib/imageUrl";
import type { Recipe } from "@/lib/types";

function parseArrayParam(param: string | null): string[] {
  if (!param) return [];
  return param.split(",").filter(Boolean);
}

type RecipeRow = Omit<Recipe, "image_url">;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10") || 10));
    const offset = (page - 1) * limit;

    const cuisineSlug = searchParams.get("cuisine");
    const tagSlug = searchParams.get("tag");
    const searchText = searchParams.get("search");
    const maxTimeParam = searchParams.get("maxTime");
    const maxTime = maxTimeParam ? parseInt(maxTimeParam) : null;

    const includeIngredients = searchParams.getAll("includeIngredients")
      .flatMap((v) => v.split(",").filter(Boolean));
    const excludeAllergens = searchParams.getAll("excludeAllergens")
      .flatMap((v) => v.split(",").filter(Boolean));

    let countQuery = "SELECT COUNT(*) FROM recipes r WHERE r.is_active = true";
    let dataQuery = `SELECT r.* FROM recipes r WHERE r.is_active = true`;
    const params: unknown[] = [];
    let paramIndex = 1;

    if (searchText) {
      const filter = ` AND (r.name ILIKE $${paramIndex} OR r.headline ILIKE $${paramIndex})`;
      countQuery += filter;
      dataQuery += filter;
      params.push(`%${searchText}%`);
      paramIndex++;
    }

    if (cuisineSlug) {
      const filter = ` AND EXISTS (
        SELECT 1 FROM recipe_cuisines rc
        JOIN cuisines c ON rc.cuisine_id = c.id
        WHERE rc.recipe_id = r.id AND c.slug = $${paramIndex}
      )`;
      countQuery += filter;
      dataQuery += filter;
      params.push(cuisineSlug);
      paramIndex++;
    }

    if (tagSlug) {
      const filter = ` AND EXISTS (
        SELECT 1 FROM recipe_tags rt
        JOIN tags t ON rt.tag_id = t.id
        WHERE rt.recipe_id = r.id AND t.slug = $${paramIndex}
      )`;
      countQuery += filter;
      dataQuery += filter;
      params.push(tagSlug);
      paramIndex++;
    }

    if (maxTime !== null && maxTime > 0) {
      const filter = ` AND r.time_minutes <= $${paramIndex}`;
      countQuery += filter;
      dataQuery += filter;
      params.push(maxTime);
      paramIndex++;
    }

    for (const ingredientSlug of includeIngredients) {
      const filter = ` AND EXISTS (
        SELECT 1 FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = r.id AND i.slug = $${paramIndex}
      )`;
      countQuery += filter;
      dataQuery += filter;
      params.push(ingredientSlug);
      paramIndex++;
    }

    if (excludeAllergens.length > 0) {
      const filter = ` AND NOT EXISTS (
        SELECT 1 FROM recipe_ingredients ri
        JOIN ingredient_allergens ia ON ri.ingredient_id = ia.ingredient_id
        JOIN allergens a ON ia.allergen_id = a.id
        WHERE ri.recipe_id = r.id AND a.slug = ANY($${paramIndex})
      )`;
      countQuery += filter;
      dataQuery += filter;
      params.push(excludeAllergens);
      paramIndex++;
    }

    dataQuery += ` ORDER BY md5(r.id || CURRENT_DATE::text), r.last_updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const [countResult] = await query<{ count: string }>(countQuery, params.slice(0, -2));
    const recipes = await query<RecipeRow>(dataQuery, params);

    const total = parseInt(countResult.count);
    const recipesWithImages = recipes.map((r) => ({
      ...r,
      image_url: r.has_image ? getRecipeImageUrl(r.slug) : null,
    }));

    return NextResponse.json({
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
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
