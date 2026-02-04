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
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
    excludeAllergens: filters.excludeAllergens,
    maxTime: filters.maxTime,
  });

  const res = await fetch(`${API_URL}/api/recipes${queryString}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
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

// Get difficulty label in Spanish
export function getDifficultyLabel(difficulty: "1" | "2" | "3"): string {
  const labels: Record<string, string> = {
    "1": "Fácil",
    "2": "Media",
    "3": "Difícil",
  };
  return labels[difficulty] || difficulty;
}

// Get difficulty color classes
export function getDifficultyColor(difficulty: "1" | "2" | "3"): string {
  const colors: Record<string, string> = {
    "1": "bg-green-100 text-green-700",
    "2": "bg-yellow-100 text-yellow-700",
    "3": "bg-red-100 text-red-700",
  };
  return colors[difficulty] || "bg-gray-100 text-gray-700";
}

// Format time in minutes to readable string
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${mins} min`;
}

// Format quantity with unit
export function formatQuantity(
  amount: number | null,
  unit: string | null,
  servings: number = 2
): string {
  if (amount === null) {
    return "Al gusto";
  }

  // Adjust for servings (base is 2)
  const adjustedAmount = (amount * servings) / 2;

  // Format number nicely
  const formatted =
    adjustedAmount % 1 === 0
      ? adjustedAmount.toString()
      : adjustedAmount.toFixed(1).replace(/\.0$/, "");

  if (!unit) {
    return formatted;
  }

  return `${formatted} ${unit}`;
}
