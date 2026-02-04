/**
 * HOME PAGE
 *
 * Displays a list of recipes with pagination.
 * This is a Server Component - it fetches data on the server before sending HTML to the browser.
 */

import Link from "next/link";
import { getRecipes, getDifficultyLabel } from "@/lib/api";

// This tells Next.js this is a dynamic page that reads searchParams
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; cuisine?: string; tag?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const cuisine = params.cuisine;
  const tag = params.tag;

  // Fetch recipes from our API (this happens on the server!)
  const { data: recipes, pagination } = await getRecipes({
    page,
    limit: 12,
    cuisine,
    tag,
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Recetas</h1>
          <p className="text-gray-600 mt-1">
            {pagination.total} recetas disponibles
          </p>
        </div>
      </header>

      {/* Filters (if active) */}
      {(cuisine || tag) && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Filtros:</span>
            {cuisine && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Cocina: {cuisine}
              </span>
            )}
            {tag && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Tag: {tag}
              </span>
            )}
            <Link
              href="/"
              className="text-red-600 hover:text-red-800 text-sm ml-2"
            >
              Limpiar filtros
            </Link>
          </div>
        </div>
      )}

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Recipe Image */}
              <div className="h-48 bg-gray-200 relative">
                {recipe.image_url ? (
                  <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-white text-6xl">🍳</span>
                  </div>
                )}
              </div>

              {/* Recipe Info */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {recipe.name}
                </h2>
                <p className="text-gray-600 text-sm mb-3">{recipe.headline}</p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <ClockIcon />
                    {recipe.time_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefIcon />
                    {getDifficultyLabel(recipe.difficulty)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FireIcon />
                    {recipe.nutrition_energy_kcal} kcal
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}${cuisine ? `&cuisine=${cuisine}` : ""}${tag ? `&tag=${tag}` : ""}`}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Anterior
            </Link>
          )}

          <span className="px-4 py-2 text-gray-600">
            Página {pagination.page} de {pagination.totalPages}
          </span>

          {page < pagination.totalPages && (
            <Link
              href={`/?page=${page + 1}${cuisine ? `&cuisine=${cuisine}` : ""}${tag ? `&tag=${tag}` : ""}`}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Siguiente →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

// Simple icon components
function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
  );
}

function ChefIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" d="M12 4a4 4 0 014 4v1a3 3 0 013 3v2a3 3 0 01-3 3H8a3 3 0 01-3-3v-2a3 3 0 013-3V8a4 4 0 014-4z" />
      <path strokeWidth="2" d="M8 17v3h8v-3" />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" d="M12 21c-4-3-6-6-6-9a6 6 0 0112 0c0 3-2 6-6 9z" />
      <path strokeWidth="2" d="M12 13a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );
}
