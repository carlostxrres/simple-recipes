import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Tag } from "@/lib/types";

export async function GET() {
  try {
    const tags = await query<Tag>("SELECT id, slug, name FROM tags ORDER BY name");
    return NextResponse.json({ success: true, data: tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tags" }, { status: 500 });
  }
}
