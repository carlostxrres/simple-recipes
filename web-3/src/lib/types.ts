// Basic lookup types
export interface LookupItem {
  id: string;
  slug: string;
  name: string;
}

export interface Allergen extends LookupItem {}
export interface Tag extends LookupItem {}
export interface Cuisine extends LookupItem {}
export interface Utensil extends LookupItem {}

export interface Ingredient extends LookupItem {
  is_pantry_ingredient: boolean;
}

// Allergen info for an ingredient
export interface IngredientAllergen {
  id: string;
  slug: string;
  name: string;
  traces_of: boolean;
}

// Recipe ingredient (with quantity info)
export interface RecipeIngredient {
  ingredient_id: string;
  name: string;
  slug: string;
  is_pantry_ingredient: boolean;
  quantity_amount: number | null;
  quantity_unit: string | null;
  allergens: IngredientAllergen[];
}

// Step
export interface Step {
  id: string;
  recipe_id: string;
  step_order: number;
  instructions: string;
  has_image: boolean;
  image_url: string | null;
}

// Recipe (main entity)
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

// Recipe with all related data (for detailed view)
export interface RecipeDetail extends Recipe {
  steps: Step[];
  ingredients: RecipeIngredient[];
  tags: Tag[];
  cuisines: Cuisine[];
  utensils: Utensil[];
}

// API response types
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

// Allergen entry with ingredient breakdown (used for allergen display and cross-referencing)
export interface AllergenEntry {
  id: string
  name: string
  slug: string
  ingredients: { name: string; traces_of: boolean }[]
}

// Search/filter options
export interface SearchFilters {
  search?: string;
  tag?: string | string[];
  cuisine?: string;
  includeIngredients?: string[];
  excludeIngredients?: string[];
  includeUtensils?: string[];
  excludeUtensils?: string[];
  excludeAllergens?: string[];
  maxTime?: number;
  page?: number;
  limit?: number;
  seed?: string;
}
