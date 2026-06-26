import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getRecipeImageUrl, getStepImageUrl } from "@/lib/imageUrl";
import type { Recipe, Step, RecipeIngredient, IngredientAllergen, Tag, Cuisine, Utensil } from "@/lib/types";

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

async function attachAllergens(ingredients: IngredientRow[]): Promise<RecipeIngredient[]> {
  if (ingredients.length === 0) return [];
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
  return ingredients.map((i) => ({ ...i, allergens: byIngredient.get(i.ingredient_id) ?? [] }));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await queryOne<RecipeRow>("SELECT * FROM recipes WHERE id = $1", [id]);

    if (!recipe) {
      return NextResponse.json({ success: false, error: "Recipe not found" }, { status: 404 });
    }

    const [steps, ingredientsRaw, tags, cuisines, utensils] = await Promise.all([
      query<StepRow>("SELECT * FROM steps WHERE recipe_id = $1 ORDER BY step_order", [id]),
      query<IngredientRow>(
        `SELECT ri.ingredient_id, i.name, i.slug, i.is_pantry_ingredient, ri.quantity_amount, ri.quantity_unit
         FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id
         WHERE ri.recipe_id = $1`,
        [id]
      ),
      query<Tag>(`SELECT t.* FROM tags t JOIN recipe_tags rt ON t.id = rt.tag_id WHERE rt.recipe_id = $1`, [id]),
      query<Cuisine>(`SELECT c.* FROM cuisines c JOIN recipe_cuisines rc ON c.id = rc.cuisine_id WHERE rc.recipe_id = $1`, [id]),
      query<Utensil>(`SELECT u.* FROM utensils u JOIN recipe_utensils ru ON u.id = ru.utensil_id WHERE ru.recipe_id = $1`, [id]),
    ]);

    const ingredients = await attachAllergens(ingredientsRaw);

    return NextResponse.json({
      success: true,
      data: {
        ...recipe,
        image_url: recipe.has_image ? getRecipeImageUrl(recipe.slug) : null,
        steps: steps.map((s) => ({ ...s, image_url: s.has_image ? getStepImageUrl(s.id) : null })),
        ingredients,
        tags,
        cuisines,
        utensils,
      },
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch recipe" }, { status: 500 });
  }
}
