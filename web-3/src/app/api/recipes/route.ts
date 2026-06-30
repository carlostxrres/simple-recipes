import { NextRequest, NextResponse } from "next/server";
import { getRecipes } from "@/lib/queries";
import type { SearchFilters } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;
    const filters: SearchFilters = {
      search: p.get("search") || undefined,
      tag: p.getAll("tag"),
      cuisine: p.get("cuisine") || undefined,
      includeIngredients: p.getAll("includeIngredients"),
      excludeIngredients: p.getAll("excludeIngredients"),
      includeUtensils: p.getAll("includeUtensils"),
      excludeUtensils: p.getAll("excludeUtensils"),
      excludeAllergens: p.getAll("excludeAllergens"),
      maxTime: Number(p.get("maxTime")) || undefined,
      page: Number(p.get("page")) || undefined,
      limit: Number(p.get("limit")) || undefined,
      seed: p.get("seed") || undefined,
    };
    return NextResponse.json(await getRecipes(filters));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
