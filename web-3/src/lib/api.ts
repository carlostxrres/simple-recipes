import type {
  Recipe,
  RecipeDetail,
  PaginatedResponse,
  SingleResponse,
  SearchFilters,
  Tag,
  Cuisine,
  Allergen,
  Ingredient,
  Utensil,
} from "./types";

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") return ""; // browser: relative URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel server-side
  return "http://localhost:3000"; // local dev
}
const API_URL = getApiBaseUrl();

// Helper function to build query string
function buildQueryString(params: Record<string, string | string[] | number | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, String(value));
      }
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// Get recipes with filters
export async function getRecipes(
  filters: SearchFilters = {}
): Promise<PaginatedResponse<Recipe>> {
  const queryString = buildQueryString({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    tag: filters.tag,
    cuisine: filters.cuisine,
    includeIngredients: filters.includeIngredients,
    excludeIngredients: filters.excludeIngredients,
    includeUtensils: filters.includeUtensils,
    excludeUtensils: filters.excludeUtensils,
    excludeAllergens: filters.excludeAllergens,
    maxTime: filters.maxTime,
  });

  const res = await fetch(`${API_URL}/api/recipes${queryString}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch recipes: ${res.status} ${res.statusText} (url: ${API_URL}/api/recipes)`)
  }

  return res.json();
}

// Get a single recipe by slug
export async function getRecipeBySlug(
  slug: string
): Promise<SingleResponse<RecipeDetail>> {
  const res = await fetch(`${API_URL}/api/recipes/slug/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipe");
  }

  return res.json();
}

// Get all tags
export async function getTags(): Promise<{ success: boolean; data: Tag[] }> {
  const res = await fetch(`${API_URL}/api/tags`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }

  return res.json();
}

// Get all cuisines
export async function getCuisines(): Promise<{ success: boolean; data: Cuisine[] }> {
  const res = await fetch(`${API_URL}/api/cuisines`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cuisines");
  }

  return res.json();
}

// Get all allergens
export async function getAllergens(): Promise<{ success: boolean; data: Allergen[] }> {
  const res = await fetch(`${API_URL}/api/allergens`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch allergens");
  }

  return res.json();
}

// Get all utensils (returns empty list if endpoint not yet available)
export async function getUtensils(): Promise<{ success: boolean; data: Utensil[] }> {
  try {
    const res = await fetch(`${API_URL}/api/utensils`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { success: false, data: [] };
    return res.json();
  } catch {
    return { success: false, data: [] };
  }
}

// Get all ingredients (for search)
export async function getIngredients(): Promise<{ success: boolean; data: Ingredient[] }> {
  const res = await fetch(`${API_URL}/api/ingredients`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch ingredients");
  }

  return res.json();
}

export { getDifficultyLabel, getDifficultyColor, formatTime, formatQuantity } from "./format";
