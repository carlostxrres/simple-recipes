import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Ingredient } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const pantry = request.nextUrl.searchParams.get("pantry");

    let ingredients: Ingredient[];
    if (pantry === "true") {
      ingredients = await query<Ingredient>(
        "SELECT id, slug, name, is_pantry_ingredient FROM ingredients WHERE is_pantry_ingredient = true ORDER BY name"
      );
    } else if (pantry === "false") {
      ingredients = await query<Ingredient>(
        "SELECT id, slug, name, is_pantry_ingredient FROM ingredients WHERE is_pantry_ingredient = false ORDER BY name"
      );
    } else {
      ingredients = await query<Ingredient>(
        "SELECT id, slug, name, is_pantry_ingredient FROM ingredients ORDER BY name"
      );
    }

    return NextResponse.json({ success: true, data: ingredients });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch ingredients" }, { status: 500 });
  }
}
