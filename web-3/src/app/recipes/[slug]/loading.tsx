import { IconChefHat } from "@tabler/icons-react";

export default function RecipeLoading() {
  return (
    <main className="min-h-screen">
      {/* Back button skeleton */}
      <div className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-3">
          <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <section className="relative">
        <div className="h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse flex items-center justify-center">
          <IconChefHat className="w-16 h-16 text-gray-300" />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-32 sm:-mt-40 glass-frost rounded-2xl p-6 md:p-8 space-y-4">
            {/* Tags skeleton */}
            <div className="flex gap-2">
              <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* Title skeleton */}
            <div className="w-3/4 h-10 bg-gray-200 rounded-lg animate-pulse" />

            {/* Headline skeleton */}
            <div className="w-full h-6 bg-gray-200 rounded-lg animate-pulse" />

            {/* Meta info skeleton */}
            <div className="flex gap-4">
              <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Content skeletons */}
      <div className="container mx-auto px-4 mt-8 space-y-8">
        {/* Ingredients skeleton */}
        <div className="glass-frost rounded-2xl p-6">
          <div className="w-40 h-8 bg-gray-200 rounded-lg animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/50"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps skeleton */}
        <div className="glass-frost rounded-2xl p-6">
          <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse mb-6" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
