/**
 * =============================================================================
 * API CLIENT
 * =============================================================================
 *
 * Helper functions to fetch data from our Express API.
 *
 * In Next.js, we can fetch data on the server (during page render) which is
 * great for SEO - search engines see the full content, not a loading spinner.
 *
 * =============================================================================
 */

// The URL of our Express API
// In production, this would come from an environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// =============================================================================
// TYPES (matching our API responses)
// =============================================================================

export interface Recipe {
  id: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  last_updated_at: string;
  name: string;
  headline: string;
  description: string;
  has_image: boolean;
  image_url: string | null;
  time_minutes: number;
  difficulty: "1" | "2" | "3";
  nutrition_energy_kj: number;
  nutrition_energy_kcal: number;
  nutrition_fat: number;
  nutrition_fat_saturated: number;
  nutrition_carbs: number;
  nutrition_carbs_sugar: number;
  nutrition_fiber: number;
  nutrition_protein: number;
  nutrition_sodium: number;
}

export interface Step {
  id: string;
  recipe_id: string;
  step_order: number;
  instructions: string;
  has_image: boolean;
  image_url: string | null;
}

export interface IngredientAllergen {
  id: string;
  slug: string;
  name: string;
  traces_of: boolean;
}

export interface RecipeIngredient {
  ingredient_id: string;
  name: string;
  slug: string;
  quantity_amount: number | null;
  quantity_unit: string | null;
  is_pantry_ingredient: boolean;
  allergens: IngredientAllergen[];
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Cuisine {
  id: string;
  slug: string;
  name: string;
}

export interface Utensil {
  id: string;
  slug: string;
  name: string;
}

export interface RecipeDetail extends Recipe {
  steps: Step[];
  ingredients: RecipeIngredient[];
  tags: Tag[];
  cuisines: Cuisine[];
  utensils: Utensil[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Fetch a list of recipes with optional filters.
 */
export async function getRecipes(options?: {
  page?: number;
  limit?: number;
  cuisine?: string;
  tag?: string;
}): Promise<PaginatedResponse<Recipe>> {
  const params = new URLSearchParams();

  if (options?.page) params.set("page", options.page.toString());
  if (options?.limit) params.set("limit", options.limit.toString());
  if (options?.cuisine) params.set("cuisine", options.cuisine);
  if (options?.tag) params.set("tag", options.tag);

  const url = `${API_URL}/api/recipes?${params.toString()}`;

  const response = await fetch(url, {
    // Next.js specific: revalidate data every 60 seconds
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return response.json();
}

/**
 * Fetch a single recipe by its slug.
 */
export async function getRecipeBySlug(
  slug: string
): Promise<RecipeDetail | null> {
  const url = `${API_URL}/api/recipes/slug/${slug}`;

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch recipe");
  }

  const data: SingleResponse<RecipeDetail> = await response.json();
  return data.data;
}

/**
 * Get difficulty label in Spanish.
 */
export function getDifficultyLabel(difficulty: "1" | "2" | "3"): string {
  const labels = {
    "1": "Fácil",
    "2": "Medio",
    "3": "Difícil",
  };
  return labels[difficulty];
}
