/**
 * =============================================================================
 * TYPE DEFINITIONS
 * =============================================================================
 *
 * TypeScript types that match our database schema.
 * These help catch errors at compile time and provide better autocomplete.
 *
 * =============================================================================
 */

// Basic lookup types (allergens, tags, cuisines, utensils all have this shape)
export interface LookupItem {
  id: string;
  slug: string;
  name: string;
}

export interface Allergen extends LookupItem {}
export interface Tag extends LookupItem {}
export interface Cuisine extends LookupItem {}
export interface Utensil extends LookupItem {}

// Ingredient
export interface Ingredient {
  id: string;
  slug: string;
  name: string;
  is_pantry_ingredient: boolean;
}

// Recipe (main entity)
export interface Recipe {
  id: string;
  slug: string;
  is_active: boolean;
  created_at: Date;
  last_updated_at: Date;
  name: string;
  headline: string;
  description: string;
  has_image: boolean;
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

// Step
export interface Step {
  id: string;
  recipe_id: string;
  step_order: number;
  instructions: string;
  has_image: boolean;
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
  quantity_amount: number | null;
  quantity_unit: string | null;
  allergens: IngredientAllergen[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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
