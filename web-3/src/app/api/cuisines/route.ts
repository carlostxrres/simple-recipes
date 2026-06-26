import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Cuisine } from "@/lib/types";

export async function GET() {
  try {
    const cuisines = await query<Cuisine>("SELECT id, slug, name FROM cuisines ORDER BY name");
    return NextResponse.json({ success: true, data: cuisines });
  } catch (error) {
    console.error("Error fetching cuisines:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch cuisines" }, { status: 500 });
  }
}
