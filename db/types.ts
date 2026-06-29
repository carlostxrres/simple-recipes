// Branded types
type RecipeId = string & { readonly __brand: "RecipeId" };
type TagId = string & { readonly __brand: "TagId" };
type CuisineId = string & { readonly __brand: "CuisineId" };
type UtensilId = string & { readonly __brand: "UtensilId" };
type StepId = string & { readonly __brand: "StepId" };
type IngredientId = string & { readonly __brand: "IngredientId" };
type AllergenId = string & { readonly __brand: "AllergenId" };

// Table Recipes - to do: create and populate
interface Recipe {
    id: RecipeId;
    isActive: boolean;
    createdAt: string; // ISO 8601 date string
    lastUpdatedAt: string; // ISO 8601 date string
    name: string;
    headline: string;
    descriptionHTML: string;
    imageURL?: string;
    ingredients: RecipeIngredient[]; // Ingredients for 2 servings
    steps: StepId[];
    time: number; // Duration in minutes
    tags: TagId[];
    cuisines: CuisineId[];
    utensils: UtensilId[];
    nutrition: Nutrition; // Nutrition per 100g of prepared recipe
    difficulty: 1 | 2 | 3;
}

interface RecipeIngredient {
    ingredient: IngredientId;
    quantity: RecipeQuantity;
}

type RecipeQuantity = "Al gusto" | {
    amount: number;
    unit: RecipeUnit;
}

enum RecipeUnit {
    CucharadaS = "cucharada(s)",
    CucharaditaS = "cucharadita(s)",
    GramoS = "gramo(s)",
    MililitroS = "mililitro(s)",
    Paquete = "paquete",
    PizcaS = "pizca(s)",
    PouchEs = "pouch(es)",
    SobreS = "sobre(s)",
    UnidadEs = "unidad(es)",
}

// Nutrition values per 100g of prepared recipe
interface Nutrition {
    energyKj: number; // kJ, "Valor energético (kJ)"
    energyKcal: number; // kcal, "Valor energético (kcal)"
    fat: number; // g, "Grasas"
    fatSaturated: number; // g, "de las cuales saturadas"
    carbs: number; // g, "Carbohidratos"
    carbsSugar: number; // g, "de los cuales azúcares"
    fiber: number; // g, "Fibra"
    protein: number; // g, "Proteínas"
    sodium: number; // mg, "Sodio"
}

// Table Ingredients - to do: create and populate
interface Ingredient {
    id: IngredientId;
    slug: string;
    name: string;
    isPantryIngredient: boolean;
    allergens: IngredientAllergen[];
}

interface IngredientAllergen {
    allergenId: AllergenId;
    tracesOf: boolean;
}

// Table Allergens - to do: create and populate
interface Allergen {
    id: AllergenId;
    slug: string;
    name: AllergenName;
}
enum AllergenName {
    Almendras = "Almendras",
    Anacardos = "Anacardos",
    Apio = "Apio",
    Avellanas = "Avellanas",
    Cacahuetes = "Cacahuetes",
    Crustaceos = "Crustáceos",
    FrutosSecos = "Frutos secos",
    Gluten = "Gluten",
    Huevo = "Huevo",
    Leche = "Leche",
    Lupino = "Lupino",
    Moluscos = "Moluscos",
    Mostaza = "Mostaza",
    Nueces = "Nueces",
    NuecesDeBrasil = "Nueces de Brasil",
    NuecesDeMacadamia = "Nueces de Macadamia",
    NuecesDePecan = "Nueces de pecán",
    Pescado = "Pescado",
    Pistachos = "Pistachos",
    Soja = "Soja",
    Sulfitos = "Sulfitos",
    Sesamo = "Sésamo",
    Trigo = "Trigo",
}

// Table Tags - to do: create and populate
interface Tag {
    id: TagId;
    slug: string;
    name: string;
}

// Table Cuisines - to do: create and populate
interface Cuisine {
    id: CuisineId;
    slug: string;
    name: string;
}

// Table Utensils - to do: create and populate
interface Utensil {
    id: UtensilId;
    slug: string;
    name: string;
}

// Table Steps - to do: create and populate
interface Step {
    id: StepId;
    instructionsHTML: string;
    tip?: string;
    imageURL?: string;
}