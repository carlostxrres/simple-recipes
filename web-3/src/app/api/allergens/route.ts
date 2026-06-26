import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Allergen } from "@/lib/types";

export async function GET() {
  try {
    const allergens = await query<Allergen>("SELECT id, slug, name FROM allergens ORDER BY name");
    return NextResponse.json({ success: true, data: allergens });
  } catch (error) {
    console.error("Error fetching allergens:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch allergens" }, { status: 500 });
  }
}
