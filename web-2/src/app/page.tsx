import { Suspense } from "react";
import { IconChefHat } from "@tabler/icons-react";
import { getRecipes, getTags, getCuisines, getAllergens, getIngredients } from "@/lib/api";
import { SearchFilters } from "@/components/search-filters";
import { RecipeCard } from "@/components/recipe-card";
import { Pagination } from "@/components/pagination";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tag?: string;
    cuisine?: string;
    includeIngredients?: string | string[];
    excludeAllergens?: string | string[];
    maxTime?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const tag = params.tag || "";
  const cuisine = params.cuisine || "";
  const maxTime = params.maxTime ? parseInt(params.maxTime) : undefined;

  // Handle array params
  const includeIngredients = params.includeIngredients
    ? Array.isArray(params.includeIngredients)
      ? params.includeIngredients
      : [params.includeIngredients]
    : [];
  const excludeAllergens = params.excludeAllergens
    ? Array.isArray(params.excludeAllergens)
      ? params.excludeAllergens
      : [params.excludeAllergens]
    : [];

  // Fetch data in parallel
  const [recipesData, tagsData, cuisinesData, allergensData, ingredientsData] =
    await Promise.all([
      getRecipes({
        page,
        limit: 12,
        search,
        tag,
        cuisine,
        includeIngredients,
        excludeAllergens,
        maxTime,
      }),
      getTags(),
      getCuisines(),
      getAllergens(),
      getIngredients(),
    ]);

  const recipes = recipesData.data;
  const pagination = recipesData.pagination;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <IconChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Recetas</h1>
              <p className="text-xs text-text-secondary">
                Descubre sabores increíbles
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Search and filters */}
        <section>
          <Suspense fallback={<div className="h-12 bg-gray-100 rounded-xl animate-pulse" />}>
            <SearchFilters
              tags={tagsData.data}
              cuisines={cuisinesData.data}
              allergens={allergensData.data}
              ingredients={ingredientsData.data}
              initialFilters={{
                search,
                tag,
                cuisine,
                includeIngredients,
                excludeAllergens,
                maxTime,
              }}
            />
          </Suspense>
        </section>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            {pagination.total === 0
              ? "No se encontraron recetas"
              : pagination.total === 1
              ? "1 receta encontrada"
              : `${pagination.total} recetas encontradas`}
          </h2>
        </div>

        {/* Recipe grid */}
        {recipes.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </section>
        ) : (
          <div className="glass-frost rounded-2xl p-12 text-center">
            <IconChefHat className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No hay recetas que coincidan
            </h3>
            <p className="text-text-secondary">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
        />
      </div>
    </main>
  );
}
