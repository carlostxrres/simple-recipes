"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconClock,
  IconTag,
  IconWorld,
  IconLeaf,
  IconAlertTriangle,
  IconChevronDown,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Tag, Cuisine, Allergen, Ingredient } from "@/lib/types";

interface SearchFiltersProps {
  tags: Tag[];
  cuisines: Cuisine[];
  allergens: Allergen[];
  ingredients: Ingredient[];
  initialFilters: {
    search?: string;
    tag?: string;
    cuisine?: string;
    includeIngredients?: string[];
    excludeAllergens?: string[];
    maxTime?: number;
  };
}

export function SearchFilters({
  tags,
  cuisines,
  allergens,
  ingredients,
  initialFilters,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialFilters.search || "");
  const [selectedTag, setSelectedTag] = useState(initialFilters.tag || "");
  const [selectedCuisine, setSelectedCuisine] = useState(
    initialFilters.cuisine || ""
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    initialFilters.includeIngredients || []
  );
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>(
    initialFilters.excludeAllergens || []
  );
  const [maxTime, setMaxTime] = useState(initialFilters.maxTime || 0);
  const [showFilters, setShowFilters] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState("");

  const activeFilterCount =
    (selectedTag ? 1 : 0) +
    (selectedCuisine ? 1 : 0) +
    selectedIngredients.length +
    excludedAllergens.length +
    (maxTime > 0 ? 1 : 0);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (selectedTag) params.set("tag", selectedTag);
    if (selectedCuisine) params.set("cuisine", selectedCuisine);
    if (maxTime > 0) params.set("maxTime", maxTime.toString());
    selectedIngredients.forEach((ing) => params.append("includeIngredients", ing));
    excludedAllergens.forEach((al) => params.append("excludeAllergens", al));

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }, [search, selectedTag, selectedCuisine, selectedIngredients, excludedAllergens, maxTime, router]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTag("");
    setSelectedCuisine("");
    setSelectedIngredients([]);
    setExcludedAllergens([]);
    setMaxTime(0);
    startTransition(() => {
      router.push("/");
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const toggleIngredient = (slug: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(slug) ? prev.filter((i) => i !== slug) : [...prev, slug]
    );
  };

  const toggleAllergen = (slug: string) => {
    setExcludedAllergens((prev) =>
      prev.includes(slug) ? prev.filter((a) => a !== slug) : [...prev, slug]
    );
  };

  const filteredIngredients = ingredients.filter(
    (ing) =>
      !ing.is_pantry_ingredient &&
      ing.name.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar recetas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button type="submit" size="lg" disabled={isPending}>
          <IconSearch className="w-5 h-5" />
          <span className="hidden sm:inline">Buscar</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <IconFilter className="w-5 h-5" />
          <span className="hidden sm:inline">Filtros</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </form>

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="glass-frost rounded-2xl p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Tag filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                    <IconTag className="w-4 h-4" />
                    Etiqueta
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        className="w-full justify-between"
                      >
                        {selectedTag
                          ? tags.find((t) => t.slug === selectedTag)?.name
                          : "Todas"}
                        <IconChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2">
                      <ScrollArea className="h-64">
                        <div className="space-y-1">
                          <button
                            onClick={() => setSelectedTag("")}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              !selectedTag
                                ? "bg-primary-100 text-primary-700"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            Todas
                          </button>
                          {tags.map((tag) => (
                            <button
                              key={tag.id}
                              onClick={() => setSelectedTag(tag.slug)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedTag === tag.slug
                                  ? "bg-primary-100 text-primary-700"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Cuisine filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                    <IconWorld className="w-4 h-4" />
                    Cocina
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        className="w-full justify-between"
                      >
                        {selectedCuisine
                          ? cuisines.find((c) => c.slug === selectedCuisine)
                              ?.name
                          : "Todas"}
                        <IconChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2">
                      <ScrollArea className="h-64">
                        <div className="space-y-1">
                          <button
                            onClick={() => setSelectedCuisine("")}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              !selectedCuisine
                                ? "bg-primary-100 text-primary-700"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            Todas
                          </button>
                          {cuisines.map((cuisine) => (
                            <button
                              key={cuisine.id}
                              onClick={() => setSelectedCuisine(cuisine.slug)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedCuisine === cuisine.slug
                                  ? "bg-primary-100 text-primary-700"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {cuisine.name}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Ingredients filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                    <IconLeaf className="w-4 h-4" />
                    Ingredientes
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        className="w-full justify-between"
                      >
                        {selectedIngredients.length > 0
                          ? `${selectedIngredients.length} seleccionados`
                          : "Cualquiera"}
                        <IconChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3">
                      <Input
                        placeholder="Buscar ingrediente..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                        className="mb-3"
                      />
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {filteredIngredients.slice(0, 50).map((ingredient) => (
                            <label
                              key={ingredient.id}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedIngredients.includes(
                                  ingredient.slug
                                )}
                                onCheckedChange={() =>
                                  toggleIngredient(ingredient.slug)
                                }
                              />
                              <span className="text-sm">{ingredient.name}</span>
                            </label>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Allergens filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                    <IconAlertTriangle className="w-4 h-4" />
                    Excluir alérgenos
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        className="w-full justify-between"
                      >
                        {excludedAllergens.length > 0
                          ? `${excludedAllergens.length} excluidos`
                          : "Ninguno"}
                        <IconChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {allergens.map((allergen) => (
                            <label
                              key={allergen.id}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <Checkbox
                                checked={excludedAllergens.includes(
                                  allergen.slug
                                )}
                                onCheckedChange={() =>
                                  toggleAllergen(allergen.slug)
                                }
                              />
                              <span className="text-sm">{allergen.name}</span>
                            </label>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time filter */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                    <IconClock className="w-4 h-4" />
                    Tiempo máximo
                  </label>
                  <div className="space-y-3 pt-1">
                    <Slider
                      value={[maxTime]}
                      onValueChange={([value]) => setMaxTime(value)}
                      max={120}
                      step={5}
                    />
                    <div className="text-center text-sm text-text-secondary">
                      {maxTime === 0
                        ? "Sin límite"
                        : maxTime >= 120
                        ? "2+ horas"
                        : `${maxTime} min`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected filters badges */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                  <span className="text-sm text-text-secondary">Activos:</span>
                  {selectedTag && (
                    <Badge variant="default" className="gap-1">
                      {tags.find((t) => t.slug === selectedTag)?.name}
                      <button onClick={() => setSelectedTag("")}>
                        <IconX className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedCuisine && (
                    <Badge variant="default" className="gap-1">
                      {cuisines.find((c) => c.slug === selectedCuisine)?.name}
                      <button onClick={() => setSelectedCuisine("")}>
                        <IconX className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedIngredients.map((slug) => (
                    <Badge key={slug} variant="secondary" className="gap-1">
                      {ingredients.find((i) => i.slug === slug)?.name}
                      <button onClick={() => toggleIngredient(slug)}>
                        <IconX className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {excludedAllergens.map((slug) => (
                    <Badge key={slug} variant="danger" className="gap-1">
                      Sin {allergens.find((a) => a.slug === slug)?.name}
                      <button onClick={() => toggleAllergen(slug)}>
                        <IconX className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {maxTime > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      Máx. {maxTime} min
                      <button onClick={() => setMaxTime(0)}>
                        <IconX className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={clearFilters}>
                  Limpiar todo
                </Button>
                <Button onClick={applyFilters} disabled={isPending}>
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
